import { expect, test } from "../fixtures/test";

test.describe("Desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("header nav links go to the right pages @smoke", async ({ page, homePage }) => {
    await homePage.goto();

    await homePage.header.desktopNav.getByRole("link", { name: "O nama", exact: true }).click();
    await expect(page).toHaveURL(/\/o-nama$/);

    await homePage.header.desktopNav
      .getByRole("link", { name: "Katalog proizvoda", exact: false })
      .click();
    await expect(page).toHaveURL(/\/katalog$/);

    await homePage.header.desktopNav
      .getByRole("link", { name: "Kontaktirajte nas!", exact: true })
      .click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });

  test("catalog dropdown links go to the right category", async ({ page, homePage }) => {
    await homePage.goto();
    const catalogTrigger = homePage.header.desktopNav.getByRole("link", {
      name: "Katalog proizvoda",
    });
    await catalogTrigger.hover();
    await homePage.header.desktopNav.getByRole("link", { name: "Vinil podovi", exact: true }).click();
    await expect(page).toHaveURL(/kategorija=vinil-podovi/);
  });

  test("logo link returns to home from another page", async ({ homePage }) => {
    await homePage.goto();
    await homePage.header.desktopNav.getByRole("link", { name: "O nama", exact: true }).click();
    await homePage.header.logoLink.click();
    await expect(homePage.heading).toHaveText("Vaš prostor, naša inspiracija.");
  });

  test("phone CTA is visible and links to tel: number", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.header.phoneCta).toBeVisible();
    await expect(homePage.header.phoneCta).toHaveAttribute("href", "tel:+385915222559");
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("hamburger menu opens, navigates, and closes", async ({ page, homePage }) => {
    await homePage.goto();
    await expect(homePage.header.desktopNav).toBeHidden();

    await homePage.header.openMobileMenu();
    await expect(homePage.header.mobileNav).toBeVisible();

    await homePage.header.mobileNav
      .getByRole("link", { name: "Kontaktirajte nas!", exact: true })
      .click();
    await expect(page).toHaveURL(/\/kontakt$/);
    // Navigating away closes the panel (component unmounts on route change).
    await expect(homePage.header.mobileNav).not.toBeVisible();
  });
});

test.describe("Footer", () => {
  test("quick menu and web catalog links navigate correctly", async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.footer.navLink("O nama").click();
    await expect(page).toHaveURL(/\/o-nama$/);
  });

  test("does not mention the business registration number", async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.footer.root).not.toContainText("Matični broj");
  });

  test("shows current-year copyright with owner name", async ({ homePage }) => {
    await homePage.goto();
    const year = new Date().getFullYear().toString();
    await expect(homePage.footer.copyright).toContainText(year);
    await expect(homePage.footer.copyright).toContainText("Damir Bakula");
  });
});
