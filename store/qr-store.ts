import { create } from "zustand";
import {
  BrandKit,
  HistoryEntry,
  QrBeautification,
  QRCustomization,
  QRFormValues,
  TemplateId,
} from "@/types/qr";
import {
  deleteBrandKit as deleteBrandKitStorage,
  deleteHistoryEntry as deleteHistoryEntryStorage,
  getBrandKits,
  getHistory,
  saveBrandKit as saveBrandKitStorage,
  saveHistoryEntry as saveHistoryEntryStorage,
} from "@/utils/local-storage";

export const defaultFormValues: QRFormValues = {
  kind: "url",
  content: "pixelqr.app",
  emailSubject: "",
  phoneCountryCode: "+1",
  wifiSsid: "PixelQR Guest",
  wifiPassword: "scanbeautiful",
  wifiEncryption: "WPA",
  title: "PixelQR",
  subtitle: "Scan to open",
  calendarEventName: "",
  calendarDate: "",
  calendarLocation: "",
  calendarDescription: "",
  cryptoCurrency: "bitcoin",
  cryptoAmount: "",
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
  frameStyle: "simple",
  frameLabel: "",
  frameCtaText: "",
  frameCtaColor: "#FF6B6B",
  frameBorderWidth: 4,
};

export const defaultBeautification: QrBeautification = {
  enabled: false,
  moduleShape: "rounded",
  pattern: "none",
  patternColor: "#000000",
  animationEnabled: false,
  animationSpeed: 1,
};

type QRStore = {
  formValues: QRFormValues;
  customization: QRCustomization;
  beautification: QrBeautification;
  selectedTemplate?: TemplateId;
  history: HistoryEntry[];
  brandKits: BrandKit[];
  setFormValues: (values: Partial<QRFormValues>) => void;
  setCustomization: (values: Partial<QRCustomization>) => void;
  setBeautification: (values: Partial<QrBeautification>) => void;
  resetCustomization: () => void;
  applyTemplate: (template: TemplateId) => void;
  saveToHistory: (name: string) => void;
  restoreFromHistory: (entry: HistoryEntry) => void;
  deleteFromHistory: (id: string) => void;
  refreshHistory: () => void;
  saveAsBrandKit: (name: string) => void;
  applyBrandKit: (kit: BrandKit) => void;
  deleteBrandKit: (id: string) => void;
  refreshBrandKits: () => void;
  suggestColors: (palette: {
    dominant: string;
    contrast: string;
    accent: string;
  }) => void;
};

const templates: Record<
  TemplateId,
  { form: Partial<QRFormValues>; customization: Partial<QRCustomization> }
> = {
  business: {
    form: {
      kind: "vcard",
      content: "Alex Morgan",
      title: "Alex Morgan",
      subtitle: "Creative Director",
    },
    customization: {
      foregroundColor: "#111827",
      gradientColor: "#2563eb",
      dotStyle: "rounded",
      frameStyle: "label",
    },
  },
  restaurant: {
    form: {
      kind: "url",
      content: "menu.pixelqr.app",
      title: "Table Menu",
      subtitle: "Browse menu and order",
    },
    customization: {
      foregroundColor: "#133b3a",
      gradientColor: "#0f766e",
      innerEyeColor: "#0f766e",
      frameStyle: "ticket",
    },
  },
  instagram: {
    form: {
      kind: "url",
      content: "instagram.com/pixelqr",
      title: "@pixelqr",
      subtitle: "Follow our updates",
    },
    customization: {
      foregroundColor: "#312e81",
      gradientMode: "linear",
      gradientColor: "#db2777",
      innerEyeColor: "#db2777",
    },
  },
  whatsapp: {
    form: {
      kind: "whatsapp",
      content: "15551234567",
      title: "Chat with us",
      subtitle: "Fast support on WhatsApp",
    },
    customization: {
      foregroundColor: "#064e3b",
      gradientColor: "#10b981",
      innerEyeColor: "#10b981",
    },
  },
  wifi: {
    form: {
      kind: "wifi",
      content: "PixelQR Guest",
      wifiSsid: "PixelQR Guest",
      title: "Guest Wi-Fi",
      subtitle: "Scan to connect",
    },
    customization: {
      foregroundColor: "#172554",
      gradientColor: "#2563eb",
      dotStyle: "square",
      frameStyle: "label",
    },
  },
  payment: {
    form: {
      kind: "upi",
      content: "pixelqr@bank",
      title: "Pay PixelQR",
      subtitle: "Secure UPI payment",
    },
    customization: {
      foregroundColor: "#18181b",
      gradientColor: "#7c3aed",
      innerEyeColor: "#7c3aed",
      frameStyle: "ticket",
    },
  },
  event: {
    form: {
      kind: "url",
      content: "events.pixelqr.app/summit",
      title: "Creator Summit",
      subtitle: "RSVP and agenda",
    },
    customization: {
      foregroundColor: "#0f172a",
      gradientMode: "linear",
      gradientColor: "#0891b2",
      dotStyle: "soft",
    },
  },
  app: {
    form: {
      kind: "deeplink",
      content: "pixelqr://download",
      title: "Get the app",
      subtitle: "Open store link",
    },
    customization: {
      foregroundColor: "#111827",
      gradientColor: "#2563eb",
      eyeStyle: "circle",
      dotStyle: "circle",
    },
  },
  maps: {
    form: {
      kind: "url",
      content: "maps.google.com/?q=PixelQR+Studio",
      title: "Find us",
      subtitle: "Open location in Maps",
    },
    customization: {
      foregroundColor: "#052e16",
      gradientColor: "#047857",
      innerEyeColor: "#047857",
      frameStyle: "label",
    },
  },
  logoHeader: {
    form: {
      kind: "url",
      content: "pixelqr.app/brand",
      title: "PixelQR Studio",
      subtitle: "Scan our brand card",
    },
    customization: {
      foregroundColor: "#111827",
      gradientColor: "#be123c",
      innerEyeColor: "#be123c",
      logoSize: 22,
      frameStyle: "label",
    },
  },
  landing: {
    form: {
      kind: "url",
      content: "pixelqr.app/summer",
      title: "Summer Launch",
      subtitle: "See the campaign",
    },
    customization: {
      foregroundColor: "#431407",
      gradientMode: "linear",
      gradientColor: "#c2410c",
      innerEyeColor: "#c2410c",
      frameStyle: "ticket",
    },
  },
  coupon: {
    form: {
      kind: "text",
      content: "SAVE20",
      title: "Save 20%",
      subtitle: "Show this code at checkout",
    },
    customization: {
      foregroundColor: "#422006",
      gradientColor: "#ca8a04",
      innerEyeColor: "#ca8a04",
      dotStyle: "rounded",
      frameStyle: "ticket",
    },
  },
  review: {
    form: {
      kind: "url",
      content: "pixelqr.app/review",
      title: "Leave a review",
      subtitle: "Tell us how we did",
    },
    customization: {
      foregroundColor: "#3b0764",
      gradientMode: "linear",
      gradientColor: "#9333ea",
      eyeStyle: "circle",
      dotStyle: "soft",
    },
  },
  email: {
    form: {
      kind: "email",
      content: "hello@pixelqr.app",
      emailSubject: "New inquiry",
      title: "Email us",
      subtitle: "Send a pre-filled inquiry",
    },
    customization: {
      foregroundColor: "#1e1b4b",
      gradientColor: "#4338ca",
      innerEyeColor: "#4338ca",
      frameStyle: "simple",
    },
  },
  phone: {
    form: {
      kind: "phone",
      content: "5551234567",
      phoneCountryCode: "+1",
      title: "Call us",
      subtitle: "Tap to start a call",
    },
    customization: {
      foregroundColor: "#164e63",
      gradientColor: "#0e7490",
      innerEyeColor: "#0e7490",
      dotStyle: "circle",
    },
  },
  product: {
    form: {
      kind: "url",
      content: "pixelqr.app/products/starter-kit",
      title: "Product details",
      subtitle: "Manuals, warranty, and setup",
    },
    customization: {
      foregroundColor: "#0f172a",
      gradientColor: "#334155",
      innerEyeColor: "#64748b",
      outerEyeColor: "#0f172a",
      frameStyle: "label",
    },
  },
};

