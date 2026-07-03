export type ColorPalette = {
  name: string;
  colors: string[];
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h % 360;
  if (h < 0) h += 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

export function generatePalettes(seedHex: string): ColorPalette[] {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return [];
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return [
    {
      name: "Complementary",
      colors: complementary(h, s, l),
    },
    {
      name: "Analogous",
      colors: analogous(h, s, l),
    },
    {
      name: "Triadic",
      colors: triadic(h, s, l),
    },
    {
      name: "Split Complementary",
      colors: splitComplementary(h, s, l),
    },
    {
      name: "Square",
      colors: square(h, s, l),
    },
    {
      name: "Shades",
      colors: shades(h, s, l),
    },
  ];
}

function complementary(h: number, s: number, l: number): string[] {
  return [
    rgbToHex(rgbToHsl(h, s, l).r, rgbToHsl(h, s, l).g, rgbToHsl(h, s, l).b),
    ...[1, 2, 3].map((i) => {
      const h2 = (h + 180) % 360;
      const l2 = Math.max(0.15, Math.min(0.85, l + (i - 1) * 0.12));
      return hslToRgb(h2, Math.max(0.2, s - 0.1), l2);
    }).map((c) => rgbToHex(c.r, c.g, c.b)),
  ];
}

function analogous(h: number, s: number, l: number): string[] {
  return [-2, -1, 0, 1, 2].map((offset) => {
    const h2 = (h + offset * 30 + 360) % 360;
    const l2 = Math.max(0.15, Math.min(0.85, l + (Math.abs(offset) * 0.06)));
    return hslToRgb(h2, Math.max(0.3, s - Math.abs(offset) * 0.08), l2);
  }).map((c) => rgbToHex(c.r, c.g, c.b));
}

function triadic(h: number, s: number, l: number): string[] {
  return [0, 1, 2].map((i) => {
    const h2 = (h + i * 120) % 360;
    const l2 = Math.max(0.15, Math.min(0.85, l + (i % 2 === 0 ? 0 : 0.1)));
    return hslToRgb(h2, Math.max(0.3, s - i * 0.05), l2);
  }).map((c) => rgbToHex(c.r, c.g, c.b)).slice(0, 3);
}

function splitComplementary(h: number, s: number, l: number): string[] {
  return [0, 1, 2].map((i) => {
    const h2 = (h + 150 + i * 60) % 360;
    return hslToRgb(h2, Math.max(0.3, s - i * 0.05), Math.max(0.2, l - i * 0.05));
  }).map((c) => rgbToHex(c.r, c.g, c.b));
}

function square(h: number, s: number, l: number): string[] {
  return [0, 1, 2, 3].map((i) => {
    const h2 = (h + i * 90) % 360;
    return hslToRgb(h2, Math.max(0.2, s - i * 0.05), Math.max(0.2, l + (i % 2 === 0 ? 0.1 : -0.05)));
  }).map((c) => rgbToHex(c.r, c.g, c.b));
}

function shades(h: number, s: number, _l: number): string[] {
  return [0.15, 0.3, 0.5, 0.7, 0.85].map((l2) => {
    return hslToRgb(h, Math.max(0.1, s - 0.2), l2);
  }).map((c) => rgbToHex(c.r, c.g, c.b));
}
