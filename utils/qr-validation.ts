import { z } from "zod";

export const qrFormSchema = z.object({
  kind: z.enum(["url", "text", "email", "phone", "whatsapp", "wifi", "vcard", "upi", "deeplink"]),
  content: z.string().trim().min(1, "Enter the destination or message for this QR code."),
  emailSubject: z.string().trim().optional().default(""),
  phoneCountryCode: z.string().trim().optional().default("+1"),
  wifiSsid: z.string().trim().optional().default(""),
  wifiPassword: z.string().trim().optional().default(""),
  wifiEncryption: z.enum(["WPA", "WEP", "nopass"]).default("WPA"),
  title: z.string().trim().max(42, "Keep titles short for clean exports.").optional().default(""),
  subtitle: z.string().trim().max(80, "Keep subtitles below 80 characters.").optional().default("")
});

export const isHexColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
