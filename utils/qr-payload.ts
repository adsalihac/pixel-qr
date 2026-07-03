import { QRFormValues } from "@/types/qr";

const escapeWifi = (value: string) => value.replace(/[\\;,:"]/g, "\\$&");

export function buildQrPayload(values: QRFormValues) {
  const content = values.content.trim();

  switch (values.kind) {
    case "url":
      return /^https?:\/\//i.test(content) ? content : `https://${content}`;
    case "email":
      return `mailto:${content}?subject=${encodeURIComponent(values.emailSubject.trim())}`;
    case "phone":
      return `tel:${values.phoneCountryCode}${content.replace(/[^\d]/g, "")}`;
    case "whatsapp":
      return `https://wa.me/${content.replace(/[^\d]/g, "")}`;
    case "wifi":
      return `WIFI:T:${values.wifiEncryption};S:${escapeWifi(values.wifiSsid || content)};P:${escapeWifi(values.wifiPassword)};;`;
    case "vcard":
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${content}\nEND:VCARD`;
    case "upi":
      return content.startsWith("upi://") ? content : `upi://pay?pa=${encodeURIComponent(content)}`;
    case "deeplink":
      return content;
    case "text":
    default:
      return content;
  }
}
