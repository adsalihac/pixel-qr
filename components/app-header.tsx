import { Linking, Pressable, Text, View, useWindowDimensions } from "react-native";
import { colors, shadows } from "@/constants/theme";
import { SectionShell } from "@/components/ui";
import { scrollToSection } from "@/utils/scroll-to-section";

export function AppHeader() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <SectionShell
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 4,
        borderBottomColor: "#000",
      }}
    >
      <View
        style={{
          minHeight: 72,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Pressable
          onPress={() => scrollToSection("top")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderWidth: 4,
            borderColor: "#000",
            backgroundColor: colors.accent,
            paddingHorizontal: 12,
            paddingVertical: 8,
            boxShadow: "4px 4px 0px 0px #000",
          }}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontSize: 18,
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            PixelQR
          </Text>
        </Pressable>

        {!isMobile && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <NavButton label="Generator" onPress={() => scrollToSection("generator")} />
            <NavButton label="Gallery" onPress={() => scrollToSection("gallery")} />
            <NavButton label="Templates" onPress={() => scrollToSection("templates")} />
            <NavButton label="History" onPress={() => scrollToSection("history")} />
            <NavButton label="Brand Kits" onPress={() => scrollToSection("brand-kits")} />
            <NavButton label="Bulk" onPress={() => scrollToSection("bulk")} />
            <NavButton label="API" onPress={() => scrollToSection("api")} />
          </View>
        )}

        <Pressable
          onPress={() => Linking.openURL("https://github.com/adsalihac/pixel-qr/fork")}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 18,
            borderWidth: 4,
            borderColor: "#000",
            backgroundColor: colors.secondary,
            justifyContent: "center",
            boxShadow: "4px 4px 0px 0px #000",
            transform: pressed
              ? [{ translateX: 2 }, { translateY: 2 }]
              : [{ translateX: 0 }, { translateY: 0 }],
            transitionDuration: "100ms",
            transitionProperty: "transform, box-shadow",
          })}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 12,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Fork
          </Text>
        </Pressable>
      </View>
    </SectionShell>
  );
}

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        paddingHorizontal: 14,
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: colors.white,
        justifyContent: "center",
        transform: pressed
          ? [{ translateX: 1 }, { translateY: 1 }]
          : [{ translateX: 0 }, { translateY: 0 }],
        transitionDuration: "100ms",
        transitionProperty: "transform",
      })}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
