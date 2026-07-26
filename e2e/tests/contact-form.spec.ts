import { expect, test } from "../fixtures/test";
import { mockEmailJsFailure, mockEmailJsSuccess } from "../utils/emailjs";

const VALID_INPUT = {
  message: "Zanima me ponuda za laminat u dnevnoj sobi.",
  name: "Ana Testić",
  email: "ana.testic@example.com",
  phone: "091 123 4567",
  subject: "Upit o ponudi",
};

test.describe("Contact form validation", () => {
  test("empty required fields show localized Croatian messages", async ({ contactPage }) => {
    await contactPage.goto();
    await contactPage.submit();

    const validity = await contactPage.messageInput.evaluate(
      (el: HTMLTextAreaElement) => el.validationMessage,
    );
    expect(validity).toBe("Molimo ispunite ovo polje.");
  });

  test("an invalid email format shows a localized message", async ({ contactPage }) => {
    await contactPage.goto();
    await contactPage.fill({ ...VALID_INPUT, email: "nije-email" });
    await contactPage.submit();

    const validity = await contactPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );
    expect(validity).toBe("Unesite ispravnu email adresu.");
  });
});

test.describe("Contact form submission", () => {
  test("a successful send shows the confirmation state and clears the message @smoke", async ({
    page,
    contactPage,
  }) => {
    await mockEmailJsSuccess(page);
    await contactPage.goto();
    await contactPage.fill(VALID_INPUT);
    await contactPage.submit();

    await expect(contactPage.successHeading).toHaveText("Poruka je poslana!");
  });

  test("a failed send shows an error with a mailto fallback", async ({ page, contactPage }) => {
    await mockEmailJsFailure(page);
    await contactPage.goto();
    await contactPage.fill(VALID_INPUT);
    await contactPage.submit();

    await expect(contactPage.errorMessage).toBeVisible();
    const mailtoLink = page.getByRole("link", { name: "Pošaljite nam poruku izravno e-mailom" });
    await expect(mailtoLink).toHaveAttribute("href", /^mailto:luka\.bakula1@gmail\.com/);
  });
});

test.describe("Remember me", () => {
  test("persists and restores name, email and phone across a reload", async ({
    page,
    contactPage,
  }) => {
    await mockEmailJsSuccess(page);
    await contactPage.goto();
    await contactPage.fill(VALID_INPUT);
    await contactPage.rememberCheckbox.check();
    await contactPage.submit();
    await expect(contactPage.successHeading).toBeVisible();

    await contactPage.goto();
    await expect(contactPage.nameInput).toHaveValue(VALID_INPUT.name);
    await expect(contactPage.emailInput).toHaveValue(VALID_INPUT.email);
    await expect(contactPage.phoneInput).toHaveValue(VALID_INPUT.phone);
    await expect(contactPage.rememberCheckbox).toBeChecked();
  });

  test("does not persist details when left unchecked", async ({ page, contactPage }) => {
    await mockEmailJsSuccess(page);
    await contactPage.goto();
    await contactPage.fill(VALID_INPUT);
    await contactPage.submit();
    await expect(contactPage.successHeading).toBeVisible();

    await contactPage.goto();
    await expect(contactPage.nameInput).toHaveValue("");
    await expect(contactPage.rememberCheckbox).not.toBeChecked();
  });
});
