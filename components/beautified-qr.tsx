import { View } from "react-native";
import Svg, { Rect, Circle, Path, G } from "react-native-svg";
import QRCode from "qrcode";
import { useMemo } from "react";
import { ModuleShape, QrBeautification } from "@/types/qr";

function modulePath(
  x: number,
  y: number,
  size: number,
  shape: ModuleShape,
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
    default:
      return `M${x},${y}L${x + s},${y}L${x + s},${y + s}L${x},${y + s}Z`;
  }
}

export function BeautifiedQrCode({
  payload,
  size,
  foregroundColor,
  backgroundColor,
  beautification,
  errorCorrectionLevel = "H",
  maskPattern,
}: {
  payload: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
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
      const modules = qr.modules as unknown as boolean[][];
      const count = modules.length;
      const cellSize = size / count;
      return { modules, count, cellSize };
    } catch {
      return { modules: [] as boolean[][], count: 0, cellSize: 0 };
    }
  }, [payload, size, errorCorrectionLevel, maskPattern]);

  if (qrData.count === 0) return null;

  const { modules, count, cellSize } = qrData;
  const moduleSize = cellSize * 0.85;
  const offset = (cellSize - moduleSize) / 2;

  const elements: React.ReactElement[] = [];

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules[row]?.[col]) continue;
      const x = col * cellSize + offset;
      const y = row * cellSize + offset;
      const key = `${row}-${col}`;

      elements.push(
        <Path
          key={key}
          d={modulePath(x, y, moduleSize, beautification.moduleShape)}
          fill={foregroundColor}
        />,
      );
    }
  }

  // Pattern overlay
  if (beautification.pattern !== "none" && count > 0) {
    const patternElements: React.ReactElement[] = [];
    const step = beautification.pattern === "dots" ? 3 : 4;

    for (let row = 0; row < count; row += step) {
      for (let col = 0; col < count; col += step) {
        const cx = col * cellSize + cellSize / 2;
        const cy = row * cellSize + cellSize / 2;

        if (beautification.pattern === "dots") {
          patternElements.push(
            <Circle
              key={`p-${row}-${col}`}
              cx={cx}
              cy={cy}
              r={cellSize * 0.12}
              fill={beautification.patternColor || foregroundColor}
              opacity={0.3}
            />,
          );
        } else if (beautification.pattern === "crosses") {
          const s = cellSize * 0.3;
          patternElements.push(
            <G key={`p-${row}-${col}`} opacity={0.25}>
              <Rect
                x={cx - s / 2}
                y={cy - s * 1.5}
                width={s}
                height={s * 3}
                fill={beautification.patternColor || foregroundColor}
              />
              <Rect
                x={cx - s * 1.5}
                y={cy - s / 2}
                width={s * 3}
                height={s}
                fill={beautification.patternColor || foregroundColor}
              />
            </G>,
          );
        } else if (beautification.pattern === "diamonds") {
          const s = cellSize * 0.35;
          patternElements.push(
            <Path
              key={`p-${row}-${col}`}
              d={`M${cx},${cy - s}L${cx + s},${cy}L${cx},${cy + s}L${cx - s},${cy}Z`}
              fill={beautification.patternColor || foregroundColor}
              opacity={0.2}
            />,
          );
        } else if (beautification.pattern === "circles") {
          const s = cellSize * 0.15;
          patternElements.push(
            <Circle
              key={`p-${row}-${col}`}
              cx={cx}
              cy={cy}
              r={s}
              fill={beautification.patternColor || foregroundColor}
              opacity={0.4}
            />,
          );
        }
      }
    }
    elements.push(...patternElements);
  }

  return (
    <View
      style={{
        backgroundColor,
        padding: 8,
        borderWidth: 3,
        borderColor: "#000",
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
    const modules = qr.modules as unknown as boolean[][];
    const count = modules.length;
    const cellSize = 8;
    const size = count * cellSize;

    let rects = "";
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!modules[row]?.[col]) continue;
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
