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
    <SectionShell style={{ backgroundColor: "rgba(255,255,255,0.92)", borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ minHeight: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Pressable onPress={() => scrollToSection("top")} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }}>
            <Text selectable style={{ color: "#ffffff", fontWeight: "900" }}>
              P
            </Text>
          </View>
          <Text selectable style={{ color: colors.text, fontSize: 19, fontWeight: "900" }}>
            PixelQR
          </Text>
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {links.map((link) => (
            <Pressable key={link.id} onPress={() => scrollToSection(link.id)}>
              <Text selectable style={{ color: colors.textMuted, fontSize: 14, fontWeight: "700" }}>
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
