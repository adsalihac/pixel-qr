import { create } from "zustand";
import { QRCustomization, QRFormValues, TemplateId } from "@/types/qr";

export const defaultFormValues: QRFormValues = {
  kind: "url",
  content: "pixelqr.app",
  emailSubject: "",
  phoneCountryCode: "+1",
  wifiSsid: "PixelQR Guest",
  wifiPassword: "scanbeautiful",
  wifiEncryption: "WPA",
  title: "PixelQR",
  subtitle: "Scan to open"
};

export const defaultCustomization: QRCustomization = {
  foregroundColor: "#111827",
  backgroundColor: "#ffffff",
  gradientMode: "none",
  gradientColor: "#2563eb",
  dotStyle: "rounded",
  eyeStyle: "rounded",
  innerEyeColor: "#2563eb",
  outerEyeColor: "#111827",
  size: 260,
  padding: 18,
  transparentBackground: false,
  logoSize: 16,
  logoBackground: true,
  frameStyle: "simple"
};

type QRStore = {
  formValues: QRFormValues;
  customization: QRCustomization;
  selectedTemplate?: TemplateId;
  setFormValues: (values: Partial<QRFormValues>) => void;
  setCustomization: (values: Partial<QRCustomization>) => void;
  resetCustomization: () => void;
  applyTemplate: (template: TemplateId) => void;
};

const templates: Record<TemplateId, { form: Partial<QRFormValues>; customization: Partial<QRCustomization> }> = {
  business: {
    form: { kind: "vcard", content: "Alex Morgan", title: "Alex Morgan", subtitle: "Creative Director" },
    customization: { foregroundColor: "#111827", gradientColor: "#2563eb", dotStyle: "rounded", frameStyle: "label" }
  },
  restaurant: {
    form: { kind: "url", content: "menu.pixelqr.app", title: "Table Menu", subtitle: "Browse menu and order" },
    customization: { foregroundColor: "#133b3a", gradientColor: "#0f766e", innerEyeColor: "#0f766e", frameStyle: "ticket" }
  },
  instagram: {
    form: { kind: "url", content: "instagram.com/pixelqr", title: "@pixelqr", subtitle: "Follow our updates" },
    customization: { foregroundColor: "#312e81", gradientMode: "linear", gradientColor: "#db2777", innerEyeColor: "#db2777" }
  },
  whatsapp: {
    form: { kind: "whatsapp", content: "15551234567", title: "Chat with us", subtitle: "Fast support on WhatsApp" },
    customization: { foregroundColor: "#064e3b", gradientColor: "#10b981", innerEyeColor: "#10b981" }
  },
  wifi: {
    form: { kind: "wifi", content: "PixelQR Guest", wifiSsid: "PixelQR Guest", title: "Guest Wi-Fi", subtitle: "Scan to connect" },
    customization: { foregroundColor: "#172554", gradientColor: "#2563eb", dotStyle: "square", frameStyle: "label" }
  },
  payment: {
    form: { kind: "upi", content: "pixelqr@bank", title: "Pay PixelQR", subtitle: "Secure UPI payment" },
    customization: { foregroundColor: "#18181b", gradientColor: "#7c3aed", innerEyeColor: "#7c3aed", frameStyle: "ticket" }
  },
  event: {
    form: { kind: "url", content: "events.pixelqr.app/summit", title: "Creator Summit", subtitle: "RSVP and agenda" },
    customization: { foregroundColor: "#0f172a", gradientMode: "linear", gradientColor: "#0891b2", dotStyle: "soft" }
  },
  app: {
    form: { kind: "deeplink", content: "pixelqr://download", title: "Get the app", subtitle: "Open store link" },
    customization: { foregroundColor: "#111827", gradientColor: "#2563eb", eyeStyle: "circle", dotStyle: "circle" }
  },
  maps: {
    form: { kind: "url", content: "maps.google.com/?q=PixelQR+Studio", title: "Find us", subtitle: "Open location in Maps" },
    customization: { foregroundColor: "#052e16", gradientColor: "#047857", innerEyeColor: "#047857", frameStyle: "label" }
  },
  logoHeader: {
    form: { kind: "url", content: "pixelqr.app/brand", title: "PixelQR Studio", subtitle: "Scan our brand card" },
    customization: { foregroundColor: "#111827", gradientColor: "#be123c", innerEyeColor: "#be123c", logoSize: 22, frameStyle: "label" }
  },
  landing: {
    form: { kind: "url", content: "pixelqr.app/summer", title: "Summer Launch", subtitle: "See the campaign" },
    customization: { foregroundColor: "#431407", gradientMode: "linear", gradientColor: "#c2410c", innerEyeColor: "#c2410c", frameStyle: "ticket" }
  },
  coupon: {
    form: { kind: "text", content: "SAVE20", title: "Save 20%", subtitle: "Show this code at checkout" },
    customization: { foregroundColor: "#422006", gradientColor: "#ca8a04", innerEyeColor: "#ca8a04", dotStyle: "rounded", frameStyle: "ticket" }
  },
  review: {
    form: { kind: "url", content: "pixelqr.app/review", title: "Leave a review", subtitle: "Tell us how we did" },
    customization: { foregroundColor: "#3b0764", gradientMode: "linear", gradientColor: "#9333ea", eyeStyle: "circle", dotStyle: "soft" }
  },
  email: {
    form: { kind: "email", content: "hello@pixelqr.app", emailSubject: "New inquiry", title: "Email us", subtitle: "Send a pre-filled inquiry" },
    customization: { foregroundColor: "#1e1b4b", gradientColor: "#4338ca", innerEyeColor: "#4338ca", frameStyle: "simple" }
  },
  phone: {
    form: { kind: "phone", content: "5551234567", phoneCountryCode: "+1", title: "Call us", subtitle: "Tap to start a call" },
    customization: { foregroundColor: "#164e63", gradientColor: "#0e7490", innerEyeColor: "#0e7490", dotStyle: "circle" }
  },
  product: {
    form: { kind: "url", content: "pixelqr.app/products/starter-kit", title: "Product details", subtitle: "Manuals, warranty, and setup" },
    customization: { foregroundColor: "#0f172a", gradientColor: "#334155", innerEyeColor: "#64748b", outerEyeColor: "#0f172a", frameStyle: "label" }
  }
};

export const useQRStore = create<QRStore>((set) => ({
  formValues: defaultFormValues,
  customization: defaultCustomization,
  selectedTemplate: undefined,
  setFormValues: (values) => set((state) => ({ formValues: { ...state.formValues, ...values } })),
  setCustomization: (values) => set((state) => ({ customization: { ...state.customization, ...values } })),
  resetCustomization: () => set({ customization: defaultCustomization, selectedTemplate: undefined }),
  applyTemplate: (template) =>
    set((state) => ({
      formValues: { ...state.formValues, ...templates[template].form },
      customization: { ...state.customization, ...templates[template].customization },
      selectedTemplate: template
    }))
}));
