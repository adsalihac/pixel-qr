import { View } from "react-native";
import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop } from "react-native-svg";
import QRCode from "qrcode";
import { useMemo } from "react";
import { DotStyle, EyeStyle, GradientMode, ModuleShape, QrBeautification } from "@/types/qr";

function modulePath(
  x: number,
  y: number,
  size: number,
  shape: ModuleShape | DotStyle | EyeStyle,
): string {
  const s = size;
  const r = s * 0.25;
  switch (shape) {
    case "circle": {
      const cx = x + s / 2;
      const cy = y + s / 2;
      const cr = s * 0.42;
      return `M${cx - cr},${cy}a${cr},${cr} 0 1,0 ${cr * 2},0a${cr},${cr} 0 1,0 -${cr * 2},0`;
    }
    case "diamond":
      return `M${x + s / 2},${y}L${x + s},${y + s / 2}L${x + s / 2},${y + s}L${x},${y + s / 2}Z`;
    case "droplet":
      return `M${x + s / 2},${y}Q${x + s},${y + s / 3} ${x + s * 0.8},${y + s * 0.7}Q${x + s / 2},${y + s} ${x + s / 2},${y + s}Q${x + s / 2},${y + s} ${x + s * 0.2},${y + s * 0.7}Q${x},${y + s / 3} ${x + s / 2},${y}Z`;
    case "rounded":
      return `M${x + r},${y}L${x + s - r},${y}Q${x + s},${y} ${x + s},${y + r}L${x + s},${y + s - r}Q${x + s},${y + s} ${x + s - r},${y + s}L${x + r},${y + s}Q${x},${y + s} ${x},${y + s - r}L${x},${y + r}Q${x},${y} ${x + r},${y}Z`;
    case "soft": {
      const sr = s * 0.4;
      return `M${x + sr},${y}L${x + s - sr},${y}Q${x + s},${y} ${x + s},${y + sr}L${x + s},${y + s - sr}Q${x + s},${y + s} ${x + s - sr},${y + s}L${x + sr},${y + s}Q${x},${y + s} ${x},${y + s - sr}L${x},${y + sr}Q${x},${y} ${x + sr},${y}Z`;
    }
    case "cross": {
      const bar = s * 0.3;
      const thick = s * 0.22;
      return [
        `M${x + s / 2 - bar / 2},${y}L${x + s / 2 + bar / 2},${y}L${x + s / 2 + bar / 2},${y + s}L${x + s / 2 - bar / 2},${y + s}Z`,
        `M${x},${y + s / 2 - thick / 2}L${x + s},${y + s / 2 - thick / 2}L${x + s},${y + s / 2 + thick / 2}L${x},${y + s / 2 + thick / 2}Z`,
      ].join("");
    }
    case "leaf":
      return `M${x + s / 2},${y}Q${x + s},${y + s / 3} ${x + s * 0.8},${y + s * 0.7}Q${x + s / 2},${y + s} ${x + s / 2},${y + s}Q${x + s / 2},${y + s} ${x + s * 0.2},${y + s * 0.7}Q${x},${y + s / 3} ${x + s / 2},${y}Z`;
    case "diamondAlt":
      return `M${x + s / 2},${y}L${x + s},${y + s / 2}L${x + s / 2},${y + s}L${x},${y + s / 2}Z M${x + s * 0.35},${y + s / 2}L${x + s / 2},${y + s * 0.35}L${x + s * 0.65},${y + s / 2}L${x + s / 2},${y + s * 0.65}Z`;
    default:
      return `M${x},${y}L${x + s},${y}L${x + s},${y + s}L${x},${y + s}Z`;
  }
}

