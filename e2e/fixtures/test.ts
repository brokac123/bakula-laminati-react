import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ContactPage } from "../pages/ContactPage";
import { NotFoundPage } from "../pages/NotFoundPage";

interface Pages {
  homePage: HomePage;
  catalogPage: CatalogPage;
  productDetailPage: ProductDetailPage;
  contactPage: ContactPage;
  notFoundPage: NotFoundPage;
}

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),
});

export { expect } from "@playwright/test";
