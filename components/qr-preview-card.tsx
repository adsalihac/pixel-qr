import { Canvas, LinearGradient, RoundedRect, vec } from "@shopify/react-native-skia";
import { Platform, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors, shadows } from "@/constants/theme";
import { ExportActions } from "@/components/export-actions";
import { ScanSafetyScore } from "@/components/scan-safety-score";
import { useQRStore } from "@/store/qr-store";
import { TemplateVisualStyle } from "@/types/qr";
import { buildQrPayload } from "@/utils/qr-payload";
import { getScanSafety } from "@/utils/scan-safety";
import { getTemplateVisualStyle } from "@/utils/template-style";

export function QRPreviewCard({ compact = false }: { compact?: boolean }) {
  const formValues = useQRStore((state) => state.formValues);
  const customization = useQRStore((state) => state.customization);
  const selectedTemplate = useQRStore((state) => state.selectedTemplate);
  const payload = buildQrPayload(formValues);
  const safety = getScanSafety(customization);
  const templateStyle = getTemplateVisualStyle(selectedTemplate);
  const qrSize = Math.min(customization.size, compact ? 210 : 300);
  const bgColor = customization.transparentBackground ? "transparent" : customization.backgroundColor;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 24,
        padding: compact ? 16 : 22,
        gap: 18,
        boxShadow: shadows.soft,
        borderCurve: "continuous",
        overflow: "hidden"
      }}
    >
      <PreviewBackground />

      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: colors.text, fontSize: compact ? 16 : 20, fontWeight: "900" }}>
          Live preview
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: 13 }}>
          Export-ready, branded, and checked for reliable scanning.
        </Text>
      </View>

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

      {!compact ? (
        <>
          <ScanSafetyScore score={safety.score} warnings={safety.warnings} />
          <ExportActions payload={payload} foregroundColor={customization.foregroundColor} backgroundColor={customization.backgroundColor} title={formValues.title} subtitle={formValues.subtitle} templateId={selectedTemplate} />
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
  logoBackground
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
        borderRadius: frameStyle === "ticket" ? 28 : 18,
        borderWidth: frameStyle === "none" ? 0 : 1,
        borderColor: colors.border,
        alignItems: "center",
        gap: 10,
        boxShadow: shadows.subtle
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
        logoBorderRadius={12}
        quietZone={0}
        ecl="H"
      />
      {title ? (
        <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900", textAlign: "center" }}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text selectable style={{ color: colors.textMuted, fontSize: 13, textAlign: "center" }}>
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
  backgroundColor
}: {
  visualStyle: TemplateVisualStyle;
  payload: string;
  title: string;
  subtitle: string;
  foregroundColor: string;
  backgroundColor: string;
}) {
  const cardWidth = 330;
  const cardHeight = visualStyle === "menu-poster" || visualStyle === "campaign-poster" ? 430 : 390;
  const isPayment = visualStyle === "payment-standee";
  const isReview = visualStyle === "review-standee";

  if (visualStyle === "menu-poster" || visualStyle === "campaign-poster") {
    const posterBg = visualStyle === "menu-poster" ? "#f6b44d" : "#fff7ed";
    const posterText = visualStyle === "menu-poster" ? "#4a2700" : foregroundColor;
    return (
      <View style={{ alignSelf: "center", width: cardWidth, minHeight: cardHeight, backgroundColor: posterBg, borderRadius: 22, padding: 26, alignItems: "center", justifyContent: "space-between", boxShadow: shadows.panel, overflow: "hidden" }}>
        <View style={{ position: "absolute", top: -44, left: -36, width: 150, height: 150, borderRadius: 75, backgroundColor: "#ffffff", opacity: 0.9 }} />
        <View style={{ position: "absolute", top: 28, right: 28, width: 56, height: 56, borderRadius: 28, backgroundColor: posterText, alignItems: "center", justifyContent: "center" }}>
          <Text selectable style={{ color: "#ffffff", fontSize: 26, fontWeight: "900" }}>
            {visualStyle === "menu-poster" ? "M" : "P"}
          </Text>
        </View>
        <View style={{ position: "absolute", bottom: 24, left: 18, width: 52, height: 24, borderRadius: 999, backgroundColor: "#65a30d", transform: [{ rotate: "-24deg" }] }} />
        <View style={{ position: "absolute", top: 130, right: -12, width: 62, height: 28, borderRadius: 999, backgroundColor: "#84cc16", transform: [{ rotate: "-18deg" }] }} />
        <View style={{ marginTop: 92, alignItems: "center" }}>
          <Text selectable style={{ color: posterText, fontSize: 18, fontWeight: "900" }}>
            {visualStyle === "menu-poster" ? "DIGITAL" : "CAMPAIGN"}
          </Text>
          <Text selectable style={{ color: posterText, fontSize: 44, lineHeight: 50, fontWeight: "900", textAlign: "center" }}>
            {visualStyle === "menu-poster" ? "MENU" : title || "LAUNCH"}
          </Text>
        </View>
        <View style={{ backgroundColor: "#ffffff", padding: 16, borderRadius: 8 }}>
          <QRCode value={payload || "pixelqr.app"} size={175} color={posterText} backgroundColor="#ffffff" quietZone={0} ecl="H" />
        </View>
        <Text selectable style={{ color: posterText, fontSize: 13, fontWeight: "800", textAlign: "center" }}>
          {subtitle || "Scan to open"}
        </Text>
      </View>
    );
  }

  if (isPayment || isReview) {
    return (
      <View style={{ alignSelf: "center", width: cardWidth, minHeight: cardHeight, backgroundColor: "#f1f5f9", borderRadius: 22, alignItems: "center", justifyContent: "center", padding: 28, boxShadow: shadows.panel }}>
        <View style={{ width: 210, minHeight: 310, backgroundColor: "#ffffff", borderRadius: 10, borderWidth: isPayment ? 12 : 1, borderColor: isPayment ? "#0ea5e9" : colors.border, alignItems: "center", padding: 18, gap: 12, transform: [{ rotate: isPayment ? "-2deg" : "0deg" }] }}>
          {isReview ? (
            <>
              <View style={{ position: "absolute", left: -5, top: 0, bottom: 0, width: 5, backgroundColor: "#16a34a" }} />
              <View style={{ position: "absolute", right: -5, top: 0, bottom: 0, width: 5, backgroundColor: "#dc2626" }} />
            </>
          ) : null}
          <Text selectable style={{ color: colors.text, fontSize: 20, fontWeight: "900", textAlign: "center" }}>
            {isPayment ? "ALL-IN-ONE QR" : title || "Review us"}
          </Text>
          <Text selectable style={{ color: colors.textMuted, fontSize: 13, fontWeight: "800", textAlign: "center" }}>
            {isPayment ? "Pay using any UPI app" : "Review us on"}
          </Text>
          <Text selectable style={{ color: isPayment ? foregroundColor : "#4285f4", fontSize: isPayment ? 22 : 28, fontWeight: "900", textAlign: "center" }}>
            {isPayment ? "GPay  PhonePe" : "Google"}
          </Text>
          <QRCode value={payload || "pixelqr.app"} size={145} color={isPayment ? "#111827" : foregroundColor} backgroundColor="#ffffff" quietZone={0} ecl="H" />
          <Text selectable style={{ color: colors.textMuted, fontSize: 11, fontWeight: "800", textAlign: "center" }}>
            {subtitle || (isPayment ? "All accepted here" : "Scan for feedback")}
          </Text>
        </View>
        {isPayment ? <View style={{ width: 160, height: 18, borderRadius: 999, backgroundColor: "#94a3b8", marginTop: -4 }} /> : null}
      </View>
    );
  }

  return (
    <View style={{ alignSelf: "center", width: cardWidth, minHeight: cardHeight, backgroundColor, borderRadius: 22, padding: 26, justifyContent: "space-between", boxShadow: shadows.panel, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ minHeight: 76, borderRadius: 18, backgroundColor: foregroundColor, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 }}>
        <Text selectable style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", textAlign: "center" }}>
          {title || "PixelQR"}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.text, fontSize: 28, lineHeight: 32, fontWeight: "900", textAlign: "center" }}>
          {templateLabel(visualStyle)}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "center" }}>
          {subtitle || "Scan to open"}
        </Text>
      </View>
      <View style={{ alignSelf: "center", backgroundColor: "#ffffff", padding: 16, borderRadius: 16 }}>
        <QRCode value={payload || "pixelqr.app"} size={165} color={foregroundColor} backgroundColor="#ffffff" quietZone={0} ecl="H" />
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

function PreviewBackground() {
  if (Platform.OS === "web") {
    return (
      <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#ffffff" }}>
        <View style={{ position: "absolute", top: 0, right: 0, width: "78%", height: "70%", backgroundColor: "#f1f5ff" }} />
        <View style={{ position: "absolute", bottom: 0, left: 0, width: "70%", height: "56%", backgroundColor: "#f8fafc" }} />
      </View>
    );
  }

  return (
    <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
      <Canvas style={{ flex: 1 }}>
        <RoundedRect x={0} y={0} width={900} height={700} r={24}>
          <LinearGradient start={vec(0, 0)} end={vec(900, 700)} colors={["#ffffff", "#f1f5ff", "#f8fafc"]} />
        </RoundedRect>
      </Canvas>
    </View>
  );
}
