import { expect, test } from "../fixtures/test";
import { products } from "../utils/testData";

test.describe("Recently viewed sidebar widget", () => {
  test("viewing a product adds it to the catalog sidebar", async ({
    productDetailPage,
    catalogPage,
  }) => {
    const product = products[0];
    await productDetailPage.goto(product.slug);
    await productDetailPage.waitForRecentlyViewedRecorded(product.slug);
    await catalogPage.goto();

    await expect(catalogPage.recentlyViewedHeading).toBeVisible();
    await expect(catalogPage.recentlyViewedLinks).toHaveCount(1);
    await expect(catalogPage.recentlyViewedLinks.first()).toHaveAttribute(
      "href",
      `/proizvod/${product.slug}`,
    );
  });

  test("revisiting a product moves it to the front instead of duplicating it", async ({
    productDetailPage,
    catalogPage,
  }) => {
    const [productA, productB] = products;
    await productDetailPage.goto(productA.slug);
    await productDetailPage.waitForRecentlyViewedRecorded(productA.slug);
    await productDetailPage.goto(productB.slug);
    await productDetailPage.waitForRecentlyViewedRecorded(productB.slug);
    await productDetailPage.goto(productA.slug);
    await productDetailPage.waitForRecentlyViewedRecorded(productA.slug);
    await catalogPage.goto();

    await expect(catalogPage.recentlyViewedLinks).toHaveCount(2);
    await expect(catalogPage.recentlyViewedLinks.nth(0)).toHaveAttribute(
      "href",
      `/proizvod/${productA.slug}`,
    );
    await expect(catalogPage.recentlyViewedLinks.nth(1)).toHaveAttribute(
      "href",
      `/proizvod/${productB.slug}`,
    );
  });

  test("caps at 6 items, dropping the oldest first", async ({
    productDetailPage,
    catalogPage,
  }) => {
    const viewed = products.slice(0, 7);
    for (const product of viewed) {
      await productDetailPage.goto(product.slug);
      await productDetailPage.waitForRecentlyViewedRecorded(product.slug);
    }
    await catalogPage.goto();

    await expect(catalogPage.recentlyViewedLinks).toHaveCount(6);
    // Most recently viewed (last of the 7) leads; the very first one viewed
    // was evicted to stay under the cap.
    await expect(catalogPage.recentlyViewedLinks.first()).toHaveAttribute(
      "href",
      `/proizvod/${viewed[6].slug}`,
    );
    await expect(
      catalogPage.recentlyViewedLinks.filter({ hasText: viewed[0].name }),
    ).toHaveCount(0);
  });
});
