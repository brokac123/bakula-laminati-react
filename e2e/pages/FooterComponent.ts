import type { Locator, Page } from "@playwright/test";

export class FooterComponent {
  readonly root: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("contentinfo");
    this.copyright = this.root.getByText(/Sva prava pridržana/);
  }

  navLink(label: string): Locator {
    return this.root.getByRole("link", { name: label, exact: true });
  }
}
