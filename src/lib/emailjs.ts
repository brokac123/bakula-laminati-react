import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error("EmailJS nije konfiguriran.");
  }
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      // Matches the EmailJS "Contact Us" default template's variable names
      // ({{name}}, {{email}}, {{title}}, {{message}}) rather than our own
      // form field names, since that's the template actually in use.
      name: data.name,
      email: data.email,
      title: data.subject,
      message: data.message,
      phone: data.phone,
      time: new Date().toLocaleString("hr-HR"),
    },
    { publicKey: PUBLIC_KEY },
  );
}
