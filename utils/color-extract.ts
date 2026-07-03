export type ExtractedPalette = {
  dominant: string;
  palette: string[];
  contrast: string;
  accent: string;
};

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(r: number, g: number, b: number): number {
  const [rl, gl, bl] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getComplement(color: string): string {
  const [r, g, b] = hexToRgb(color);
  return rgbToHex(255 - r, 255 - g, 255 - b);
}

function getAnalogous(color: string): string[] {
  const [r, g, b] = hexToRgb(color);
  return [
    rgbToHex(Math.min(255, r + 30), g, Math.max(0, b - 30)),
    rgbToHex(Math.max(0, r - 30), g, Math.min(255, b + 30)),
  ];
}

export async function extractColorsFromImage(
  uri: string,
): Promise<ExtractedPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not available"));

      const size = 64;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorMap = new Map<string, number>();

      for (let i = 0; i < imageData.length; i += 16) {
        const r = Math.round(imageData[i] / 32) * 32;
        const g = Math.round(imageData[i + 1] / 32) * 32;
        const b = Math.round(imageData[i + 2] / 32) * 32;
        const hex = rgbToHex(r, g, b);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      const sorted = [...colorMap.entries()]
        .filter(([c]) => c !== "#000000" && c !== "#ffffff")
        .sort((a, b) => b[1] - a[1]);

      const dominant = sorted[0]?.[0] || "#111827";
      const palette = sorted.slice(0, 5).map(([c]) => c);

      const analogous = getAnalogous(dominant);
      const complement = getComplement(dominant);
      const bestContrast =
        contrastRatio(dominant, "#ffffff") > 4.5 ? "#ffffff" : "#000000";
      const accentColor =
        contrastRatio(dominant, complement) > 3 ? complement : analogous[0];

      resolve({
        dominant,
        palette,
        contrast: bestContrast,
        accent: accentColor,
      });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = uri;
  });
}
