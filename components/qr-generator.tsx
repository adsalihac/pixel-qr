import { View, useWindowDimensions } from "react-native";
import { QRCustomizationPanel } from "@/components/qr-customization-panel";
import { QRInputPanel } from "@/components/qr-input-panel";
import { QRPreviewCard } from "@/components/qr-preview-card";
import { SectionShell } from "@/components/ui";

export function QRGenerator() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;

  const controls = (
    <View style={{ flex: 1, gap: 18, minWidth: 0 }}>
      <QRInputPanel />
      <QRCustomizationPanel />
    </View>
  );

  const preview = (
    <View style={{ flex: 1, minWidth: 0 }}>
      <QRPreviewCard />
    </View>
  );

  return (
    <SectionShell id="generator" style={{ backgroundColor: colorsBackground, paddingTop: 12, paddingBottom: 72 }}>
      <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 22, alignItems: "flex-start" }}>
        {isDesktop ? (
          <>
            {controls}
            {preview}
          </>
        ) : (
          <>
            {preview}
            {controls}
          </>
        )}
      </View>
    </SectionShell>
  );
}

const colorsBackground = "#f7f9fc";
