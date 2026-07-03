import { Platform, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "@/constants/theme";
import { ExportActions } from "@/components/export-actions";
import { ScanSafetyScore } from "@/components/scan-safety-score";
import { useQRStore } from "@/store/qr-store";
import { TemplateVisualStyle } from "@/types/qr";
import { buildQrPayload } from "@/utils/qr-payload";
import { getScanSafety } from "@/utils/scan-safety";
import { getTemplateVisualStyle } from "@/utils/template-style";
import { downloadPng } from "@/utils/export-qr";
import { useRef, useCallback } from "react";

export function QRPreviewCard({ compact = false }: { compact?: boolean }) {
  const formValues = useQRStore((state) => state.formValues);
  const customization = useQRStore((state) => state.customization);
  const selectedTemplate = useQRStore((state) => state.selectedTemplate);
  const payload = buildQrPayload(formValues);
  const safety = getScanSafety(customization);
  const templateStyle = getTemplateVisualStyle(selectedTemplate);
  const qrSize = Math.min(customization.size, compact ? 210 : 280);
  const bgColor = customization.transparentBackground
    ? "transparent"
    : customization.backgroundColor;
  const previewRef = useRef<any>(null);

  const handleDownloadPng = useCallback(async () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      try {
        const { toPng } = await import("html-to-image");
        if (previewRef.current) {
          const dataUrl = await toPng(previewRef.current, {
            quality: 1,
            pixelRatio: 2,
          });
          const anchor = document.createElement("a");
          anchor.href = dataUrl;
          anchor.download = "pixelqr.png";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          return;
        }
      } catch {
        // fallback to plain QR
      }
    }
    await downloadPng(payload, customization.foregroundColor, customization.backgroundColor);
  }, [payload, customization.foregroundColor, customization.backgroundColor]);

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderWidth: 4,
        borderColor: "#000",
        padding: compact ? 16 : 22,
        gap: 18,
        boxShadow: "10px 10px 0px 0px #000",
      }}
    >
      <View style={{ gap: 4 }}>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: compact ? 16 : 20,
            textTransform: "uppercase",
            letterSpacing: -0.5,
          }}
        >
          Live Preview
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
          Export-ready, branded, and checked for reliable scanning.
        </Text>
      </View>

      <View ref={previewRef} style={{ alignSelf: "center" }}>
        {templateStyle && !compact ? (
          <StyledTemplatePreview
            visualStyle={templateStyle}
            payload={payload}
            title={formValues.title}
            subtitle={formValues.subtitle}
            foregroundColor={customization.foregroundColor}
            backgroundColor={customization.backgroundColor}
          />
        ) : (
          <PlainQrPreview
            payload={payload}
            title={formValues.title}
            subtitle={formValues.subtitle}
            qrSize={qrSize}
            bgColor={bgColor}
            foregroundColor={customization.foregroundColor}
            backgroundColor={customization.backgroundColor}
            frameStyle={customization.frameStyle}
            padding={customization.padding}
            logoUri={customization.logoUri}
            logoSize={customization.logoSize}
            logoBackground={customization.logoBackground}
          />
        )}
      </View>

      {!compact ? (
        <>
          <ScanSafetyScore score={safety.score} warnings={safety.warnings} />
          <ExportActions
            payload={payload}
            foregroundColor={customization.foregroundColor}
            backgroundColor={customization.backgroundColor}
            title={formValues.title}
            subtitle={formValues.subtitle}
            templateId={selectedTemplate}
            onDownloadPng={handleDownloadPng}
          />
        </>
      ) : null}
    </View>
  );
}

