import { expect, test } from "../fixtures/test";
import { findProductWithFullSpec, findProductWithRelated, products } from "../utils/testData";

test.describe("Product detail page", () => {
  test("renders name, image and all populated spec sections @smoke", async ({
    productDetailPage,
  }) => {
    const product = findProductWithFullSpec();
    await productDetailPage.goto(product.slug);

    await expect(productDetailPage.heading).toHaveText(product.name);
    await expect(productDetailPage.mainImage).toBeVisible();

    for (const section of ["Dimenzije", "Materijal", "Podrobnosti"] as const) {
      for (const [label, value] of Object.entries(product.spec[section])) {
        await expect(productDetailPage.specValue(section, label)).toHaveText(value);
      }
    }
  });

  test("shows related products that link to their own detail pages", async ({
    page,
    productDetailPage,
  }) => {
    const product = findProductWithRelated();
    await productDetailPage.goto(product.slug);

    await expect(productDetailPage.relatedProductsHeading).toBeVisible();
    const relatedSlug = product.related[0];
    await page.locator(`main div.grid > a[href="/proizvod/${relatedSlug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/proizvod/${relatedSlug}$`));
  });

  test("visiting an unknown slug redirects back to the catalog, not a crash", async ({
    page,
    productDetailPage,
  }) => {
    await productDetailPage.goto("ovaj-proizvod-ne-postoji");
    await expect(page).toHaveURL(/\/katalog$/);
  });

  test("the request-a-quote link goes to the contact page", async ({ page, productDetailPage }) => {
    const product = products[0];
    await productDetailPage.goto(product.slug);
    await productDetailPage.requestQuoteLink.click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });
});
