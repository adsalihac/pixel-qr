import { useState } from "react";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { ColorPicker } from "@/components/color-picker";
import { GradientPicker } from "@/components/gradient-picker";
import { LogoUploader } from "@/components/logo-uploader";
import { BeautifyOptions } from "@/components/beautify-options";
import {
  Button,
  FieldLabel,
  Input,
  Panel,
  SelectPill,
  ToggleButton,
} from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { DotStyle, EyeStyle, FrameStyle, ShadowDepth } from "@/types/qr";

const dotStyles: DotStyle[] = ["square", "rounded", "circle", "soft", "cross", "diamond", "leaf"];
const eyeStyles: EyeStyle[] = ["square", "rounded", "circle", "leaf", "diamondAlt"];
const frameStyles: FrameStyle[] = ["none", "simple", "label", "ticket", "custom", "bold", "double", "shadow"];
const shadowDepths: ShadowDepth[] = ["small", "medium", "large"];

const numberOr = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function QRCustomizationPanel() {
  const customization = useQRStore((state) => state.customization);
  const setCustomization = useQRStore((state) => state.setCustomization);
  const resetCustomization = useQRStore((state) => state.resetCustomization);
  const saveAsBrandKit = useQRStore((state) => state.saveAsBrandKit);
  const [kitName, setKitName] = useState("");

  const handleSaveKit = () => {
    if (kitName.trim()) {
      saveAsBrandKit(kitName.trim());
      setKitName("");
    }
  };

  return (
    <Panel>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <View style={{ gap: 4, flex: 1, minWidth: 180 }}>
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
            Customize
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
            Tune the QR style while preserving scan safety.
          </Text>
        </View>
        <Button label="Reset" variant="outline" onPress={resetCustomization} />
      </View>

      {/* Brand Kit Save */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <View style={{ flex: 1, minWidth: 140 }}>
          <Input
            value={kitName}
            onChangeText={setKitName}
            placeholder="Kit name"
          />
        </View>
        <Button
          label="Save as Kit"
          variant="secondary"
          onPress={handleSaveKit}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 190 }}>
          <ColorPicker
            label="Foreground"
            value={customization.foregroundColor}
            onChange={(foregroundColor) => setCustomization({ foregroundColor })}
          />
        </View>
        <View style={{ flex: 1, minWidth: 190 }}>
          <ColorPicker
            label="Background"
            value={customization.backgroundColor}
            onChange={(backgroundColor) => setCustomization({ backgroundColor })}
          />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <FieldLabel>Gradient</FieldLabel>
        <GradientPicker
          value={customization.gradientMode}
          onChange={(gradientMode) => setCustomization({ gradientMode })}
        />
        {customization.gradientMode === "linear" ? (
          <ColorPicker
            label="Gradient color"
            value={customization.gradientColor}
            onChange={(gradientColor) => setCustomization({ gradientColor })}
          />
        ) : null}
      </View>

      <View style={{ gap: 10 }}>
        <FieldLabel>Dot style</FieldLabel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {dotStyles.map((style) => (
            <SelectPill
              key={style}
              value={customization.dotStyle}
              option={style}
              label={style}
              onSelect={(dotStyle) => setCustomization({ dotStyle })}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <FieldLabel>Corner eye style</FieldLabel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {eyeStyles.map((style) => (
            <SelectPill
              key={style}
              value={customization.eyeStyle}
              option={style}
              label={style}
              onSelect={(eyeStyle) => setCustomization({ eyeStyle })}
            />
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 190 }}>
          <ColorPicker
            label="Outer eye color"
            value={customization.outerEyeColor}
            onChange={(outerEyeColor) => setCustomization({ outerEyeColor })}
          />
        </View>
        <View style={{ flex: 1, minWidth: 190 }}>
          <ColorPicker
            label="Inner eye color"
            value={customization.innerEyeColor}
            onChange={(innerEyeColor) => setCustomization({ innerEyeColor })}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <FieldLabel>QR size</FieldLabel>
          <Input
            value={String(customization.size)}
            onChangeText={(value) =>
              setCustomization({ size: numberOr(value, customization.size) })
            }
          />
        </View>
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <FieldLabel>Padding</FieldLabel>
          <Input
            value={String(customization.padding)}
            onChangeText={(value) =>
              setCustomization({
                padding: numberOr(value, customization.padding),
              })
            }
          />
        </View>
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <FieldLabel>Logo size %</FieldLabel>
          <Input
            value={String(customization.logoSize)}
            onChangeText={(value) =>
              setCustomization({
                logoSize: numberOr(value, customization.logoSize),
              })
            }
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <ToggleButton
          label="Transparent background"
          active={customization.transparentBackground}
          onPress={() =>
            setCustomization({
              transparentBackground: !customization.transparentBackground,
            })
          }
        />
        <ToggleButton
          label="Logo background"
          active={customization.logoBackground}
          onPress={() =>
            setCustomization({ logoBackground: !customization.logoBackground })
          }
        />
      </View>

      {/* Corner radius + Shadow depth */}
      <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <FieldLabel>Corner radius</FieldLabel>
          <Input
            value={String(customization.cornerRadius)}
            onChangeText={(value) =>
              setCustomization({ cornerRadius: numberOr(value, customization.cornerRadius) })
            }
          />
        </View>
        <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
          <FieldLabel>Shadow depth</FieldLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {shadowDepths.map((sd) => (
              <SelectPill
                key={sd}
                value={customization.shadowDepth}
                option={sd}
                label={sd}
                onSelect={(shadowDepth) => setCustomization({ shadowDepth })}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <FieldLabel>Frame style</FieldLabel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {frameStyles.map((style) => (
            <SelectPill
              key={style}
              value={customization.frameStyle}
              option={style}
              label={style}
              onSelect={(frameStyle) => setCustomization({ frameStyle })}
            />
          ))}
        </View>
      </View>

      {/* Custom frame editor */}
      {customization.frameStyle === "custom" ? (
        <View style={{ gap: 12 }}>
          <FieldLabel>Frame content</FieldLabel>
          <Input
            value={customization.frameLabel}
            onChangeText={(frameLabel) => setCustomization({ frameLabel })}
            placeholder="SCAN TO ORDER"
          />
          <Input
            value={customization.frameCtaText}
            onChangeText={(frameCtaText) => setCustomization({ frameCtaText })}
            placeholder="Order now →"
          />
          <View style={{ flex: 1, minWidth: 190 }}>
            <ColorPicker
              label="CTA button color"
              value={customization.frameCtaColor}
              onChange={(frameCtaColor) => setCustomization({ frameCtaColor })}
            />
          </View>
          <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
            <FieldLabel>Border width</FieldLabel>
            <Input
              value={String(customization.frameBorderWidth)}
              onChangeText={(value) =>
                setCustomization({
                  frameBorderWidth: numberOr(value, customization.frameBorderWidth),
                })
              }
            />
          </View>
        </View>
      ) : null}

      <View
        style={{
          borderTopWidth: 3,
          borderTopColor: "#000",
          paddingTop: 14,
        }}
      >
        <BeautifyOptions />
      </View>

      <LogoUploader
        uri={customization.logoUri}
        onChange={(logoUri) => setCustomization({ logoUri })}
      />
    </Panel>
  );
}
