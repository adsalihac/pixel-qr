import { Text, View } from "react-native";
import { Button } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import {
  DotStyle,
  EyeStyle,
  FrameStyle,
  ShadowDepth,
  ErrorCorrectionLevel,
  MaskPattern,
  GradientMode,
} from "@/types/qr";

const dotStyles: DotStyle[] = ["square", "rounded", "circle", "soft", "cross", "diamond", "leaf"];
const eyeStyles: EyeStyle[] = ["square", "rounded", "circle", "leaf", "diamondAlt"];
const frameStyles: FrameStyle[] = ["none", "simple", "label", "ticket", "custom", "bold", "double", "shadow"];
const shadowDepths: ShadowDepth[] = ["small", "medium", "large"];
const eclLevels: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];
const gradientModes: GradientMode[] = ["none", "linear"];

const colorPalettes = [
  ["#111827", "#2563eb", "#ffffff"],
  ["#064e3b", "#10b981", "#ffffff"],
  ["#431407", "#ea580c", "#fff7ed"],
  ["#4c1d95", "#c084fc", "#faf5ff"],
  ["#5c0e07", "#f43f5e", "#fff1f2"],
  ["#0c4a6e", "#06b6d4", "#ecfeff"],
  ["#1e1b4b", "#818cf8", "#eef2ff"],
  ["#292524", "#d97706", "#fffbeb"],
  ["#172554", "#3b82f6", "#eff6ff"],
  ["#052e16", "#4ade80", "#f0fdf4"],
  ["#0f172a", "#64748b", "#f8fafc"],
  ["#422006", "#f59e0b", "#fefce8"],
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SurpriseMe() {
  const setCustomization = useQRStore((s) => s.setCustomization);
  const setFormValues = useQRStore((s) => s.setFormValues);
  const setBeautification = useQRStore((s) => s.setBeautification);
  const formValues = useQRStore((s) => s.formValues);

  const handleSurprise = () => {
    const palette = pick(colorPalettes);
    setCustomization({
      foregroundColor: palette[0],
      backgroundColor: palette[2],
      gradientMode: pick(gradientModes),
      gradientColor: palette[1],
      dotStyle: pick(dotStyles),
      eyeStyle: pick(eyeStyles),
      innerEyeColor: palette[1],
      outerEyeColor: palette[0],
      frameStyle: pick(frameStyles),
      shadowDepth: pick(shadowDepths),
      errorCorrectionLevel: pick(eclLevels),
      maskPattern: "auto" as MaskPattern,
      cornerRadius: pick([0, 4, 8, 12]),
      padding: pick([12, 16, 18, 20, 24]),
    });
    setBeautification({
      enabled: Math.random() > 0.6,
      moduleShape: pick(["square", "rounded", "circle", "diamond", "droplet"]),
      pattern: pick(["none", "dots", "crosses", "diamonds", "circles"]),
      patternColor: palette[1],
      animationEnabled: false,
      animationSpeed: 1,
    });
  };

  return (
    <View style={{ gap: 8 }}>
      <Button
        label="Surprise Me ✦"
        variant="secondary"
        onPress={handleSurprise}
      />
      <Text
        selectable
        style={{
          color: "#000",
          fontWeight: "700",
          fontSize: 10,
          opacity: 0.4,
        }}
      >
        Randomizes all styles for instant inspiration.
      </Text>
    </View>
  );
}
