import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  readonly heading: Locator;
  readonly mainImage: Locator;
  readonly specSections: Locator;
  readonly relatedProductsHeading: Locator;
  readonly relatedProductLinks: Locator;
  readonly requestQuoteLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { level: 1 });
    this.mainImage = page.locator("main img").first();
    this.specSections = page.getByRole("heading", { level: 2 });
    this.relatedProductsHeading = page.getByRole("heading", { name: "Povezani proizvodi" });
    this.relatedProductLinks = page.locator(
      'main div.grid > a[href^="/proizvod/"]',
    );
    this.requestQuoteLink = page.getByRole("link", { name: "Zatražite ponudu" });
  }

  async goto(slug: string) {
    await this.gotoPath(`/proizvod/${slug}`);
  }

  /** The <dl> immediately after a spec section's <h2> (Dimenzije/Materijal/Podrobnosti). */
  specSection(section: string): Locator {
    return this.page
      .getByRole("heading", { level: 2, name: section, exact: true })
      .locator("xpath=following-sibling::dl[1]");
  }

  specValue(section: string, label: string): Locator {
    return this.specSection(section).locator("div").filter({ hasText: label }).locator("dd");
  }
}