export function BeautifiedQrCode({
  payload,
  size,
  foregroundColor,
  backgroundColor,
  dotStyle,
  eyeStyle,
  gradientMode,
  gradientColor,
  beautification,
  errorCorrectionLevel = "H",
  maskPattern,
}: {
  payload: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  dotStyle?: DotStyle;
  eyeStyle?: EyeStyle;
  gradientMode?: GradientMode;
  gradientColor?: string;
  beautification: QrBeautification;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  maskPattern?: number;
}) {
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(payload || "pixelqr.app", {
        errorCorrectionLevel,
        maskPattern,
      });
      const { modules } = qr;
      const count = (modules as unknown as { size: number }).size;
      const cellSize = size / count;
      return { modules, count, cellSize };
    } catch {
      return null;
    }
  }, [payload, size, errorCorrectionLevel, maskPattern]);

  if (!qrData || qrData.count === 0) return null;

  const { modules, count, cellSize } = qrData;
  const moduleSize = cellSize * 0.85;
  const off = (cellSize - moduleSize) / 2;
  const mod = modules as unknown as { size: number; get(row: number, col: number): number };

  const activeShape: ModuleShape | DotStyle = beautification.enabled ? beautification.moduleShape : (dotStyle || "rounded");
  const activeEye = eyeStyle || "rounded";
  const hasGradient = gradientMode === "linear" && gradientColor;
  const gradientId = "qr-grad";

  const elements: React.ReactElement[] = [];

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!mod.get(row, col)) continue;
      const x = col * cellSize + off;
      const y = row * cellSize + off;
      const isEye = row < 8 && col < 8 || row < 8 && col >= count - 8 || row >= count - 8 && col < 8;
      elements.push(
        <Path
          key={`m-${row}-${col}`}
          d={modulePath(x, y, moduleSize, isEye ? activeEye : activeShape)}
          fill={hasGradient ? `url(#${gradientId})` : foregroundColor}
        />,
      );
    }
  }

  if (beautification.pattern !== "none" && count > 0) {
    const step = beautification.pattern === "dots" ? 3 : 4;
    for (let row = 0; row < count; row += step) {
      for (let col = 0; col < count; col += step) {
        const cx = col * cellSize + cellSize / 2;
        const cy = row * cellSize + cellSize / 2;
        const pc = beautification.patternColor || foregroundColor;

        if (beautification.pattern === "dots") {
          elements.push(
            <Circle key={`p-${row}-${col}`} cx={cx} cy={cy} r={cellSize * 0.12} fill={pc} opacity={0.3} />
          );
        } else if (beautification.pattern === "crosses") {
          const s = cellSize * 0.3;
          elements.push(
            <G key={`p-${row}-${col}`} opacity={0.25}>
              <Rect x={cx - s / 2} y={cy - s * 1.5} width={s} height={s * 3} fill={pc} />
              <Rect x={cx - s * 1.5} y={cy - s / 2} width={s * 3} height={s} fill={pc} />
            </G>
          );
        } else if (beautification.pattern === "diamonds") {
          const s = cellSize * 0.35;
          elements.push(
            <Path key={`p-${row}-${col}`} d={`M${cx},${cy - s}L${cx + s},${cy}L${cx},${cy + s}L${cx - s},${cy}Z`} fill={pc} opacity={0.2} />
          );
        } else if (beautification.pattern === "circles") {
          elements.push(
            <Circle key={`p-${row}-${col}`} cx={cx} cy={cy} r={cellSize * 0.15} fill={pc} opacity={0.4} />
          );
        }
      }
    }
  }

  return (
    <View style={{ backgroundColor, padding: 8, borderWidth: 3, borderColor: "#000" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {hasGradient ? (
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={foregroundColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={gradientColor!} stopOpacity="1" />
            </LinearGradient>
          ) : null}
        </Defs>
        <Rect width={size} height={size} fill={backgroundColor} rx={0} />
        {elements}
      </Svg>
    </View>
  );
}

export function AnimatedQrSvg(
  payload: string,
  foregroundColor: string,
  backgroundColor: string,
  speed: number,
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "H",
  maskPattern?: number,
): string {
  try {
    const qr = QRCode.create(payload || "pixelqr.app", {
      errorCorrectionLevel,
      maskPattern,
    });
    const modules = qr.modules as unknown as { size: number; get(row: number, col: number): number };
    const count = modules.size;
    const cellSize = 8;
    const size = count * cellSize;

    let rects = "";
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!modules.get(row, col)) continue;
        const x = col * cellSize;
        const y = row * cellSize;
        rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${foregroundColor}" />`;
      }
    }

    const duration = Math.max(2, 6 - (speed || 1) * 1.5);
    const hue = foregroundColor.startsWith("#")
      ? foregroundColor
      : "#111827";

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${backgroundColor}" />
  <style>
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    @keyframes colorCycle {
      0% { fill: ${hue}; }
      25% { fill: ${hue}; filter: hue-rotate(90deg); }
      50% { fill: ${hue}; filter: hue-rotate(180deg); }
      75% { fill: ${hue}; filter: hue-rotate(270deg); }
      100% { fill: ${hue}; }
    }
    .qr-module {
      animation: pulse ${duration}s ease-in-out infinite;
    }
  </style>
  ${rects.replace(/<rect/g, '<rect class="qr-module"')}
</svg>`;
  } catch {
    return "";
  }
}
