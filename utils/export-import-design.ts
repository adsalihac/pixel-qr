import { QRFormValues, QRCustomization, QrBeautification, TemplateId } from "@/types/qr";
import { defaultFormValues, defaultCustomization, defaultBeautification } from "@/store/qr-store";

export type DesignFile = {
  version: 1;
  name: string;
  exportedAt: string;
  formValues: QRFormValues;
  customization: QRCustomization;
  beautification: QrBeautification;
  selectedTemplate?: TemplateId;
};

export function exportDesign(
  name: string,
  formValues: QRFormValues,
  customization: QRCustomization,
  beautification: QrBeautification,
  selectedTemplate?: TemplateId,
) {
  const design: DesignFile = {
    version: 1,
    name,
    exportedAt: new Date().toISOString(),
    formValues,
    customization,
    beautification,
    selectedTemplate,
  };

  const blob = new Blob([JSON.stringify(design, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name.replace(/[^a-zA-Z0-9]/g, "_")}.qrdesign`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function importDesign(
  file: File,
): Promise<{
  formValues: QRFormValues;
  customization: QRCustomization;
  beautification: QrBeautification;
  selectedTemplate?: TemplateId;
} | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as DesignFile;
        if (data.version !== 1 || !data.formValues || !data.customization || !data.beautification) {
          resolve(null);
          return;
        }
        resolve({
          formValues: { ...defaultFormValues, ...data.formValues },
          customization: { ...defaultCustomization, ...data.customization },
          beautification: { ...defaultBeautification, ...data.beautification },
          selectedTemplate: data.selectedTemplate,
        });
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}
