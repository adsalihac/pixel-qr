import { Text, View, useWindowDimensions } from "react-native";
import { colors } from "@/constants/theme";
import { Button, SectionShell } from "@/components/ui";
import { scrollToSection } from "@/utils/scroll-to-section";

export function HeroSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const chips = ["ISO-friendly contrast", "One-click exports", "Template-first workflow"];

  return (
    <SectionShell id="top" style={{ backgroundColor: colors.background, paddingTop: 56, paddingBottom: 74 }}>
      <View style={{ flexDirection: "column", gap: 34, alignItems: "center" }}>
        <View style={{ gap: 24, minWidth: 0, maxWidth: isDesktop ? 880 : "100%", alignItems: "center" }}>
          <View style={{ gap: 16 }}>
            <View style={{ alignSelf: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: "#ffffff", paddingHorizontal: 12, minHeight: 30, justifyContent: "center" }}>
              <Text selectable style={{ color: colors.primaryDark, fontWeight: "800", fontSize: 12 }}>
                PROFESSIONAL QR STUDIO
              </Text>
            </View>
            <Text selectable style={{ color: colors.text, fontSize: isDesktop ? 56 : 38, lineHeight: isDesktop ? 62 : 44, fontWeight: "900", textAlign: "center" }}>
              Build production-ready QR experiences.
            </Text>
            <Text selectable style={{ color: colors.textMuted, fontSize: 18, lineHeight: 28, maxWidth: 720, textAlign: "center" }}>
              PixelQR gives your team a modern workspace for branded, scan-safe codes across campaigns, packaging, menu systems, payments, and product touchpoints.
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {chips.map((chip) => (
              <View key={chip} style={{ borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: "#ffffff", paddingHorizontal: 12, minHeight: 34, justifyContent: "center" }}>
                <Text selectable style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>
                  {chip}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Button label="Start Creating" onPress={() => scrollToSection("generator")} />
            <Button label="View Templates" variant="secondary" onPress={() => scrollToSection("templates")} />
          </View>
        </View>
      </View>
    </SectionShell>
  );
}
