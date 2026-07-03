import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors, shadows } from "@/constants/theme";
import { useQRStore } from "@/store/qr-store";
import { TemplateId, TemplateVisualStyle } from "@/types/qr";
import { scrollToSection } from "@/utils/scroll-to-section";

export function TemplateCard({
  id,
  title,
  subtitle,
  category,
  accent,
  surface,
  payload,
  format,
  bestFor,
  fields,
  visualStyle
}: {
  id: TemplateId;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  surface: string;
  payload: string;
  format: string;
  bestFor: string;
  fields: readonly string[];
  visualStyle: TemplateVisualStyle;
}) {
  const applyTemplate = useQRStore((state) => state.applyTemplate);
  const selectedTemplate = useQRStore((state) => state.selectedTemplate);
  const isSelected = selectedTemplate === id;

  const handleApply = () => {
    applyTemplate(id);
    scrollToSection("generator");
  };

  return (
    <Pressable
      onPress={handleApply}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 286,
        backgroundColor: colors.surface,
        borderWidth: 1.25,
        borderColor: isSelected ? accent : colors.border,
        borderRadius: 18,
        padding: 0,
        overflow: "hidden",
        boxShadow: isSelected ? shadows.panel : shadows.subtle,
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: pressed ? 1 : 0 }]
      })}
    >
      <View style={{ height: 6, backgroundColor: accent }} />
      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ gap: 9 }}>
          <DesignedTemplatePreview visualStyle={visualStyle} title={title} category={category} payload={payload} accent={accent} surface={surface} isSelected={isSelected} />
          {isSelected ? (
            <Text selectable style={{ alignSelf: "flex-end", color: accent, fontSize: 12, fontWeight: "900" }}>
              Applied
            </Text>
          ) : null}
        </View>

        <View style={{ gap: 6 }}>
          <Text selectable style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>
            {title}
          </Text>
          <Text selectable style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>
            {subtitle}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <View style={{ gap: 3 }}>
            <Text selectable style={{ color: colors.text, fontSize: 12, fontWeight: "900" }}>
              {format}
            </Text>
              <Text selectable style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18 }}>
              {bestFor}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
            {fields.map((field) => (
              <View key={field} style={{ borderRadius: 999, backgroundColor: surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 9, minHeight: 26, justifyContent: "center" }}>
                <Text selectable style={{ color: accent, fontSize: 11, fontWeight: "800" }}>
                  {field}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <Text selectable style={{ color: colors.textMuted, fontSize: 12, fontWeight: "800" }}>
            Scan-safe preset
          </Text>
          <Text selectable style={{ color: accent, fontSize: 13, fontWeight: "900" }}>
            Apply style
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function DesignedTemplatePreview({
  visualStyle,
  title,
  category,
  payload,
  accent,
  surface,
  isSelected
}: {
  visualStyle: TemplateVisualStyle;
  title: string;
  category: string;
  payload: string;
  accent: string;
  surface: string;
  isSelected: boolean;
}) {
  const isPoster = visualStyle === "menu-poster" || visualStyle === "campaign-poster";
  const isStandee = visualStyle === "payment-standee" || visualStyle === "review-standee";
  const qrSize = isPoster ? 74 : isStandee ? 70 : 58;

  return (
    <View
      style={{
        minHeight: 178,
        borderRadius: 14,
        backgroundColor: surface,
        borderWidth: 1,
        borderColor: isSelected ? accent : colors.border,
        overflow: "hidden"
      }}
    >
      {visualStyle === "menu-poster" ? (
        <PosterPreview title="DIGITAL MENU" label="Menu" payload={payload} accent="#4a2700" surface="#f6b44d" qrSize={qrSize} />
      ) : visualStyle === "review-standee" ? (
        <ReviewPreview payload={payload} accent={accent} />
      ) : visualStyle === "payment-standee" ? (
        <PaymentPreview payload={payload} accent={accent} />
      ) : visualStyle === "map-card" ? (
        <MapPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "wifi-card" ? (
        <WifiPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "brand-header" ? (
        <BrandHeaderPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "coupon-ticket" ? (
        <CouponPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "event-pass" ? (
        <EventPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "campaign-poster" ? (
        <PosterPreview title="SUMMER LAUNCH" label="Campaign" payload={payload} accent={accent} surface="#fff7ed" qrSize={qrSize} />
      ) : (
        <CardPreview title={title} category={category} payload={payload} accent={accent} surface={surface} visualStyle={visualStyle} />
      )}
    </View>
  );
}

function PosterPreview({ title, label, payload, accent, surface, qrSize }: { title: string; label: string; payload: string; accent: string; surface: string; qrSize: number }) {
  return (
    <View style={{ flex: 1, minHeight: 178, backgroundColor: surface, padding: 14, alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ position: "absolute", top: -30, left: -18, width: 88, height: 88, borderRadius: 44, backgroundColor: "#ffffff", opacity: 0.9 }} />
      <View style={{ position: "absolute", top: 18, right: 18, width: 42, height: 42, borderRadius: 21, backgroundColor: accent, alignItems: "center", justifyContent: "center" }}>
        <Text selectable style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>
          {label.slice(0, 1)}
        </Text>
      </View>
      <View style={{ position: "absolute", bottom: 15, left: 12, width: 30, height: 15, borderRadius: 999, backgroundColor: "#65a30d", transform: [{ rotate: "-24deg" }] }} />
      <View style={{ position: "absolute", top: 62, right: 4, width: 34, height: 16, borderRadius: 999, backgroundColor: "#84cc16", transform: [{ rotate: "-18deg" }] }} />
      <View style={{ marginTop: 44, alignItems: "center" }}>
        <Text selectable style={{ color: accent, fontSize: 12, fontWeight: "900" }}>
          {label.toUpperCase()}
        </Text>
        <Text selectable style={{ color: accent, fontSize: 28, lineHeight: 32, fontWeight: "900", textAlign: "center" }}>
          {title}
        </Text>
      </View>
      <View style={{ backgroundColor: "#ffffff", padding: 9, borderRadius: 4 }}>
        <QRCode value={payload} size={qrSize} color={accent} backgroundColor="#ffffff" quietZone={0} />
      </View>
    </View>
  );
}

function ReviewPreview({ payload, accent }: { payload: string; accent: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center", padding: 14 }}>
      <View style={{ width: 116, minHeight: 150, backgroundColor: "#ffffff", borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center", padding: 10, gap: 8 }}>
        <View style={{ position: "absolute", left: -4, top: 0, bottom: 0, width: 4, backgroundColor: "#16a34a" }} />
        <View style={{ position: "absolute", right: -4, top: 0, bottom: 0, width: 4, backgroundColor: "#dc2626" }} />
        <Text selectable style={{ color: colors.text, fontSize: 12, fontWeight: "900" }}>
          LUCENT
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: 8, fontWeight: "800" }}>
          Review us on
        </Text>
        <Text selectable style={{ color: "#4285f4", fontSize: 15, fontWeight: "900" }}>
          Google
        </Text>
        <QRCode value={payload} size={66} color={accent} backgroundColor="#ffffff" quietZone={0} />
        <Text selectable style={{ color: colors.textMuted, fontSize: 7, fontWeight: "800" }}>
          Scan for feedback
        </Text>
      </View>
    </View>
  );
}

function PaymentPreview({ payload, accent }: { payload: string; accent: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", padding: 14 }}>
      <View style={{ width: 118, minHeight: 152, backgroundColor: "#ffffff", borderRadius: 5, borderWidth: 7, borderColor: "#0ea5e9", alignItems: "center", padding: 8, gap: 7, transform: [{ rotate: "-2deg" }] }}>
        <View style={{ backgroundColor: "#e0f2fe", borderRadius: 999, paddingHorizontal: 7, minHeight: 17, justifyContent: "center" }}>
          <Text selectable style={{ color: "#0369a1", fontSize: 8, fontWeight: "900" }}>
            ALL-IN-ONE QR
          </Text>
        </View>
        <Text selectable style={{ color: colors.text, fontSize: 9, fontWeight: "800" }}>
          Pay using any UPI app
        </Text>
        <Text selectable style={{ color: accent, fontSize: 16, fontWeight: "900" }}>
          GPay  PhonePe
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: 10, fontWeight: "900" }}>
          ALL ACCEPTED HERE
        </Text>
        <QRCode value={payload} size={68} color="#111827" backgroundColor="#ffffff" quietZone={0} />
      </View>
      <View style={{ width: 84, height: 10, borderRadius: 999, backgroundColor: "#94a3b8", marginTop: -4 }} />
    </View>
  );
}

function MapPreview({ payload, accent, surface }: { payload: string; accent: string; surface: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, justifyContent: "space-between" }}>
      <View style={{ position: "absolute", top: 28, left: 0, right: 0, height: 2, backgroundColor: "#bbf7d0" }} />
      <View style={{ position: "absolute", top: 78, left: 0, right: 0, height: 2, backgroundColor: "#bbf7d0" }} />
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 68, width: 2, backgroundColor: "#bbf7d0" }} />
      <View style={{ position: "absolute", top: 0, bottom: 0, right: 48, width: 2, backgroundColor: "#bbf7d0" }} />
      <Text selectable style={{ color: accent, fontSize: 14, fontWeight: "900" }}>
        Open in Maps
      </Text>
      <View style={{ alignSelf: "center", width: 42, height: 42, borderRadius: 21, backgroundColor: accent, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#ffffff" }} />
      </View>
      <View style={{ alignSelf: "flex-end", backgroundColor: "#ffffff", padding: 7, borderRadius: 8 }}>
        <QRCode value={payload} size={58} color={accent} backgroundColor="#ffffff" quietZone={0} />
      </View>
    </View>
  );
}

function WifiPreview({ payload, accent, surface }: { payload: string; accent: string; surface: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, alignItems: "center", justifyContent: "space-between" }}>
      <Text selectable style={{ color: accent, fontSize: 17, fontWeight: "900" }}>
        Guest Wi-Fi
      </Text>
      <View style={{ width: 78, height: 78, borderRadius: 39, borderWidth: 10, borderColor: accent, borderLeftColor: "transparent", borderRightColor: "transparent", transform: [{ rotate: "45deg" }], opacity: 0.18 }} />
      <View style={{ backgroundColor: "#ffffff", padding: 8, borderRadius: 12, marginTop: -52 }}>
        <QRCode value={payload} size={64} color={accent} backgroundColor="#ffffff" quietZone={0} />
      </View>
      <Text selectable style={{ color: colors.textMuted, fontSize: 10, fontWeight: "800" }}>
        Scan to connect instantly
      </Text>
    </View>
  );
}

function BrandHeaderPreview({ payload, accent, surface }: { payload: string; accent: string; surface: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, justifyContent: "space-between" }}>
      <View style={{ backgroundColor: accent, borderRadius: 12, minHeight: 46, alignItems: "center", justifyContent: "center" }}>
        <Text selectable style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>
          PIXELQR
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <View style={{ flex: 1, gap: 5 }}>
          <Text selectable style={{ color: colors.text, fontSize: 18, lineHeight: 21, fontWeight: "900" }}>
            Brand Card
          </Text>
          <Text selectable style={{ color: colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: "800" }}>
            Logo header with a clean scan zone.
          </Text>
        </View>
        <View style={{ backgroundColor: "#ffffff", padding: 7, borderRadius: 10 }}>
          <QRCode value={payload} size={62} color={accent} backgroundColor="#ffffff" quietZone={0} />
        </View>
      </View>
    </View>
  );
}

