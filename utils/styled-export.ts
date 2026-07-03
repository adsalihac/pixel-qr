import { Platform } from "react-native";

function modulePath(
  x: number,
  y: number,
  size: number,
  shape: string,
): string {
  const s = size;
  const r = s * 0.25;
  switch (shape) {
    case "circle":
      return `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.42}" />`;
    case "diamond":
      return `<polygon points="${x + s / 2},${y} ${x + s},${y + s / 2} ${x + s / 2},${y + s} ${x},${y + s / 2}" />`;
    case "droplet":
      return `<path d="M${x + s / 2},${y}Q${x + s},${y + s / 3} ${x + s * 0.8},${y + s * 0.7}Q${x + s / 2},${y + s} ${x + s / 2},${y + s}Q${x + s / 2},${y + s} ${x + s * 0.2},${y + s * 0.7}Q${x},${y + s / 3} ${x + s / 2},${y}Z" />`;
    case "rounded":
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" ry="${r}" />`;
    case "soft":
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.4}" ry="${s * 0.4}" />`;
    case "cross": {
      const bar = s * 0.3;
      const thick = s * 0.22;
      return `<path d="M${x + s / 2 - bar / 2},${y}h${bar}v${s}h-${bar}ZM${x},${y + s / 2 - thick / 2}h${s}v${thick}H${x}Z" />`;
    }
    case "leaf":
      return `<path d="M${x + s / 2},${y}Q${x + s},${y + s / 3} ${x + s * 0.8},${y + s * 0.7}Q${x + s / 2},${y + s} ${x + s / 2},${y + s}Q${x + s / 2},${y + s} ${x + s * 0.2},${y + s * 0.7}Q${x},${y + s / 3} ${x + s / 2},${y}Z" />`;
    case "diamondAlt":
      return `<path d="M${x + s / 2},${y}L${x + s},${y + s / 2}L${x + s / 2},${y + s}L${x},${y + s / 2}Z M${x + s * 0.35},${y + s / 2}L${x + s / 2},${y + s * 0.35}L${x + s * 0.65},${y + s / 2}L${x + s / 2},${y + s * 0.65}Z" />`;
    default:
      return `<rect x="${x}" y="${y}" width="${s}" height="${s}" />`;
  }
}

export function buildStyledQrSvg(
  payload: string,
  size: number,
  foregroundColor: string,
  backgroundColor: string,
  dotStyle: string,
  eyeStyle: string,
  gradientMode: string,
  gradientColor: string | undefined,
  errorCorrectionLevel: "L" | "M" | "Q" | "H",
  maskPattern?: number,
): string {
  try {
    const QRCode = require("qrcode");
    const qr = QRCode.create(payload || "pixelqr.app", {
      errorCorrectionLevel,
      maskPattern,
    });
    const modules = qr.modules as unknown as { size: number; get(row: number, col: number): number };
    const count = modules.size;
    const cellSize = size / count;
    const moduleSize = cellSize * 0.85;
    const off = (cellSize - moduleSize) / 2;

    let inner = "";
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!modules.get(row, col)) continue;
        const x = col * cellSize + off;
        const y = row * cellSize + off;
        const isEye = row < 8 && col < 8 || row < 8 && col >= count - 8 || row >= count - 8 && col < 8;
        inner += modulePath(x, y, moduleSize, isEye ? eyeStyle : dotStyle);
      }
    }

    const hasGradient = gradientMode === "linear" && gradientColor;

    let gradientDef = "";
    if (hasGradient) {
      gradientDef = `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${foregroundColor}" />
        <stop offset="100%" stop-color="${gradientColor}" />
      </linearGradient>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradientDef}</defs>
  <rect width="${size}" height="${size}" fill="${backgroundColor}" />
  <g fill="${hasGradient ? "url(#g)" : foregroundColor}">${inner}</g>
</svg>`;
  } catch {
    return "";
  }
}

function triggerWebDownload(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function downloadStyledPng(
  payload: string,
  size: number,
  foregroundColor: string,
  backgroundColor: string,
  dotStyle: string,
  eyeStyle: string,
  gradientMode: string,
  gradientColor: string | undefined,
  errorCorrectionLevel: "L" | "M" | "Q" | "H",
  maskPattern?: number,
) {
  if (Platform.OS !== "web") return;

  const svgString = buildStyledQrSvg(
    payload,
    size * 3,
    foregroundColor,
    backgroundColor,
    dotStyle,
    eyeStyle,
    gradientMode,
    gradientColor,
    errorCorrectionLevel,
    maskPattern,
  );
  if (!svgString) return;

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size * 3;
    canvas.height = size * 3;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const dataUrl = canvas.toDataURL("image/png");
    triggerWebDownload(dataUrl, "pixelqr.png");
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