function PlainQrPreview({
  payload,
  title,
  subtitle,
  qrSize,
  bgColor,
  foregroundColor,
  backgroundColor,
  frameStyle,
  padding,
  logoUri,
  logoSize,
  logoBackground,
}: {
  payload: string;
  title: string;
  subtitle: string;
  qrSize: number;
  bgColor: string;
  foregroundColor: string;
  backgroundColor: string;
  frameStyle: string;
  padding: number;
  logoUri?: string;
  logoSize: number;
  logoBackground: boolean;
}) {
  return (
    <View
      style={{
        alignSelf: "center",
        backgroundColor: bgColor,
        padding: Math.max(8, padding),
        borderWidth: frameStyle === "none" ? 0 : 4,
        borderColor: "#000",
        alignItems: "center",
        gap: 10,
        boxShadow: frameStyle === "none" ? undefined : "6px 6px 0px 0px #000",
      }}
    >
      <QRCode
        value={payload || "pixelqr.app"}
        size={qrSize}
        color={foregroundColor}
        backgroundColor={backgroundColor}
        logo={logoUri ? { uri: logoUri } : undefined}
        logoSize={logoUri ? Math.round((qrSize * logoSize) / 100) : 0}
        logoBackgroundColor={logoBackground ? backgroundColor : "transparent"}
        logoBorderRadius={0}
        quietZone={0}
        ecl="H"
      />
      {title ? (
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 18,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 13,
            textAlign: "center",
            opacity: 0.65,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function StyledTemplatePreview({
  visualStyle,
  payload,
  title,
  subtitle,
  foregroundColor,
  backgroundColor,
}: {
  visualStyle: TemplateVisualStyle;
  payload: string;
  title: string;
  subtitle: string;
  foregroundColor: string;
  backgroundColor: string;
}) {
  const cardWidth = 320;
  const cardHeight =
    visualStyle === "menu-poster" || visualStyle === "campaign-poster" ? 420 : 380;
  const isPayment = visualStyle === "payment-standee";
  const isReview = visualStyle === "review-standee";

  if (visualStyle === "menu-poster" || visualStyle === "campaign-poster") {
    const posterBg = visualStyle === "menu-poster" ? "#f6b44d" : "#fff7ed";
    const posterText = visualStyle === "menu-poster" ? "#4a2700" : foregroundColor;
    return (
      <View
        style={{
          alignSelf: "center",
          width: cardWidth,
          minHeight: cardHeight,
          backgroundColor: posterBg,
          borderWidth: 4,
          borderColor: "#000",
          padding: 26,
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "8px 8px 0px 0px #000",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -44,
            left: -36,
            width: 150,
            height: 150,
            borderRadius: 999,
            backgroundColor: "#ffffff",
            opacity: 0.9,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 56,
            height: 56,
            borderRadius: 999,
            backgroundColor: posterText,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            selectable
            style={{ color: "#ffffff", fontWeight: "900", fontSize: 26 }}
          >
            {visualStyle === "menu-poster" ? "M" : "P"}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 18,
            width: 52,
            height: 24,
            borderRadius: 999,
            backgroundColor: "#65a30d",
            transform: [{ rotate: "-24deg" }],
          }}
        />
        <View style={{ marginTop: 92, alignItems: "center" }}>
          <Text
            selectable
            style={{
              color: posterText,
              fontWeight: "900",
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            {visualStyle === "menu-poster" ? "DIGITAL" : "CAMPAIGN"}
          </Text>
          <Text
            selectable
            style={{
              color: posterText,
              fontSize: 44,
              lineHeight: 50,
              fontWeight: "900",
              textAlign: "center",
            }}
          >
            {visualStyle === "menu-poster" ? "MENU" : title || "LAUNCH"}
          </Text>
        </View>
        <View style={{ backgroundColor: "#ffffff", padding: 16 }}>
          <QRCode
            value={payload || "pixelqr.app"}
            size={160}
            color={posterText}
            backgroundColor="#ffffff"
            quietZone={0}
            ecl="H"
          />
        </View>
        <Text
          selectable
          style={{
            color: posterText,
            fontWeight: "800",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {subtitle || "Scan to open"}
        </Text>
      </View>
    );
  }

  if (isPayment || isReview) {
    return (
      <View
        style={{
          alignSelf: "center",
          width: cardWidth,
          minHeight: cardHeight,
          backgroundColor: "#f1f5f9",
          borderWidth: 4,
          borderColor: "#000",
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
          boxShadow: "8px 8px 0px 0px #000",
        }}
      >
        <View
          style={{
            width: 210,
            minHeight: 290,
            backgroundColor: "#ffffff",
            borderWidth: isPayment ? 12 : 4,
            borderColor: isPayment ? "#0ea5e9" : "#000",
            alignItems: "center",
            padding: 18,
            gap: 12,
            transform: [{ rotate: isPayment ? "-2deg" : "0deg" }],
            boxShadow: "4px 4px 0px 0px #000",
          }}
        >
          {isReview ? (
            <>
              <View
                style={{
                  position: "absolute",
                  left: -5,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  backgroundColor: "#16a34a",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  right: -5,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  backgroundColor: "#dc2626",
                }}
              />
            </>
          ) : null}
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 18,
              textAlign: "center",
            }}
          >
            {isPayment ? "ALL-IN-ONE QR" : title || "Review us"}
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 12,
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            {isPayment ? "Pay using any UPI app" : "Review us on"}
          </Text>
          <Text
            selectable
            style={{
              color: isPayment ? foregroundColor : "#4285f4",
              fontWeight: "900",
              fontSize: isPayment ? 20 : 26,
              textAlign: "center",
            }}
          >
            {isPayment ? "GPay  PhonePe" : "Google"}
          </Text>
          <QRCode
            value={payload || "pixelqr.app"}
            size={130}
            color={isPayment ? "#111827" : foregroundColor}
            backgroundColor="#ffffff"
            quietZone={0}
            ecl="H"
          />
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 10,
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            {subtitle ||
              (isPayment ? "All accepted here" : "Scan for feedback")}
          </Text>
        </View>
        {isPayment ? (
          <View
            style={{
              width: 160,
              height: 18,
              borderRadius: 999,
              backgroundColor: "#94a3b8",
              marginTop: -4,
            }}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        alignSelf: "center",
        width: cardWidth,
        minHeight: cardHeight,
        backgroundColor,
        borderWidth: 4,
        borderColor: "#000",
        padding: 26,
        justifyContent: "space-between",
        boxShadow: "8px 8px 0px 0px #000",
      }}
    >
      <View
        style={{
          minHeight: 68,
          backgroundColor: foregroundColor,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 14,
        }}
      >
        <Text
          selectable
          style={{
            color: "#ffffff",
            fontWeight: "900",
            fontSize: 22,
            textAlign: "center",
          }}
        >
          {title || "PixelQR"}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 26,
            lineHeight: 30,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {templateLabel(visualStyle)}
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 13,
            textAlign: "center",
            opacity: 0.6,
          }}
        >
          {subtitle || "Scan to open"}
        </Text>
      </View>
      <View style={{ alignSelf: "center", backgroundColor: "#ffffff", padding: 14 }}>
        <QRCode
          value={payload || "pixelqr.app"}
          size={150}
          color={foregroundColor}
          backgroundColor="#ffffff"
          quietZone={0}
          ecl="H"
        />
      </View>
    </View>
  );
}

function templateLabel(visualStyle: TemplateVisualStyle) {
  switch (visualStyle) {
    case "wifi-card":
      return "Guest Wi-Fi";
    case "map-card":
      return "Open in Maps";
    case "coupon-ticket":
      return "Save 20%";
    case "event-pass":
      return "Event Pass";
    case "brand-header":
      return "Brand Card";
    case "product-label":
      return "Product Info";
    case "chat-card":
      return "Chat Now";
    case "call-card":
      return "Call Now";
    case "email-card":
      return "Email Us";
    case "app-card":
      return "Download App";
    case "social-card":
      return "Follow Us";
    default:
      return "Scan QR";
  }
}
