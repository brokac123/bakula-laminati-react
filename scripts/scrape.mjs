// One-off scraper: pulls the product catalog from the live WordPress/WooCommerce
// site (bakula-laminati.hr) into local JSON + downloaded images for the React rebuild.
// Run with: node scripts/scrape.mjs
import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://bakula-laminati.hr";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const IMAGES_DIR = path.join(ROOT, "public", "images", "products");

const CATALOG_PAGES = 7;
const FETCH_CONCURRENCY = 5;
const IMAGE_CONCURRENCY = 5;

function slugify(url) {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

async function getHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

// Simple concurrency-limited map.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// --- Category tree (from the /katalog/ sidebar widget) ---
function parseCategoryTree($) {
  const list = $("aside.widget_product_categories > ul.product-categories");
  const categories = [];

  list.children("li.cat-item").each((_, el) => {
    const $li = $(el);
    const $link = $li.children("a").first();
    const name = $link.text().trim();
    const slug = slugify($link.attr("href"));
    const count = Number($li.children("span.count").first().text().trim() || 0);

    const children = [];
    $li.children("ul.children").children("li.cat-item").each((__, childEl) => {
      const $child = $(childEl);
      const $childLink = $child.children("a").first();
      children.push({
        slug: slugify($childLink.attr("href")),
        name: $childLink.text().trim(),
        count: Number($child.children("span.count").first().text().trim() || 0),
      });
    });

    categories.push({ slug, name, count, children });
  });

  // "Lajsne" is advertised in nav/menus but has zero live products on the source
  // site (its links point to "#") — keep it as an empty, coming-soon category.
  categories.push({ slug: "lajsne", name: "Lajsne", count: 0, children: [] });

  return categories;
}

// --- Product URL discovery across /katalog/ + paginated pages ---
async function collectProductUrls() {
  const urls = new Set();
  const pageNumbers = Array.from({ length: CATALOG_PAGES }, (_, i) => i + 1);

  await mapLimit(pageNumbers, FETCH_CONCURRENCY, async (page) => {
    const url = page === 1 ? `${BASE}/katalog/` : `${BASE}/katalog/page/${page}/`;
    const html = await getHtml(url);
    const $ = cheerio.load(html);
    $("li.product > a.woocommerce-loop-product__link").each((_, el) => {
      const href = $(el).attr("href");
      if (href) urls.add(href);
    });
    console.log(`  page ${page}: ok`);
  });

  return [...urls];
}

// --- Product detail parsing ---
function parseSpecTable($, $table) {
  const spec = {};
  $table.find("tr.woocommerce-product-attributes-item").each((_, row) => {
    const $row = $(row);
    const label = $row.find("th").text().trim();
    // Value markup varies by product type: some wrap links in
    // <span class="text-label">, others link directly inside <td>.
    const value = $row
      .find("td a")
      .map((__, a) => $(a).text().trim())
      .get()
      .join(", ");
    if (label && value) spec[label] = value;
  });
  return spec;
}

async function parseProduct(url) {
  const slug = slugify(url);
  const html = await getHtml(url);
  const $ = cheerio.load(html);

  const $wrapper = $("div.product[id^='product-']").first();
  const name = $("h1.product_title").first().text().trim();

  const categories = ($wrapper.attr("class") || "")
    .split(/\s+/)
    .filter((c) => c.startsWith("product_cat-"))
    .map((c) => c.replace("product_cat-", ""));

  const images = [];
  $wrapper
    .find(".woocommerce-product-gallery__wrapper > div > a")
    .each((_, el) => {
      const href = $(el).attr("href");
      if (href) images.push(href);
    });

  // Section title markup is inconsistent across product pages: some use
  // <h3 class="product-attributes-title">, some <p><strong>...</strong></p>,
  // some a bare <strong>, and some plain text with no wrapping tag at all
  // (malformed HTML missing an opening <p>). All of these land as text
  // somewhere before the table within the same container, so scan each
  // table's container in document order and take the nearest preceding
  // non-empty text as the section title, resetting after each table so a
  // container with two tables (e.g. "Dimenzije" + "Materijal" side by side)
  // assigns titles correctly.
  const specSections = {};
  const seenTables = new Set();
  $wrapper.find("table.woocommerce-product-attributes.shop_attributes").each((_, el) => {
    if (seenTables.has(el)) return;
    const $container = $(el).parent();
    let label = "Ostalo";
    for (const node of $container.contents().toArray()) {
      if (node.type === "tag" && node.name === "table") {
        if (node === el) {
          specSections[label] = parseSpecTable($, $(node));
          seenTables.add(node);
          label = "Ostalo";
        } else if ($(node).hasClass("woocommerce-product-attributes")) {
          specSections[label] = parseSpecTable($, $(node));
          seenTables.add(node);
          label = "Ostalo";
        }
        continue;
      }
      const text = $(node).text().trim();
      if (text) label = text;
    }
  });

  const related = [];
  $wrapper
    .parent()
    .find("section.related.products li.product > a.woocommerce-loop-product__link")
    .each((_, el) => {
      const href = $(el).attr("href");
      if (href) related.push(slugify(href));
    });

  return { slug, url, name, categories, images, spec: specSections, related };
}

// --- Image downloading ---
function imageFilename(imageUrl) {
  return path.basename(new URL(imageUrl).pathname);
}

async function downloadImage(imageUrl, destDir) {
  const filename = imageFilename(imageUrl);
  const destPath = path.join(destDir, filename);
  if (existsSync(destPath)) return filename;
  const res = await fetch(imageUrl);
  if (!res.ok) {
    console.warn(`    image failed ${res.status}: ${imageUrl}`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return filename;
}

async function downloadProductImages(product) {
  const destDir = path.join(IMAGES_DIR, product.slug);
  await mkdir(destDir, { recursive: true });
  const filenames = await mapLimit(product.images, IMAGE_CONCURRENCY, (imgUrl) =>
    downloadImage(imgUrl, destDir),
  );
  return filenames.filter(Boolean).map((f) => `/images/products/${product.slug}/${f}`);
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  console.log("Fetching category tree...");
  const katalogHtml = await getHtml(`${BASE}/katalog/`);
  const categories = parseCategoryTree(cheerio.load(katalogHtml));
  await writeFile(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));
  console.log(`  wrote ${categories.length} top-level categories`);

  console.log("Collecting product URLs from catalog pages...");
  const urls = await collectProductUrls();
  console.log(`  found ${urls.length} unique product URLs`);

  console.log("Fetching product detail pages...");
  let done = 0;
  const products = await mapLimit(urls, FETCH_CONCURRENCY, async (url) => {
    const product = await parseProduct(url);
    done++;
    console.log(`  [${done}/${urls.length}] ${product.slug}`);
    return product;
  });

  console.log("Downloading product images...");
  let imgDone = 0;
  for (const product of products) {
    product.localImages = await downloadProductImages(product);
    imgDone++;
    console.log(`  [${imgDone}/${products.length}] ${product.slug}: ${product.localImages.length} images`);
  }

  await writeFile(path.join(DATA_DIR, "products.json"), JSON.stringify(products, null, 2));
  console.log(`Done. Wrote ${products.length} products to src/data/products.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