function CouponPreview({ payload, accent, surface }: { payload: string; accent: string; surface: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "92%", minHeight: 126, borderRadius: 14, borderWidth: 1, borderStyle: "dashed", borderColor: accent, backgroundColor: "#ffffff", padding: 12, alignItems: "center", gap: 8 }}>
        <Text selectable style={{ color: accent, fontSize: 12, fontWeight: "900" }}>
          LIMITED OFFER
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: 24, fontWeight: "900" }}>
          SAVE 20%
        </Text>
        <QRCode value={payload} size={54} color={accent} backgroundColor="#ffffff" quietZone={0} />
      </View>
    </View>
  );
}

function EventPreview({ payload, accent, surface }: { payload: string; accent: string; surface: string }) {
  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text selectable style={{ color: accent, fontSize: 12, fontWeight: "900" }}>
          EVENT PASS
        </Text>
        <View style={{ width: 38, height: 22, borderRadius: 999, backgroundColor: accent }} />
      </View>
      <Text selectable style={{ color: colors.text, fontSize: 20, lineHeight: 23, fontWeight: "900" }}>
        Creator Summit
      </Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        <View style={{ gap: 5 }}>
          <Text selectable style={{ color: colors.textMuted, fontSize: 10, fontWeight: "800" }}>
            RSVP • MAP • AGENDA
          </Text>
          <Text selectable style={{ color: accent, fontSize: 13, fontWeight: "900" }}>
            Scan ticket
          </Text>
        </View>
        <QRCode value={payload} size={58} color={accent} backgroundColor={surface} quietZone={0} />
      </View>
    </View>
  );
}

