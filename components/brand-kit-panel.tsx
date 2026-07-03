import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, FieldLabel } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

export function BrandKitPanel() {
  const brandKits = useQRStore((state) => state.brandKits);
  const refreshBrandKits = useQRStore((state) => state.refreshBrandKits);
  const applyBrandKit = useQRStore((state) => state.applyBrandKit);
  const deleteBrandKit = useQRStore((state) => state.deleteBrandKit);

  useEffect(() => {
    refreshBrandKits();
  }, [refreshBrandKits]);

  if (brandKits.length === 0) {
    return (
      <Panel>
        <View style={{ gap: 4 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            Brand Kits
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Save color schemes and styles as reusable kits.
          </Text>
        </View>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
            opacity: 0.4,
            textAlign: "center",
          }}
        >
          No saved kits yet. Customize a QR and use "Save as Kit" above.
        </Text>
      </Panel>
    );
  }

  return (
    <Panel>
      <View style={{ gap: 4 }}>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: -0.5,
          }}
        >
          Brand Kits
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 13,
            opacity: 0.6,
          }}
        >
          {brandKits.length} saved kit{brandKits.length !== 1 ? "s" : ""}.
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {brandKits.map((kit) => (
          <View
            key={kit.id}
            style={{
              width: 200,
              borderWidth: 3,
              borderColor: "#000",
              backgroundColor: colors.white,
              overflow: "hidden",
            }}
          >
            {/* Color bar */}
            <View
              style={{
                height: 8,
                backgroundColor: kit.customization.foregroundColor || "#000",
              }}
            />
            <View style={{ padding: 12, gap: 10 }}>
              <View style={{ gap: 2 }}>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 14,
                    textTransform: "uppercase",
                  }}
                >
                  {kit.name}
                </Text>
                {kit.customization.frameStyle ? (
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "700",
                      fontSize: 10,
                      opacity: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {kit.customization.dotStyle} /{" "}
                    {kit.customization.frameStyle}
                  </Text>
                ) : null}
              </View>

              {/* Color swatches */}
              <View style={{ flexDirection: "row", gap: 4 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 2,
                    borderColor: "#000",
                    backgroundColor:
                      kit.customization.foregroundColor || "#000",
                  }}
                />
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 2,
                    borderColor: "#000",
                    backgroundColor:
                      kit.customization.backgroundColor || "#fff",
                  }}
                />
                {kit.customization.gradientMode === "linear" ? (
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderWidth: 2,
                      borderColor: "#000",
                      backgroundColor:
                        kit.customization.gradientColor || "#000",
                    }}
                  />
                ) : null}
              </View>

              <View style={{ flexDirection: "row", gap: 6 }}>
                <Pressable
                  onPress={() => applyBrandKit(kit)}
                  style={({ pressed }) => ({
                    flex: 1,
                    borderWidth: 3,
                    borderColor: "#000",
                    backgroundColor: colors.secondary,
                    paddingVertical: 6,
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "900",
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Apply
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => deleteBrandKit(kit.id)}
                  style={({ pressed }) => ({
                    borderWidth: 3,
                    borderColor: "#000",
                    backgroundColor: colors.white,
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: colors.accent,
                      fontWeight: "900",
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Del
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Panel>
  );
}
