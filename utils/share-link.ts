import { QRFormValues, QRCustomization, TemplateId } from "@/types/qr";
import { defaultFormValues, defaultCustomization } from "@/store/qr-store";

type ShareData = {
  f: Partial<QRFormValues>;
  c: Partial<QRCustomization>;
  t?: TemplateId;
};

export function encodeShareLink(
  formValues: QRFormValues,
  customization: QRCustomization,
  selectedTemplate?: TemplateId,
): string {
  const data: ShareData = {
    f: diff(formValues, defaultFormValues) as Partial<QRFormValues>,
    c: diff(customization, defaultCustomization) as Partial<QRCustomization>,
  };
  if (selectedTemplate) data.t = selectedTemplate;
  try {
    const encoded = btoa(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}#design:${encoded}`;
  } catch {
    return "";
  }
}

export function decodeShareLink(
  hash: string,
): { formValues: QRFormValues; customization: QRCustomization; selectedTemplate?: TemplateId } | null {
  if (!hash.startsWith("#design:")) return null;
  try {
    const encoded = hash.slice(8);
    const data: ShareData = JSON.parse(atob(encoded));
    const formValues = { ...defaultFormValues, ...data.f };
    const customization = { ...defaultCustomization, ...data.c };
    return { formValues, customization, selectedTemplate: data.t };
  } catch {
    return null;
  }
}

function diff(obj: Record<string, unknown>, defaults: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (obj[key] !== defaults[key]) {
      result[key] = obj[key];
    }
  }
  return result;
}
