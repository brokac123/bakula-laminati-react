import type { Page } from "@playwright/test";

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

/**
 * Intercepts the real EmailJS network call so contact-form tests never send
 * live email. Assertions target the app's reaction to the response, not
 * EmailJS itself.
 */
export async function mockEmailJsSuccess(page: Page) {
  await page.route(EMAILJS_SEND_URL, (route) =>
    route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }),
  );
}

export async function mockEmailJsFailure(page: Page) {
  await page.route(EMAILJS_SEND_URL, (route) =>
    route.fulfill({ status: 400, contentType: "text/plain", body: "Bad Request" }),
  );
}
