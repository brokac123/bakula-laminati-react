import { expect, test } from "../fixtures/test";
import {
  countByCategorySlug,
  EMPTY_CATEGORY_SLUG,
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
});
