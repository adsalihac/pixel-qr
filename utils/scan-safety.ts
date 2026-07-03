import { QRCustomization, ScanWarning } from "@/types/qr";

const expandHex = (hex: string) => {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return clean.split("").map((part) => part + part).join("");
  }
  return clean;
};

const luminance = (hex: string) => {
  const expanded = expandHex(hex);
  const rgb = [0, 2, 4].map((index) => parseInt(expanded.slice(index, index + 2), 16) / 255);
  const linear = rgb.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

export function contrastRatio(foreground: string, background: string) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function getScanSafety(customization: QRCustomization) {
  const warnings: ScanWarning[] = [];
  const background = customization.transparentBackground ? "#ffffff" : customization.backgroundColor;
  const contrast = contrastRatio(customization.foregroundColor, background);

  if (contrast < 4.5) {
    warnings.push({
      id: "contrast",
      message: "Increase color contrast to keep the QR readable in dim lighting.",
      severity: contrast < 3 ? "danger" : "warning"
    });
  }

  if (customization.logoUri && customization.logoSize > 24) {
    warnings.push({
      id: "logo",
      message: "Reduce logo size below 24% for safer scans on older cameras.",
      severity: customization.logoSize > 30 ? "danger" : "warning"
    });
  }

  if (customization.padding < 12) {
    warnings.push({
      id: "quiet-zone",
      message: "Add more padding for the quiet zone around the QR code.",
      severity: customization.padding < 8 ? "danger" : "warning"
    });
  }

  const score = Math.max(42, Math.round(100 - warnings.reduce((total, warning) => total + (warning.severity === "danger" ? 24 : 12), 0)));
  return { score, warnings, contrast };
}
