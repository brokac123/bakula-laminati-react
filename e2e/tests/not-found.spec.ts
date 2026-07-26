import { expect, test } from "../fixtures/test";

test.describe("404 page", () => {
  test("renders for an unknown route, with header and footer intact @smoke", async ({
    page,
    notFoundPage,
  }) => {
    await page.goto("/ova-stranica-ne-postoji");

    await expect(notFoundPage.heading).toBeVisible();
    await expect(notFoundPage.header.root).toBeVisible();
    await expect(notFoundPage.footer.root).toBeVisible();
  });

  test("the back-home link returns to the homepage", async ({ page, notFoundPage, homePage }) => {
    await page.goto("/ova-stranica-ne-postoji");
    await notFoundPage.backHomeLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.heading).toHaveText("Vaš prostor, naša inspiracija.");
  });
});
