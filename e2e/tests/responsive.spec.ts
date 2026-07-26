import { expect, test } from "../fixtures/test";
import { products } from "../utils/testData";

// Wired in playwright.config.ts to run only on the "Mobile Chrome" and
// "Tablet" projects, so behavior is asserted against whatever viewport each
// device profile actually uses rather than a hardcoded size.

test.describe("Responsive layout", () => {
  test("no horizontal overflow on key pages", async ({ homePage, catalogPage, productDetailPage }) => {
    await homePage.goto();
    expect(await homePage.hasNoHorizontalOverflow()).toBe(true);

    await catalogPage.goto();
    expect(await catalogPage.hasNoHorizontalOverflow()).toBe(true);

    await productDetailPage.goto(products[0].slug);
    expect(await productDetailPage.hasNoHorizontalOverflow()).toBe(true);
  });

  test("phone CTA is reachable from the sm: breakpoint up, not just lg:", async ({
    page,
    homePage,
  }) => {
    await homePage.goto();
    const viewport = page.viewportSize();
    const isAtLeastSmBreakpoint = (viewport?.width ?? 0) >= 640;

    // Regression guard: the phone button used to require `lg:` (1024px),
    // leaving tablet widths (640-1023px) with no way to reach it at all.
    if (isAtLeastSmBreakpoint) {
      await expect(homePage.header.phoneCta).toBeVisible();
    } else {
      await expect(homePage.header.phoneCta).toBeHidden();
      await expect(homePage.header.mobileMenuButton).toBeVisible();
    }
  });
});
