import type { Page } from "@playwright/test";
import { HeaderComponent } from "./HeaderComponent";
import { FooterComponent } from "./FooterComponent";

export class BasePage {
  protected readonly page: Page;
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
  }

  protected async gotoPath(path: string) {
    await this.page.goto(path);
  }

  /** True if the page has no horizontal overflow at the current viewport. */
  async hasNoHorizontalOverflow(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
  }
}
