import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Button, SectionShell } from "@/components/ui";
import { scrollToSection } from "@/utils/scroll-to-section";

const links = [
  { label: "Features", id: "features" },
  { label: "Templates", id: "templates" },
  { label: "Export", id: "export" }
];

export function AppHeader() {
  return (
    <SectionShell style={{ backgroundColor: "rgba(243,245,249,0.96)", borderBottomWidth: 1.25, borderBottomColor: colors.border }}>
      <View style={{ minHeight: 78, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Pressable onPress={() => scrollToSection("top")} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(15,74,203,0.28)" }}>
            <Text selectable style={{ color: "#ffffff", fontWeight: "900", fontSize: 15 }}>
              P
            </Text>
          </View>
          <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
            PixelQR
          </Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {links.map((link) => (
            <Pressable key={link.id} onPress={() => scrollToSection(link.id)}>
              <Text selectable style={{ color: colors.textMuted, fontSize: 14, fontWeight: "800" }}>
                {link.label}
              </Text>
            </Pressable>
          ))}
          <Button label="Create QR" onPress={() => scrollToSection("generator")} />
        </View>
      </View>
    </SectionShell>
  );
}
