import { expect, test } from "../fixtures/test";
import {
  categories,
  countByCategorySlug,
  EMPTY_CATEGORY_SLUG,
  findSubCategoryFittingOnePage,
  findTopLevelCategoryWithMultiplePages,
  products,
  searchCount,
} from "../utils/testData";

const PAGE_SIZE = 12;

test.describe("Catalog listing", () => {
  test("shows every product by default @smoke", async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.productCount).toHaveText(`${products.length} proizvoda`);
  });

  test("filtering by a top-level category shows the matching subset and heading", async ({
    catalogPage,
  }) => {
    const expected = countByCategorySlug("laminati");
    await catalogPage.goto({ kategorija: "laminati" });

    await expect(catalogPage.heading).toHaveText("Laminati");
    await expect(catalogPage.productCount).toHaveText(`${expected} proizvoda`);
    await expect(catalogPage.productCards).toHaveCount(Math.min(expected, PAGE_SIZE));
  });

  test("the empty Lajsne category shows a coming-soon notice instead of a grid", async ({
    catalogPage,
  }) => {
    await catalogPage.goto({ kategorija: EMPTY_CATEGORY_SLUG });
    await expect(catalogPage.lajsneNotice).toBeVisible();
    await expect(catalogPage.productCards).toHaveCount(0);
  });

  test("clicking a product card opens its detail page", async ({ page, catalogPage }) => {
    await catalogPage.goto();
    const firstCard = catalogPage.productCards.first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test("filtering by a subcategory shows the matching subset and heading", async ({
    catalogPage,
  }) => {
    const sub = findSubCategoryFittingOnePage(PAGE_SIZE);
    const expected = countByCategorySlug(sub.slug);
    await catalogPage.goto({ kategorija: sub.slug });

    await expect(catalogPage.heading).toHaveText(sub.name);
    await expect(catalogPage.productCount).toHaveText(`${expected} proizvoda`);
    await expect(catalogPage.productCards).toHaveCount(expected);
  });

  test("sidebar category badges match the real product counts", async ({ catalogPage }) => {
    await catalogPage.goto();
    for (const category of categories) {
      // categoryLink() only matches a link whose accessible name ends in the
      // exact count, so a stale/wrong badge fails this with a clear "not
      // found" instead of a misleading pass.
      await expect(catalogPage.categoryLink(category.name)).toBeVisible();
    }
  });
});

test.describe("Search", () => {
  test("result count is always shown, including for a search query @smoke", async ({
    catalogPage,
  }) => {
    const expected = searchCount("hrast");
    await catalogPage.goto();
    await catalogPage.search("hrast");

    await expect(catalogPage.heading).toHaveText('Rezultati pretrage: "hrast"');
    await expect(catalogPage.productCount).toHaveText(`${expected} proizvoda`);
  });

  test("a query with no matches shows the empty state, not a crash", async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.search("zzz-nepostojeci-proizvod-zzz");
    await expect(catalogPage.emptyState).toBeVisible();
  });

  test("the search box reflects ?trazi= when landing on a search URL directly", async ({
    catalogPage,
  }) => {
    await catalogPage.goto({ trazi: "hrast" });
    await expect(catalogPage.searchInput).toHaveValue("hrast");
  });

  test("submitting an empty search just shows the full catalog", async ({ catalogPage }) => {
    await catalogPage.goto({ trazi: "hrast" });
    await catalogPage.search("");
    await expect(catalogPage.heading).toHaveText("Katalog proizvoda");
    await expect(catalogPage.productCount).toHaveText(`${products.length} proizvoda`);
  });
});

test.describe("Pagination", () => {
  const category = findTopLevelCategoryWithMultiplePages(PAGE_SIZE);
  const total = countByCategorySlug(category.slug);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  test(`splits a ${total}-product category across ${totalPages} pages`, async ({
    catalogPage,
  }) => {
    await catalogPage.goto({ kategorija: category.slug });
    await expect(catalogPage.pageButton(1)).toBeVisible();
    await expect(catalogPage.pageButton(totalPages)).toBeVisible();

    await catalogPage.pageButton(2).click();
    const remaining = total - PAGE_SIZE;
    await expect(catalogPage.productCards).toHaveCount(Math.min(remaining, PAGE_SIZE));
  });

  test("an out-of-range ?stranica= clamps to the last real page instead of showing nothing", async ({
    catalogPage,
  }) => {
    await catalogPage.goto({ kategorija: category.slug, stranica: 999 });
    const lastPageCount = total - PAGE_SIZE * (totalPages - 1);
    await expect(catalogPage.productCards).toHaveCount(lastPageCount);
  });
});
