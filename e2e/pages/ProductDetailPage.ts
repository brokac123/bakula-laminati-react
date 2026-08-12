import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  readonly heading: Locator;
  readonly mainImage: Locator;
  readonly specSections: Locator;
  readonly relatedProductsHeading: Locator;
  readonly relatedProductLinks: Locator;
  readonly requestQuoteLink: Locator;
  readonly thumbnailButtons: Locator;

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
    // Gallery thumbnails have no accessible name (decorative alt=""), so
    // they're only addressable by structure: <button><img/></button>.
    this.thumbnailButtons = page.locator("main button:has(img)");
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

  /**
   * `addRecentlyViewed` runs inside a `useEffect`, which React schedules
   * asynchronously after paint - `page.goto()` resolving on the `load` event
   * does not guarantee that effect has already fired. Callers that depend on
   * the write (e.g. navigating away right after) must wait for it explicitly.
   */
  async waitForRecentlyViewedRecorded(slug: string) {
    await this.page.waitForFunction((s) => {
      try {
        const raw = localStorage.getItem("bakula:recently-viewed");
        return raw ? (JSON.parse(raw) as string[]).includes(s) : false;
      } catch {
        return false;
      }
    }, slug);
  }
}
