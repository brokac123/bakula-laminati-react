import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface ContactFormInput {
  message: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
}

export class ContactPage extends BasePage {
  readonly messageInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly errorMessage: Locator;
  readonly newMessageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.messageInput = page.getByPlaceholder("Vaša poruka…");
    this.nameInput = page.getByPlaceholder("Ime i prezime");
    this.emailInput = page.getByPlaceholder("Email");
    this.phoneInput = page.getByPlaceholder("Telefon");
    this.subjectInput = page.getByPlaceholder("Predmet");
    this.rememberCheckbox = page.getByRole("checkbox", {
      name: "Zapamti moje podatke za sljedeći put",
    });
    this.submitButton = page.getByRole("button", { name: /Pošalji Poruku!|Šaljem…/ });
    this.successHeading = page.getByText(/Poruka je poslana!|Otvorite svoj email…/);
    this.errorMessage = page.getByText("Slanje trenutno nije uspjelo.");
    this.newMessageButton = page.getByRole("button", { name: "Pošaljite novu poruku" });
  }

  async goto() {
    await this.gotoPath("/kontakt");
  }

  async fill(data: ContactFormInput) {
    await this.messageInput.fill(data.message);
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.subjectInput.fill(data.subject);
  }

  async submit() {
    await this.submitButton.click();
  }
}
