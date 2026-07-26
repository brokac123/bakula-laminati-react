import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotFoundPage extends BasePage {
  readonly heading: Locator;
  readonly backHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Stranica nije pronađena" });
    this.backHomeLink = page.getByRole("link", { name: "Natrag na naslovnu" });
  }
}
