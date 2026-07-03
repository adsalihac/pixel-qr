import { Text, View, useWindowDimensions } from "react-native";
import { colors } from "@/constants/theme";
import { Button, SectionShell } from "@/components/ui";
import { QRPreviewCard } from "@/components/qr-preview-card";
import { scrollToSection } from "@/utils/scroll-to-section";

export function HeroSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  return (
    <SectionShell id="top" style={{ backgroundColor: colors.background, paddingTop: 48, paddingBottom: 68 }}>
      <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 34, alignItems: "center" }}>
        <View style={{ flex: 1, gap: 22, minWidth: 0 }}>
          <View style={{ gap: 14 }}>
            <Text selectable style={{ color: colors.text, fontSize: isDesktop ? 58 : 40, lineHeight: isDesktop ? 64 : 46, fontWeight: "900" }}>
              Create beautiful QR codes in seconds.
            </Text>
            <Text selectable style={{ color: colors.textMuted, fontSize: 18, lineHeight: 28, maxWidth: 620 }}>
              PixelQR helps teams generate branded, customizable, and scan-safe QR codes for campaigns, menus, products, payments, apps, and everyday workflows.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <Button label="Start Creating" onPress={() => scrollToSection("generator")} />
            <Button label="View Templates" variant="secondary" onPress={() => scrollToSection("templates")} />
          </View>
        </View>
        <View style={{ flex: 1, width: "100%", maxWidth: 480 }}>
          <QRPreviewCard compact />
        </View>
      </View>
    </SectionShell>
  );
}
