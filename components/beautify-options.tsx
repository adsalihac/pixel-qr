import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { ColorPicker } from "@/components/color-picker";
import { FieldLabel, SelectPill, ToggleButton } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { BeautifyPattern, ModuleShape } from "@/types/qr";

const moduleShapes: ModuleShape[] = ["square", "rounded", "circle", "diamond", "droplet"];
const patterns: BeautifyPattern[] = ["none", "dots", "crosses", "diamonds", "circles"];

export function BeautifyOptions() {
  const customization = useQRStore((state) => state.customization);
  const beautification = useQRStore((state) => state.beautification);
  const setBeautification = useQRStore((state) => state.setBeautification);

  return (
    <View style={{ gap: 14 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <View style={{ gap: 2 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: -0.3,
            }}
          >
            QR Beautification
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 12,
              opacity: 0.6,
            }}
          >
            Custom module shapes, patterns, and effects.
          </Text>
        </View>
        <ToggleButton
          label="Enable"
          active={beautification.enabled}
          onPress={() =>
            setBeautification({ enabled: !beautification.enabled })
          }
        />
      </View>

      {beautification.enabled ? (
        <View style={{ gap: 12 }}>
          {/* Module shape */}
          <View style={{ gap: 8 }}>
            <FieldLabel>Module shape</FieldLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {moduleShapes.map((shape) => (
                <SelectPill
                  key={shape}
                  value={beautification.moduleShape}
                  option={shape}
                  label={shape}
                  onSelect={(moduleShape) => setBeautification({ moduleShape })}
                />
              ))}
            </View>
          </View>

          {/* Background pattern */}
          <View style={{ gap: 8 }}>
            <FieldLabel>Background pattern</FieldLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {patterns.map((p) => (
                <SelectPill
                  key={p}
                  value={beautification.pattern}
                  option={p}
                  label={p === "none" ? "None" : p}
                  onSelect={(pattern) => setBeautification({ pattern })}
                />
              ))}
            </View>
          </View>

          {beautification.pattern !== "none" ? (
            <ColorPicker
              label="Pattern color"
              value={beautification.patternColor}
              onChange={(patternColor) => setBeautification({ patternColor })}
            />
          ) : null}

          {/* Animation */}
          <View style={{ gap: 8 }}>
            <FieldLabel>Animation</FieldLabel>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <ToggleButton
                label="Animated export"
                active={beautification.animationEnabled}
                onPress={() =>
                  setBeautification({
                    animationEnabled: !beautification.animationEnabled,
                  })
                }
              />
              {beautification.animationEnabled ? (
                <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                  <SelectPill
                    value={beautification.animationSpeed > 1.5 ? "fast" : "slow"}
                    option="slow"
                    label="Slow"
                    onSelect={() => setBeautification({ animationSpeed: 1 })}
                  />
                  <SelectPill
                    value={beautification.animationSpeed > 1.5 ? "fast" : "slow"}
                    option="fast"
                    label="Fast"
                    onSelect={() => setBeautification({ animationSpeed: 2.5 })}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
