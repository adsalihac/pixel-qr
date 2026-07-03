import { create } from "zustand";
import {
  BrandKit,
  GalleryEntry,
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
  getGallery,
  getHistory,
  publishToGallery,
  removeFromGallery as removeFromGalleryStorage,
  saveBrandKit as saveBrandKitStorage,
  saveHistoryEntry as saveHistoryEntryStorage,
  toggleGalleryLike as toggleGalleryLikeStorage,
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
  expiresAt: "",
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
  cornerRadius: 0,
  shadowDepth: "medium",
  errorCorrectionLevel: "H",
  maskPattern: "auto",
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
  gallery: GalleryEntry[];
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
  publishCurrent: () => void;
  toggleGalleryLike: (id: string) => void;
  removeFromGallery: (id: string) => void;
  refreshGallery: () => void;
  restoreFromGallery: (entry: GalleryEntry) => void;
};

const templates: Record<
  TemplateId,
  { form: Partial<QRFormValues>; customization: Partial<QRCustomization> }
> = {
  business: {
    form: { kind: "vcard", content: "Alex Morgan", title: "Alex Morgan", subtitle: "Creative Director" },
    customization: { foregroundColor: "#111827", gradientColor: "#2563eb", dotStyle: "rounded", frameStyle: "label" },
  },
  restaurant: {
    form: { kind: "url", content: "menu.pixelqr.app", title: "Table Menu", subtitle: "Browse menu and order" },
    customization: { foregroundColor: "#133b3a", gradientColor: "#0f766e", innerEyeColor: "#0f766e", frameStyle: "ticket" },
  },
  instagram: {
    form: { kind: "url", content: "instagram.com/pixelqr", title: "@pixelqr", subtitle: "Follow our updates" },
    customization: { foregroundColor: "#312e81", gradientMode: "linear", gradientColor: "#db2777", innerEyeColor: "#db2777" },
  },
  whatsapp: {
    form: { kind: "whatsapp", content: "15551234567", title: "Chat with us", subtitle: "Fast support on WhatsApp" },
    customization: { foregroundColor: "#064e3b", gradientColor: "#10b981", innerEyeColor: "#10b981" },
  },
  wifi: {
    form: { kind: "wifi", content: "PixelQR Guest", wifiSsid: "PixelQR Guest", title: "Guest Wi-Fi", subtitle: "Scan to connect" },
    customization: { foregroundColor: "#172554", gradientColor: "#2563eb", dotStyle: "square", frameStyle: "label" },
  },
  payment: {
    form: { kind: "upi", content: "pixelqr@bank", title: "Pay PixelQR", subtitle: "Secure UPI payment" },
    customization: { foregroundColor: "#18181b", gradientColor: "#7c3aed", innerEyeColor: "#7c3aed", frameStyle: "ticket" },
  },
  event: {
    form: { kind: "url", content: "events.pixelqr.app/summit", title: "Creator Summit", subtitle: "RSVP and agenda" },
    customization: { foregroundColor: "#0f172a", gradientMode: "linear", gradientColor: "#0891b2", dotStyle: "soft" },
  },
  app: {
    form: { kind: "deeplink", content: "pixelqr://download", title: "Get the app", subtitle: "Open store link" },
    customization: { foregroundColor: "#111827", gradientColor: "#2563eb", eyeStyle: "circle", dotStyle: "circle" },
  },
  maps: {
    form: { kind: "url", content: "maps.google.com/?q=PixelQR+Studio", title: "Find us", subtitle: "Open location in Maps" },
    customization: { foregroundColor: "#052e16", gradientColor: "#047857", innerEyeColor: "#047857", frameStyle: "label" },
  },
  logoHeader: {
    form: { kind: "url", content: "pixelqr.app/brand", title: "PixelQR Studio", subtitle: "Scan our brand card" },
    customization: { foregroundColor: "#111827", gradientColor: "#be123c", innerEyeColor: "#be123c", logoSize: 22, frameStyle: "label" },
  },
  landing: {
    form: { kind: "url", content: "pixelqr.app/summer", title: "Summer Launch", subtitle: "See the campaign" },
    customization: { foregroundColor: "#431407", gradientMode: "linear", gradientColor: "#c2410c", innerEyeColor: "#c2410c", frameStyle: "ticket" },
  },
  coupon: {
    form: { kind: "text", content: "SAVE20", title: "Save 20%", subtitle: "Show this code at checkout" },
    customization: { foregroundColor: "#422006", gradientColor: "#ca8a04", innerEyeColor: "#ca8a04", dotStyle: "rounded", frameStyle: "ticket" },
  },
  review: {
    form: { kind: "url", content: "pixelqr.app/review", title: "Leave a review", subtitle: "Tell us how we did" },
    customization: { foregroundColor: "#3b0764", gradientMode: "linear", gradientColor: "#9333ea", eyeStyle: "circle", dotStyle: "soft" },
  },
  email: {
    form: { kind: "email", content: "hello@pixelqr.app", emailSubject: "New inquiry", title: "Email us", subtitle: "Send a pre-filled inquiry" },
    customization: { foregroundColor: "#1e1b4b", gradientColor: "#4338ca", innerEyeColor: "#4338ca", frameStyle: "simple" },
  },
  phone: {
    form: { kind: "phone", content: "5551234567", phoneCountryCode: "+1", title: "Call us", subtitle: "Tap to start a call" },
    customization: { foregroundColor: "#164e63", gradientColor: "#0e7490", innerEyeColor: "#0e7490", dotStyle: "circle" },
  },
  product: {
    form: { kind: "url", content: "pixelqr.app/products/starter-kit", title: "Product details", subtitle: "Manuals, warranty, and setup" },
    customization: { foregroundColor: "#0f172a", gradientColor: "#334155", innerEyeColor: "#64748b", outerEyeColor: "#0f172a", frameStyle: "label" },
  },
  health: {
    form: { kind: "url", content: "myhealthpass.app", title: "Health Pass", subtitle: "Tap for medical records" },
    customization: { foregroundColor: "#022c22", gradientColor: "#059669", innerEyeColor: "#059669", dotStyle: "circle", frameStyle: "bold" },
  },
  realestate: {
    form: { kind: "url", content: "property.virtu.com/estate-42", title: "Virtu Estate", subtitle: "Virtual tour & details" },
    customization: { foregroundColor: "#292524", gradientMode: "linear", gradientColor: "#d97706", innerEyeColor: "#d97706", frameStyle: "double" },
  },
  music: {
    form: { kind: "url", content: "open.spotify.com/playlist", title: "Weekly Vibes", subtitle: "Listen on Spotify" },
    customization: { foregroundColor: "#052e16", gradientColor: "#22c55e", innerEyeColor: "#22c55e", dotStyle: "diamond", eyeStyle: "leaf", frameStyle: "shadow" },
  },
  podcast: {
    form: { kind: "url", content: "podcasts.apple.com/thenarrative", title: "The Narrative", subtitle: "New episode every Monday" },
    customization: { foregroundColor: "#1c1917", gradientColor: "#a855f7", innerEyeColor: "#a855f7", dotStyle: "soft", frameStyle: "label" },
  },
  youtube: {
    form: { kind: "url", content: "youtube.com/@pixelqr", title: "PixelQR TV", subtitle: "Subscribe for tutorials" },
    customization: { foregroundColor: "#0f0f0f", gradientColor: "#ef4444", innerEyeColor: "#ef4444", dotStyle: "rounded", eyeStyle: "diamondAlt", frameStyle: "bold" },
  },
  wedding: {
    form: { kind: "url", content: "ourwedding.app/rsvp", title: "Save the Date", subtitle: "RSVP by August 1" },
    customization: { foregroundColor: "#4c1d95", gradientMode: "linear", gradientColor: "#db2777", innerEyeColor: "#db2777", dotStyle: "leaf", frameStyle: "shadow" },
  },
  conference: {
    form: { kind: "vcard", content: "Dr. Sarah Chen", title: "Dr. Sarah Chen", subtitle: "Keynote Speaker • AI Summit" },
    customization: { foregroundColor: "#0f172a", gradientColor: "#0ea5e9", innerEyeColor: "#0ea5e9", eyeStyle: "square", frameStyle: "double" },
  },
  charity: {
    form: { kind: "url", content: "donate.hope.org/give", title: "Hope Foundation", subtitle: "Donate • Every dollar counts" },
    customization: { foregroundColor: "#1e1b4b", gradientColor: "#ec4899", innerEyeColor: "#ec4899", dotStyle: "rounded", frameStyle: "label" },
  },
  newsletter: {
    form: { kind: "url", content: "theweekly.pixelqr.app", title: "The Weekly", subtitle: "Design insights every Friday" },
    customization: { foregroundColor: "#111827", gradientColor: "#f59e0b", innerEyeColor: "#f59e0b", dotStyle: "cross", frameStyle: "simple" },
  },
  travel: {
    form: { kind: "url", content: "travel.pixelqr.app/itinerary", title: "Bali Trip '26", subtitle: "Itinerary & bookings" },
    customization: { foregroundColor: "#0c4a6e", gradientColor: "#06b6d4", innerEyeColor: "#06b6d4", dotStyle: "circle", eyeStyle: "leaf", frameStyle: "ticket" },
  },
  recipe: {
    form: { kind: "url", content: "recipes.pixelqr.app/pasta", title: "Weekend Pasta", subtitle: "Fresh ingredients inside" },
    customization: { foregroundColor: "#5c0e07", gradientColor: "#ea580c", innerEyeColor: "#ea580c", dotStyle: "soft", frameStyle: "label" },
  },
  survey: {
    form: { kind: "url", content: "survey.pixelqr.app/feedback", title: "Tell us how we did", subtitle: "2 min • Anonymous" },
    customization: { foregroundColor: "#1e1b4b", gradientMode: "linear", gradientColor: "#6366f1", innerEyeColor: "#6366f1", dotStyle: "rounded", frameStyle: "bold" },
  },
  fitness: {
    form: { kind: "url", content: "fitstudio.app/classes", title: "Fit Studio", subtitle: "Book your next class" },
    customization: { foregroundColor: "#171717", gradientColor: "#dc2626", innerEyeColor: "#dc2626", dotStyle: "square", eyeStyle: "square", frameStyle: "bold" },
  },
  resume: {
    form: { kind: "vcard", content: "Jordan Lee", title: "Jordan Lee", subtitle: "Full-Stack Engineer" },
    customization: { foregroundColor: "#111827", gradientColor: "#3b82f6", innerEyeColor: "#3b82f6", dotStyle: "diamond", frameStyle: "double" },
  },
};

