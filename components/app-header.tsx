import { Linking, Pressable, Text, View, useWindowDimensions } from "react-native";
import { colors } from "@/constants/theme";
import { SectionShell } from "@/components/ui";

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
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
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


