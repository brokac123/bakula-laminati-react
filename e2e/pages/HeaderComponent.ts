import type { Locator, Page } from "@playwright/test";

/**
 * The desktop nav (`nav.lg:flex`) and the mobile nav panel (`nav.lg:hidden`,
 * only mounted when the hamburger is open) both expose the same link labels,
 * so tests must go through whichever one is actually on screen rather than a
 * bare `getByRole("navigation")`.
 */
export class HeaderComponent {
  readonly root: Locator;
  readonly logoLink: Locator;
  readonly phoneCta: Locator;
  readonly mobileMenuButton: Locator;
  readonly desktopNav: Locator;
  readonly mobileNav: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("banner");
    this.logoLink = this.root.getByRole("link", { name: "Bakula laminati" });
    this.phoneCta = this.root.getByRole("link", { name: "091-522-2559" });
    this.mobileMenuButton = this.root.getByRole("button", {
      name: /Otvori izbornik|Zatvori izbornik/,
    });
    this.desktopNav = this.root.locator("nav.lg\\:flex");
    this.mobileNav = this.root.locator("nav.lg\\:hidden");
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  async isPhoneCtaVisible(): Promise<boolean> {
    return this.phoneCta.isVisible();
  }
}
