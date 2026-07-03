import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { FieldLabel, Input, Panel } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { generatePalettes, ColorPalette } from "@/utils/color-palette";

export function ColorPaletteGenerator() {
  const customization = useQRStore((s) => s.customization);
  const setCustomization = useQRStore((s) => s.setCustomization);
  const [seed, setSeed] = useState(customization.foregroundColor);

  const palettes = useMemo(() => generatePalettes(seed), [seed]);

  const handleApply = (palette: ColorPalette) => {
    if (palette.colors.length >= 2) {
      setCustomization({
        foregroundColor: palette.colors[0],
        backgroundColor: "#ffffff",
        gradientColor: palette.colors[1],
      });
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Input
            value={seed}
            onChangeText={setSeed}
            placeholder="#111827"
          />
        </View>
        <Pressable
          onPress={() => setSeed(customization.foregroundColor)}
          style={{
            width: 40,
            height: 40,
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: customization.foregroundColor,
          }}
        />
      </View>

      {palettes.length > 0 ? (
        <View style={{ gap: 8 }}>
          {palettes.map((palette) => (
            <View key={palette.name} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  {palette.name}
                </Text>
                <Pressable
                  onPress={() => handleApply(palette)}
                  style={({ pressed }) => ({
                    borderWidth: 2,
                    borderColor: "#000",
                    backgroundColor: colors.secondary,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "900",
                      fontSize: 8,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Apply
                  </Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {palette.colors.map((hex, i) => (
                  <View
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderWidth: 2,
                      borderColor: "#000",
                      backgroundColor: hex,
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
