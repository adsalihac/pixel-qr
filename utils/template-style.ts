import { TemplateId, TemplateVisualStyle } from "@/types/qr";

export const templateVisualStyles: Record<TemplateId, TemplateVisualStyle> = {
  business: "business-card",
  restaurant: "menu-poster",
  instagram: "social-card",
  whatsapp: "chat-card",
  wifi: "wifi-card",
  payment: "payment-standee",
  event: "event-pass",
  app: "app-card",
  maps: "map-card",
  logoHeader: "brand-header",
  landing: "campaign-poster",
  coupon: "coupon-ticket",
  review: "review-standee",
  email: "email-card",
  phone: "call-card",
  product: "product-label"
};

export const getTemplateVisualStyle = (templateId?: TemplateId) => (templateId ? templateVisualStyles[templateId] : undefined);