export const useQRStore = create<QRStore>((set, get) => ({
  formValues: defaultFormValues,
  customization: defaultCustomization,
  beautification: defaultBeautification,
  selectedTemplate: undefined,
  history: [],
  brandKits: [],
  gallery: [],
  setFormValues: (values) =>
    set((state) => ({ formValues: { ...state.formValues, ...values } })),
  setCustomization: (values) =>
    set((state) => ({ customization: { ...state.customization, ...values } })),
  setBeautification: (values) =>
    set((state) => ({ beautification: { ...state.beautification, ...values } })),
  resetCustomization: () =>
    set({ customization: defaultCustomization, beautification: defaultBeautification, selectedTemplate: undefined }),
  applyTemplate: (template) =>
    set((state) => ({
      formValues: { ...state.formValues, ...templates[template].form },
      customization: { ...state.customization, ...templates[template].customization },
      selectedTemplate: template,
    })),
  saveToHistory: (name: string) => {
    const state = get();
    const entry: HistoryEntry = {
      id: Date.now().toString(36), name, createdAt: new Date().toISOString(),
      formValues: state.formValues, customization: state.customization, selectedTemplate: state.selectedTemplate,
    };
    set({ history: saveHistoryEntryStorage(entry) });
  },
  restoreFromHistory: (entry: HistoryEntry) => {
    set({ formValues: entry.formValues, customization: entry.customization, selectedTemplate: entry.selectedTemplate });
  },
  deleteFromHistory: (id: string) => set({ history: deleteHistoryEntryStorage(id) }),
  refreshHistory: () => set({ history: getHistory() }),
  saveAsBrandKit: (name: string) => {
    const state = get();
    const kit: BrandKit = {
      id: Date.now().toString(36), name, createdAt: new Date().toISOString(), customization: state.customization,
    };
    set({ brandKits: saveBrandKitStorage(kit) });
  },
  applyBrandKit: (kit: BrandKit) => set((state) => ({ customization: { ...state.customization, ...kit.customization } })),
  deleteBrandKit: (id: string) => set({ brandKits: deleteBrandKitStorage(id) }),
  refreshBrandKits: () => set({ brandKits: getBrandKits() }),
  suggestColors: (palette) => {
    set((state) => ({
      customization: { ...state.customization, foregroundColor: palette.dominant, backgroundColor: palette.contrast === "#ffffff" ? "#ffffff" : "#000000" },
      beautification: { ...state.beautification, patternColor: palette.accent },
    }));
  },
  publishCurrent: () => {
    const state = get();
    const entry: GalleryEntry = {
      id: Date.now().toString(36), name: state.formValues.title || "Untitled", createdAt: new Date().toISOString(),
      author: "You", formValues: state.formValues, customization: state.customization, selectedTemplate: state.selectedTemplate, likes: 0, liked: false,
    };
    set({ gallery: publishToGallery(entry) });
  },
  toggleGalleryLike: (id: string) => set({ gallery: toggleGalleryLikeStorage(id) }),
  removeFromGallery: (id: string) => set({ gallery: removeFromGalleryStorage(id) }),
  refreshGallery: () => set({ gallery: getGallery() }),
  restoreFromGallery: (entry: GalleryEntry) => {
    set({ formValues: entry.formValues, customization: entry.customization, selectedTemplate: entry.selectedTemplate });
  },
}));
