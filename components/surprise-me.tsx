import { useQRStore } from "@/store/qr-store";
import { DotStyle, EyeStyle, FrameStyle, ShadowDepth, ErrorCorrectionLevel } from "@/types/qr";
import { Button } from "@/components/ui";

const dotStyles: DotStyle[] = ["square", "rounded", "circle", "soft", "cross", "diamond", "leaf"];
const eyeStyles: EyeStyle[] = ["square", "rounded", "circle", "leaf", "diamondAlt"];
const frameStyles: FrameStyle[] = ["none", "simple", "label", "ticket", "custom", "bold", "double", "shadow"];
const shadowDepths: ShadowDepth[] = ["small", "medium", "large"];
const ecls: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

const colorPairs = [
  ["#111827", "#ffffff"], ["#5c0e07", "#fff1f2"], ["#0c4a6e", "#e0f2fe"],
  ["#064e3b", "#ecfdf5"], ["#422006", "#fffbeb"], ["#1e1b4b", "#eef2ff"],
  ["#431407", "#fff7ed"], ["#3b0764", "#faf5ff"], ["#292524", "#fafaf9"],
  ["#172554", "#eff6ff"], ["#4c1d95", "#fdf4ff"], ["#020617", "#f0f9ff"],
  ["#052e16", "#f0fdf4"], ["#5c0e07", "#fef2f2"], ["#164e63", "#ecfeff"],
  ["#0f172a", "#f8fafc"], ["#18181b", "#fafafa"], ["#1c1917", "#f5f5f4"],
];

export function SurpriseMeButton() {
  const setCustomization = useQRStore((s) => s.setCustomization);
  const setFormValues = useQRStore((s) => s.setFormValues);
  const formValues = useQRStore((s) => s.formValues);

  const handleSurprise = () => {
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const [fg, bg] = pick(colorPairs);
    const hasGradient = Math.random() > 0.5;

    setCustomization({
      foregroundColor: fg,
      backgroundColor: bg,
      gradientMode: hasGradient ? "linear" : "none",
      gradientColor: pick(colorPairs)[0],
      dotStyle: pick(dotStyles),
      eyeStyle: pick(eyeStyles),
      innerEyeColor: pick(colorPairs)[0],
      outerEyeColor: fg,
      frameStyle: pick(frameStyles),
      shadowDepth: pick(shadowDepths),
      errorCorrectionLevel: pick(ecls),
      size: [200, 220, 240, 260, 280][Math.floor(Math.random() * 5)],
      padding: [12, 14, 16, 18, 20, 22][Math.floor(Math.random() * 6)],
      cornerRadius: [0, 4, 8, 12, 16][Math.floor(Math.random() * 5)],
      basicMode: false,
    });

    const titles = ["Fresh Look", "New Vibe", "Bold Move", "Smooth", "Sharp", "Clean", "Wild", "Sleek"];
    setFormValues({
      title: pick(titles).toUpperCase(),
      subtitle: formValues.subtitle || "Scan to explore",
    });
  };

  return (
    <Button label="Surprise Me" variant="secondary" onPress={handleSurprise} />
  );
}
