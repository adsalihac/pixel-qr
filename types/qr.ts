export type QRKind =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "whatsapp"
  | "wifi"
  | "vcard"
  | "upi"
  | "deeplink"
  | "calendar"
  | "crypto";

export type DotStyle = "square" | "rounded" | "circle" | "soft" | "cross" | "diamond" | "leaf";
export type EyeStyle = "square" | "rounded" | "circle" | "leaf" | "diamondAlt";
export type FrameStyle = "none" | "simple" | "label" | "ticket" | "custom" | "bold" | "double" | "shadow";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type MaskPattern = "auto" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export type GradientMode = "none" | "linear";
export type ShadowDepth = "small" | "medium" | "large";

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
  | "product-label"
  | "health-card"
  | "realestate-card"
  | "music-card"
  | "podcast-card"
  | "youtube-card"
  | "wedding-card"
  | "conference-card"
  | "charity-card"
  | "newsletter-card"
  | "travel-card"
  | "recipe-card"
  | "survey-card"
  | "fitness-card"
  | "resume-card";

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
  calendarEventName: string;
  calendarDate: string;
  calendarLocation: string;
  calendarDescription: string;
  cryptoCurrency: "bitcoin" | "ethereum";
  cryptoAmount: string;
  expiresAt: string;
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
  basicMode: boolean;
  frameStyle: FrameStyle;
  frameLabel: string;
  frameCtaText: string;
  frameCtaColor: string;
  frameBorderWidth: number;
  cornerRadius: number;
  shadowDepth: ShadowDepth;
  errorCorrectionLevel: ErrorCorrectionLevel;
  maskPattern: MaskPattern;
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
  | "product"
  | "health"
  | "realestate"
  | "music"
  | "podcast"
  | "youtube"
  | "wedding"
  | "conference"
  | "charity"
  | "newsletter"
  | "travel"
  | "recipe"
  | "survey"
  | "fitness"
  | "resume";

export type HistoryEntry = {
  id: string;
  name: string;
  createdAt: string;
  formValues: QRFormValues;
  customization: QRCustomization;
  selectedTemplate?: TemplateId;
};

export type BrandKit = {
  id: string;
  name: string;
  createdAt: string;
  customization: Partial<QRCustomization>;
};

export type PrintSize = "1x1" | "2x3" | "3x4" | "4x6";
export type PrintUnit = "inch" | "mm";

export type BeautifyPattern = "none" | "dots" | "crosses" | "diamonds" | "circles";
export type ModuleShape = "square" | "rounded" | "circle" | "diamond" | "droplet";

export type QrBeautification = {
  enabled: boolean;
  moduleShape: ModuleShape;
  pattern: BeautifyPattern;
  patternColor: string;
  animationEnabled: boolean;
  animationSpeed: number;
};

export type BulkEntry = {
  row: number;
  label: string;
  content: string;
  payload: string;
};

export type SequentialConfig = {
  prefix: string;
  suffix: string;
  start: number;
  end: number;
  padding: number;
  contentTemplate: string;
};

export type LabelSheetSize = "a4" | "letter";
export type LabelSize = "1x1" | "2x1" | "2x2" | "3x2";

export type LabelSheetConfig = {
  pageSize: LabelSheetSize;
  labelSize: LabelSize;
  useBulkEntries: boolean;
};

export type GalleryEntry = {
  id: string;
  name: string;
  createdAt: string;
  author: string;
  formValues: QRFormValues;
  customization: QRCustomization;
  selectedTemplate?: TemplateId;
  likes: number;
  liked: boolean;
  isExample?: boolean;
};
