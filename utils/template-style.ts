import { TemplateId, TemplateVisualStyle } from "@/types/qr";

const styleMap: Record<TemplateId, TemplateVisualStyle> = {
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
  product: "product-label",
  health: "fitness-card",
  realestate: "realestate-card",
  music: "music-card",
  podcast: "podcast-card",
  youtube: "youtube-card",
  wedding: "wedding-card",
  conference: "conference-card",
  charity: "charity-card",
  newsletter: "newsletter-card",
  travel: "travel-card",
  recipe: "recipe-card",
  survey: "survey-card",
  fitness: "fitness-card",
  resume: "resume-card",
};

export function getTemplateVisualStyle(
  templateId?: TemplateId,
): TemplateVisualStyle | undefined {
  return templateId ? styleMap[templateId] : undefined;
}