function CardPreview({
  title,
  category,
  payload,
  accent,
  surface,
  visualStyle
}: {
  title: string;
  category: string;
  payload: string;
  accent: string;
  surface: string;
  visualStyle: TemplateVisualStyle;
}) {
  const label =
    visualStyle === "social-card"
      ? "@pixelqr"
      : visualStyle === "chat-card"
        ? "Chat now"
        : visualStyle === "app-card"
          ? "Download"
          : visualStyle === "email-card"
            ? "Email us"
            : visualStyle === "call-card"
              ? "Call now"
              : visualStyle === "product-label"
                ? "Product info"
                : category;

  return (
    <View style={{ minHeight: 178, backgroundColor: surface, padding: 14, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: accent, alignItems: "center", justifyContent: "center" }}>
          <Text selectable style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>
            {label.slice(0, 1)}
          </Text>
        </View>
        <Text selectable style={{ color: accent, fontSize: 11, fontWeight: "900" }}>
          {category}
        </Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: colors.text, fontSize: 19, lineHeight: 22, fontWeight: "900" }}>
          {title}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: 11, lineHeight: 15, fontWeight: "800" }}>
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <View style={{ flex: 1, height: 38, borderRadius: 10, backgroundColor: "#ffffff", borderWidth: 1, borderColor: colors.border, justifyContent: "center", paddingHorizontal: 10 }}>
          <Text selectable style={{ color: accent, fontSize: 10, fontWeight: "900" }}>
            Scan-safe style
          </Text>
        </View>
        <View style={{ backgroundColor: "#ffffff", padding: 7, borderRadius: 10 }}>
          <QRCode value={payload} size={54} color={accent} backgroundColor="#ffffff" quietZone={0} />
        </View>
      </View>
    </View>
  );
}
