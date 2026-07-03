import { Platform, Text, View, useWindowDimensions } from "react-native";
import { colors } from "@/constants/theme";
import { Button, SectionShell } from "@/components/ui";
import { scrollToSection } from "@/utils/scroll-to-section";
import { Star } from "lucide-react-native";

export function HeroSection() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isMobile = width < 640;

  return (
    <SectionShell
      id="top"
      style={{
        backgroundColor: colors.background,
        paddingTop: isMobile ? 48 : 72,
        paddingBottom: isMobile ? 64 : 96,
        position: "relative",
      }}
    >
      {/* Decorative background star */}
      <View
        style={{
          position: "absolute",
          top: isMobile ? 20 : 40,
          right: isMobile ? 20 : 60,
          opacity: 0.12,
        }}
      >
        <View
          style={{
            width: isMobile ? 60 : 120,
            height: isMobile ? 60 : 120,
            borderWidth: 4,
            borderColor: "#000",
            backgroundColor: colors.accent,
            transform: [{ rotate: "12deg" }],
          }}
        />
      </View>

      <View
        style={{
          flexDirection: isDesktop ? "row" : "column",
          gap: isDesktop ? 48 : 32,
          alignItems: isDesktop ? "flex-start" : "center",
          position: "relative",
        }}
      >
        {/* Left: Content */}
        <View
          style={{
            flex: isDesktop ? 1.3 : undefined,
            gap: 24,
            maxWidth: isDesktop ? 700 : undefined,
            alignItems: isDesktop ? "flex-start" : "center",
          }}
        >
          {/* Top badge */}
          <View
            style={{
              backgroundColor: colors.accent,
              borderWidth: 3,
              borderColor: "#000",
              paddingHorizontal: 12,
              paddingVertical: 5,
              boxShadow: "3px 3px 0px 0px #000",
              transform: [{ rotate: "-1deg" }],
            }}
          >
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              PROFESSIONAL QR STUDIO
            </Text>
          </View>

          {/* Headline with split color */}
          <View style={{ gap: 4 }}>
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontSize: isMobile ? 40 : isDesktop ? 72 : 56,
                lineHeight: isMobile ? 40 : isDesktop ? 68 : 56,
                fontWeight: "900",
                letterSpacing: -2,
              }}
            >
              {"Build "}
              <Text
                selectable
                style={{
                  color: colors.accent,
                  fontSize: isMobile ? 40 : isDesktop ? 72 : 56,
                  lineHeight: isMobile ? 40 : isDesktop ? 68 : 56,
                  fontWeight: "900",
                  letterSpacing: -2,
                }}
              >
                production-ready
              </Text>
              {"\nQR experiences."}
            </Text>
          </View>

          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: isMobile ? 16 : 18,
              lineHeight: isMobile ? 24 : 28,
              maxWidth: 600,
              opacity: 0.75,
              textAlign: isDesktop ? "left" : "center",
            }}
          >
            PixelQR gives your team a modern workspace for branded, scan-safe codes
            across campaigns, packaging, menu systems, payments, and product touchpoints.
          </Text>

          {/* Chips */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: isDesktop ? "flex-start" : "center",
            }}
          >
            {[
              "ISO-friendly contrast",
              "One-click exports",
              "Template-first workflow",
            ].map((chip) => (
              <View
                key={chip}
                style={{
                  borderWidth: 3,
                  borderColor: "#000",
                  backgroundColor: colors.white,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  boxShadow: "3px 3px 0px 0px #000",
                }}
              >
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "700",
                    fontSize: 10,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {chip}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: isDesktop ? "flex-start" : "center",
            }}
          >
            <Button
              label="Start Creating"
              onPress={() => scrollToSection("generator")}
              size={isMobile ? "md" : "lg"}
            />
            <Button
              label="View Templates"
              variant="outline"
              onPress={() => scrollToSection("templates")}
              size={isMobile ? "md" : "lg"}
            />
          </View>
        </View>

        {/* Right: Visual chaos zone (desktop only) */}
        {isDesktop && (
          <View
            style={{
              flex: 1,
              minHeight: 380,
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Large decorative number */}
            <Text
              selectable
              style={[
                {
                  fontSize: 180,
                  fontWeight: "900",
                  color: "transparent",
                  letterSpacing: -8,
                  lineHeight: 160,
                  position: "absolute",
                },
                Platform.OS === "web"
                  ? ({
                      WebkitTextStroke: "3px #000",
                      textStroke: "3px #000",
                    } as any)
                  : {},
                {
                  top: -10,
                  right: 10,
                  opacity: 0.25,
                },
              ]}
            >
              QR
            </Text>

            {/* Rotated sticker box */}
            <View
              style={{
                borderWidth: 4,
                borderColor: "#000",
                backgroundColor: colors.secondary,
                paddingVertical: 16,
                paddingHorizontal: 20,
                boxShadow: "8px 8px 0px 0px #000",
                transform: [{ rotate: "3deg" }],
                position: "absolute",
                top: 20,
                left: 0,
              }}
            >
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "900",
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Scan-safe ✅
              </Text>
            </View>

            {/* Another rotated sticker */}
            <View
              style={{
                borderWidth: 4,
                borderColor: "#000",
                backgroundColor: colors.muted,
                paddingVertical: 14,
                paddingHorizontal: 18,
                boxShadow: "8px 8px 0px 0px #000",
                transform: [{ rotate: "-4deg" }],
                position: "absolute",
                bottom: 20,
                right: 0,
              }}
            >
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "900",
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                PNG / SVG Export
              </Text>
            </View>

            {/* Center decorative star */}
            <View
              style={{
                position: "absolute",
                bottom: 100,
                left: 20,
              }}
            >
              <Star
                size={48}
                strokeWidth={3}
                color="#000"
                fill={colors.accent}
              />
            </View>
          </View>
        )}
      </View>
    </SectionShell>
  );
}
