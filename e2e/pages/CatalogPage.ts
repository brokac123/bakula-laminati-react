import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CatalogPage extends BasePage {
  readonly heading: Locator;
  readonly productCount: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly emptyState: Locator;
  readonly lajsneNotice: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { level: 1 });
    this.productCount = page.getByText(/^\d+ proizvoda$/);
    this.searchInput = page.getByPlaceholder("Pretraga…");
    this.searchButton = page.getByRole("button", { name: "Pretraži" });
    // Scoped to the product grid so it doesn't also pick up the sidebar's
    // "recently viewed" links, which use the same href pattern.
    this.productCards = page.locator('main div.grid > a[href^="/proizvod/"]');
    this.emptyState = page.getByText("Nema pronađenih proizvoda.");
    this.lajsneNotice = page.getByText("Lajsne uskoro dostupne");
    this.pagination = page.getByRole("button", { name: /^\d+$/ });
  }

  async goto(params: { kategorija?: string; trazi?: string; stranica?: number } = {}) {
    const search = new URLSearchParams();
    if (params.kategorija) search.set("kategorija", params.kategorija);
    if (params.trazi) search.set("trazi", params.trazi);
    if (params.stranica) search.set("stranica", String(params.stranica));
    const qs = search.toString();
    await this.gotoPath(qs ? `/katalog?${qs}` : "/katalog");
  }

  categoryLink(name: string): Locator {
    return this.page.getByRole("link", { name: new RegExp(`^${name}\\s*\\d+$`) });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async getProductCountNumber(): Promise<number> {
    const text = await this.productCount.textContent();
    return Number(text?.match(/\d+/)?.[0] ?? NaN);
  }

  productCardByHref(slug: string): Locator {
    return this.page.locator(`main div.grid > a[href="/proizvod/${slug}"]`);
  }

  pageButton(n: number): Locator {
    return this.page.getByRole("button", { name: String(n), exact: true });
  }
}
