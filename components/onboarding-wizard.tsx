import { useState } from "react";
import { Modal, Pressable, Text, View, useWindowDimensions } from "react-native";
import { colors } from "@/constants/theme";
import { Button } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { QRKind } from "@/types/qr";

const steps = [
  {
    title: "Choose your QR type",
    body: "URL, text, email, phone, Wi-Fi, vCard, UPI payment, calendar event, or crypto wallet — PixelQR supports 11 payload types.",
    icon: "1",
  },
  {
    title: "Pick a vibe",
    body: "Start from 30 polished templates or use the Surprise Me button to discover style combinations instantly.",
    icon: "2",
  },
  {
    title: "Customize & export",
    body: "Tweak colors, gradients, dot styles, frames, and logos. Export as PNG, SVG, or PDF. Your QR, your brand — zero signup needed.",
    icon: "3",
  },
];

const kindExamples: QRKind[] = ["url", "wifi", "vcard", "upi", "text", "whatsapp"];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const setOnboardingDone = useQRStore((s) => s.setOnboardingDone);
  const setFormValues = useQRStore((s) => s.setFormValues);
  const pushUndo = useQRStore((s) => s.pushUndo);
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const handleDone = () => {
    setVisible(false);
    setOnboardingDone();
  };

  const handleSkip = () => {
    setVisible(false);
    setOnboardingDone();
  };

  const stepData = steps[step];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 520,
            backgroundColor: colors.white,
            borderWidth: 4,
            borderColor: "#000",
            padding: isMobile ? 24 : 36,
            gap: 24,
            boxShadow: "12px 12px 0px 0px #000",
          }}
        >
          {/* Step indicator */}
          <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderWidth: 2,
                  borderColor: "#000",
                  backgroundColor: i === step ? colors.accent : colors.white,
                }}
              />
            ))}
          </View>

          {/* Step number badge */}
          <View
            style={{
              alignSelf: "center",
              width: 52,
              height: 52,
              borderWidth: 3,
              borderColor: "#000",
              backgroundColor: colors.accent,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 0px 0px #000",
            }}
          >
            <Text
              selectable
              style={{
                color: "#000",
                fontWeight: "900",
                fontSize: 24,
              }}
            >
              {stepData.icon}
            </Text>
          </View>

          <View style={{ gap: 8, alignItems: "center" }}>
            <Text
              selectable
              style={{
                color: "#000",
                fontWeight: "900",
                fontSize: isMobile ? 22 : 28,
                textAlign: "center",
                letterSpacing: -0.5,
              }}
            >
              {stepData.title}
            </Text>
            <Text
              selectable
              style={{
                color: "#000",
                fontWeight: "700",
                fontSize: 14,
                textAlign: "center",
                opacity: 0.7,
                lineHeight: 22,
              }}
            >
              {stepData.body}
            </Text>
          </View>

          {/* Quick template chips on last step */}
          {step === steps.length - 1 ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {kindExamples.map((kind) => (
                <Pressable
                  key={kind}
                  onPress={() => {
                    pushUndo();
                    setFormValues({ kind });
                  }}
                  style={({ pressed }) => ({
                    borderWidth: 2,
                    borderColor: "#000",
                    backgroundColor: colors.background,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: "#000",
                      fontWeight: "700",
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {kind}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Actions */}
          <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between" }}>
            <Pressable onPress={handleSkip} style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
              <Text
                selectable
                style={{
                  color: "#000",
                  fontWeight: "700",
                  fontSize: 11,
                  opacity: 0.5,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Skip
              </Text>
            </Pressable>

            {step < steps.length - 1 ? (
              <Button label="Next →" onPress={() => setStep(step + 1)} />
            ) : (
              <Button label="Start Creating!" onPress={handleDone} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