export const useQRStore = create<QRStore>((set, get) => ({
  formValues: defaultFormValues,
  customization: defaultCustomization,
  beautification: defaultBeautification,
  selectedTemplate: undefined,
  history: [],
  brandKits: [],
  setFormValues: (values) =>
    set((state) => ({ formValues: { ...state.formValues, ...values } })),
  setCustomization: (values) =>
    set((state) => ({ customization: { ...state.customization, ...values } })),
  setBeautification: (values) =>
    set((state) => ({
      beautification: { ...state.beautification, ...values },
    })),
  resetCustomization: () =>
    set({
      customization: defaultCustomization,
      beautification: defaultBeautification,
      selectedTemplate: undefined,
    }),
  applyTemplate: (template) =>
    set((state) => ({
      formValues: { ...state.formValues, ...templates[template].form },
      customization: {
        ...state.customization,
        ...templates[template].customization,
      },
      selectedTemplate: template,
    })),
  saveToHistory: (name: string) => {
    const state = get();
    const entry: HistoryEntry = {
      id: Date.now().toString(36),
      name,
      createdAt: new Date().toISOString(),
      formValues: state.formValues,
      customization: state.customization,
      selectedTemplate: state.selectedTemplate,
    };
    const updated = saveHistoryEntryStorage(entry);
    set({ history: updated });
  },
  restoreFromHistory: (entry: HistoryEntry) => {
    set({
      formValues: entry.formValues,
      customization: entry.customization,
      selectedTemplate: entry.selectedTemplate,
    });
  },
  deleteFromHistory: (id: string) => {
    const updated = deleteHistoryEntryStorage(id);
    set({ history: updated });
  },
  refreshHistory: () => {
    set({ history: getHistory() });
  },
  saveAsBrandKit: (name: string) => {
    const state = get();
    const kit: BrandKit = {
      id: Date.now().toString(36),
      name,
      createdAt: new Date().toISOString(),
      customization: state.customization,
    };
    const updated = saveBrandKitStorage(kit);
    set({ brandKits: updated });
  },
  applyBrandKit: (kit: BrandKit) => {
    set((state) => ({
      customization: { ...state.customization, ...kit.customization },
    }));
  },
  deleteBrandKit: (id: string) => {
    const updated = deleteBrandKitStorage(id);
    set({ brandKits: updated });
  },
  refreshBrandKits: () => {
    set({ brandKits: getBrandKits() });
  },
  suggestColors: (palette) => {
    set((state) => ({
      customization: {
        ...state.customization,
        foregroundColor: palette.dominant,
        backgroundColor:
          palette.contrast === "#ffffff" ? "#ffffff" : "#000000",
      },
      beautification: {
        ...state.beautification,
        patternColor: palette.accent,
      },
    }));
  },
}));
