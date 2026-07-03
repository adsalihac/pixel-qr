import { Linking, Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { SectionShell } from "@/components/ui";
import { scrollToSection } from "@/utils/scroll-to-section";

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
        <Pressable
          onPress={() => Linking.openURL("https://github.com/adsalihac/pixel-qr/fork")}
          style={({ pressed }) => ({
            minHeight: 42,
            borderRadius: 999,
            paddingHorizontal: 16,
            borderWidth: 1.25,
            borderColor: colors.border,
            backgroundColor: "#ffffff",
            justifyContent: "center",
            opacity: pressed ? 0.9 : 1
          })}
        >
          <Text selectable style={{ color: colors.text, fontSize: 13, fontWeight: "800" }}>
            Contribute
          </Text>
        </Pressable>
      </View>
    </SectionShell>
  );
}
