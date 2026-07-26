import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.gotoPath("/");
  }

  get heading() {
    return this.page.getByRole("heading", { level: 1 });
  }
}
