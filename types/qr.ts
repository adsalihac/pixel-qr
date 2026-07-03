export type QRKind =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "whatsapp"
  | "wifi"
  | "vcard"
  | "upi"
  | "deeplink";

export type DotStyle = "square" | "rounded" | "circle" | "soft";
export type EyeStyle = "square" | "rounded" | "circle";
export type FrameStyle = "none" | "simple" | "label" | "ticket";

export type GradientMode = "none" | "linear";

export type TemplateVisualStyle =
  | "business-card"
  | "menu-poster"
  | "social-card"
  | "chat-card"
  | "wifi-card"
  | "payment-standee"
  | "event-pass"
  | "app-card"
  | "map-card"
  | "brand-header"
  | "campaign-poster"
  | "coupon-ticket"
  | "review-standee"
  | "email-card"
  | "call-card"
  | "product-label";

export type QRFormValues = {
  kind: QRKind;
  content: string;
  emailSubject: string;
  phoneCountryCode: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: "WPA" | "WEP" | "nopass";
  title: string;
  subtitle: string;
};

export type QRCustomization = {
  foregroundColor: string;
  backgroundColor: string;
  gradientMode: GradientMode;
  gradientColor: string;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  innerEyeColor: string;
  outerEyeColor: string;
  size: number;
  padding: number;
  transparentBackground: boolean;
  logoUri?: string;
  logoSize: number;
  logoBackground: boolean;
  frameStyle: FrameStyle;
};

export type ScanWarning = {
  id: string;
  message: string;
  severity: "warning" | "danger";
};

export type TemplateId =
  | "business"
  | "restaurant"
  | "instagram"
  | "whatsapp"
  | "wifi"
  | "payment"
  | "event"
  | "app"
  | "maps"
  | "logoHeader"
  | "landing"
  | "coupon"
  | "review"
  | "email"
  | "phone"
  | "product";
