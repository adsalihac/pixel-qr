import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { FieldLabel, Input } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { generatePalettes, ColorPalette } from "@/utils/color-palette";

export function ColorPaletteGenerator() {
  const [seed, setSeed] = useState("#111827");
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const setCustomization = useQRStore((s) => s.setCustomization);

  const handleGenerate = () => {
    const result = generatePalettes(seed);
    setPalettes(result);
  };

  const applyColor = (hex: string) => {
    setCustomization({ foregroundColor: hex });
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ gap: 6 }}>
        <FieldLabel>Color Palette Generator</FieldLabel>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 11,
            opacity: 0.5,
          }}
        >
          Pick a seed color to generate harmonious palettes.
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View style={{ width: 44, height: 44, borderWidth: 3, borderColor: "#000", backgroundColor: seed }} />
        <View style={{ flex: 1 }}>
          <Input value={seed} onChangeText={setSeed} placeholder="#111827" />
        </View>
        <Pressable
          onPress={handleGenerate}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 14,
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: colors.secondary,
            justifyContent: "center",
            boxShadow: "3px 3px 0px 0px #000",
            transform: pressed ? [{ translateX: 1 }, { translateY: 1 }] : [],
          })}
        >
          <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
            Generate
          </Text>
        </Pressable>
      </View>

      {palettes.length > 0 ? (
        <View style={{ gap: 10 }}>
          {palettes.map((palette) => (
            <View key={palette.name} style={{ gap: 4 }}>
              <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
                {palette.name}
              </Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {palette.colors.map((hex) => (
                  <Pressable
                    key={hex}
                    onPress={() => applyColor(hex)}
                    style={({ pressed }) => ({
                      width: 32,
                      height: 32,
                      borderWidth: 2,
                      borderColor: "#000",
                      backgroundColor: hex,
                      opacity: pressed ? 0.7 : 1,
                    })}
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
