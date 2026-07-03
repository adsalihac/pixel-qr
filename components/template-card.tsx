import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "@/constants/theme";
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
  fields = [],
  visualStyle,
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
  fields?: readonly string[];
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
        width: 286,
        backgroundColor: colors.white,
        borderWidth: 4,
        borderColor: "#000",
        boxShadow: isSelected
          ? "8px 8px 0px 0px #000"
          : "6px 6px 0px 0px #000",
        transform: pressed
          ? [{ translateX: 2 }, { translateY: 2 }]
          : [{ translateX: 0 }, { translateY: 0 }],
        transitionDuration: "150ms",
        transitionProperty: "transform, box-shadow",
      })}
    >
      <View style={{ height: 8, backgroundColor: accent }} />
      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ gap: 9 }}>
          <DesignedTemplatePreview
            visualStyle={visualStyle}
            title={title}
            category={category}
            payload={payload}
            accent={accent}
            surface={surface}
            isSelected={isSelected}
          />
          {isSelected ? (
            <View
              style={{
                alignSelf: "flex-end",
                backgroundColor: colors.muted,
                borderWidth: 3,
                borderColor: "#000",
                paddingHorizontal: 8,
                paddingVertical: 3,
                boxShadow: "2px 2px 0px 0px #000",
              }}
            >
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "900",
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Applied
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ gap: 6 }}>
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
            {title}
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
            {subtitle}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <View style={{ gap: 3 }}>
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {format}
            </Text>
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "700",
                fontSize: 11,
                opacity: 0.6,
              }}
            >
              {bestFor}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {fields.map((field) => (
              <View
                key={field}
                style={{
                  borderWidth: 3,
                  borderColor: "#000",
                  backgroundColor: surface,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  boxShadow: "2px 2px 0px 0px #000",
                }}
              >
                <Text
                  selectable
                  style={{
                    color: accent,
                    fontWeight: "700",
                    fontSize: 10,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {field}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            borderTopWidth: 3,
            borderTopColor: "#000",
            paddingTop: 10,
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
              opacity: 0.5,
            }}
          >
            Scan-safe preset
          </Text>
          <Text
            selectable
            style={{
              color: accent,
              fontWeight: "900",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Apply style →
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
  isSelected,
}: {
  visualStyle: TemplateVisualStyle;
  title: string;
  category: string;
  payload: string;
  accent: string;
  surface: string;
  isSelected: boolean;
}) {
  const isPoster =
    visualStyle === "menu-poster" || visualStyle === "campaign-poster";
  const isStandee =
    visualStyle === "payment-standee" || visualStyle === "review-standee";
  const qrSize = isPoster ? 68 : isStandee ? 64 : 52;

  return (
    <View
      style={{
        minHeight: 170,
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: surface,
        overflow: "hidden",
      }}
    >
      {visualStyle === "menu-poster" ? (
        <PosterPreview
          title="DIGITAL MENU"
          label="Menu"
          payload={payload}
          accent="#4a2700"
          surface="#f6b44d"
          qrSize={qrSize}
        />
      ) : visualStyle === "review-standee" ? (
        <ReviewPreview payload={payload} accent={accent} />
      ) : visualStyle === "payment-standee" ? (
        <PaymentPreview payload={payload} accent={accent} />
      ) : visualStyle === "map-card" ? (
        <MapPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "wifi-card" ? (
        <WifiPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "brand-header" ? (
        <BrandHeaderPreview
          payload={payload}
          accent={accent}
          surface={surface}
        />
      ) : visualStyle === "coupon-ticket" ? (
        <CouponPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "event-pass" ? (
        <EventPreview payload={payload} accent={accent} surface={surface} />
      ) : visualStyle === "campaign-poster" ? (
        <PosterPreview
          title="SUMMER LAUNCH"
          label="Campaign"
          payload={payload}
          accent={accent}
          surface="#fff7ed"
          qrSize={qrSize}
        />
      ) : (
        <CardPreview
          title={title}
          category={category}
          payload={payload}
          accent={accent}
          surface={surface}
          visualStyle={visualStyle}
        />
      )}
    </View>
  );
}

function PosterPreview({
  title,
  label,
  payload,
  accent,
  surface,
  qrSize,
}: {
  title: string;
  label: string;
  payload: string;
  accent: string;
  surface: string;
  qrSize: number;
}) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: -30,
          left: -18,
          width: 88,
          height: 88,
          borderRadius: 999,
          backgroundColor: "#ffffff",
          opacity: 0.9,
          borderWidth: 2,
          borderColor: "#000",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 42,
          height: 42,
          borderRadius: 999,
          backgroundColor: accent,
          borderWidth: 2,
          borderColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          selectable
          style={{ color: "#ffffff", fontWeight: "900", fontSize: 18 }}
        >
          {label.slice(0, 1)}
        </Text>
      </View>
      <View style={{ marginTop: 44, alignItems: "center" }}>
        <Text
          selectable
          style={{
            color: accent,
            fontWeight: "900",
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          {label.toUpperCase()}
        </Text>
        <Text
          selectable
          style={{
            color: accent,
            fontSize: 26,
            lineHeight: 30,
            fontWeight: "900",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>
      <View style={{ backgroundColor: "#ffffff", padding: 8 }}>
        <QRCode
          value={payload}
          size={qrSize}
          color={accent}
          backgroundColor="#ffffff"
          quietZone={0}
        />
      </View>
    </View>
  );
}

function ReviewPreview({
  payload,
  accent,
}: {
  payload: string;
  accent: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: "#f8fafc",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
      }}
    >
      <View
        style={{
          width: 116,
          minHeight: 140,
          backgroundColor: "#ffffff",
          borderWidth: 3,
          borderColor: "#000",
          alignItems: "center",
          padding: 10,
          gap: 8,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: -4,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "#16a34a",
          }}
        />
        <View
          style={{
            position: "absolute",
            right: -4,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "#dc2626",
          }}
        />
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 11,
            letterSpacing: 1,
          }}
        >
          LUCENT
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 8,
            opacity: 0.6,
          }}
        >
          Review us on
        </Text>
        <Text
          selectable
          style={{
            color: "#4285f4",
            fontWeight: "900",
            fontSize: 14,
          }}
        >
          Google
        </Text>
        <QRCode
          value={payload}
          size={60}
          color={accent}
          backgroundColor="#ffffff"
          quietZone={0}
        />
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 7,
            opacity: 0.6,
          }}
        >
          Scan for feedback
        </Text>
      </View>
    </View>
  );
}

function PaymentPreview({
  payload,
  accent,
}: {
  payload: string;
  accent: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: "#f1f5f9",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
      }}
    >
      <View
        style={{
          width: 118,
          minHeight: 140,
          backgroundColor: "#ffffff",
          borderWidth: 6,
          borderColor: "#0ea5e9",
          alignItems: "center",
          padding: 8,
          gap: 7,
          transform: [{ rotate: "-2deg" }],
          boxShadow: "3px 3px 0px 0px #000",
        }}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "#000",
            paddingHorizontal: 6,
            paddingVertical: 2,
            backgroundColor: "#e0f2fe",
          }}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 7,
              letterSpacing: 1,
            }}
          >
            ALL-IN-ONE QR
          </Text>
        </View>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "800",
            fontSize: 8,
          }}
        >
          Pay using any UPI app
        </Text>
        <Text
          selectable
          style={{
            color: accent,
            fontWeight: "900",
            fontSize: 14,
          }}
        >
          GPay  PhonePe
        </Text>
        <QRCode
          value={payload}
          size={62}
          color="#111827"
          backgroundColor="#ffffff"
          quietZone={0}
        />
      </View>
      <View
        style={{
          width: 84,
          height: 10,
          borderRadius: 999,
          backgroundColor: "#94a3b8",
          marginTop: -4,
        }}
      />
    </View>
  );
}

function MapPreview({
  payload,
  accent,
  surface,
}: {
  payload: string;
  accent: string;
  surface: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "#bbf7d0",
        }}
      />
      <Text
        selectable
        style={{
          color: accent,
          fontWeight: "900",
          fontSize: 13,
          letterSpacing: 1,
        }}
      >
        Open in Maps
      </Text>
      <View
        style={{
          alignSelf: "center",
          width: 40,
          height: 40,
          borderRadius: 999,
          backgroundColor: accent,
          borderWidth: 2,
          borderColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#ffffff",
          }}
        />
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          backgroundColor: "#ffffff",
          padding: 6,
          borderWidth: 2,
          borderColor: "#000",
        }}
      >
        <QRCode
          value={payload}
          size={52}
          color={accent}
          backgroundColor="#ffffff"
          quietZone={0}
        />
      </View>
    </View>
  );
}

function WifiPreview({
  payload,
  accent,
  surface,
}: {
  payload: string;
  accent: string;
  surface: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        selectable
        style={{
          color: accent,
          fontWeight: "900",
          fontSize: 16,
          letterSpacing: -0.3,
        }}
      >
        Guest Wi-Fi
      </Text>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          borderWidth: 8,
          borderColor: accent,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          transform: [{ rotate: "45deg" }],
          opacity: 0.18,
        }}
      />
      <View
        style={{
          backgroundColor: "#ffffff",
          padding: 7,
          borderWidth: 2,
          borderColor: "#000",
          marginTop: -48,
        }}
      >
        <QRCode
          value={payload}
          size={58}
          color={accent}
          backgroundColor="#ffffff"
          quietZone={0}
        />
      </View>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 9,
          opacity: 0.6,
        }}
      >
        Scan to connect instantly
      </Text>
    </View>
  );
}

function BrandHeaderPreview({
  payload,
  accent,
  surface,
}: {
  payload: string;
  accent: string;
  surface: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          backgroundColor: accent,
          borderWidth: 3,
          borderColor: "#000",
          minHeight: 42,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          selectable
          style={{
            color: "#ffffff",
            fontWeight: "900",
            fontSize: 14,
            letterSpacing: 2,
          }}
        >
          PIXELQR
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <View style={{ flex: 1, gap: 5 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 16,
            }}
          >
            Brand Card
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 9,
              opacity: 0.6,
            }}
          >
            Logo header with a clean scan zone.
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 6,
            borderWidth: 2,
            borderColor: "#000",
          }}
        >
          <QRCode
            value={payload}
            size={56}
            color={accent}
            backgroundColor="#ffffff"
            quietZone={0}
          />
        </View>
      </View>
    </View>
  );
}

function CouponPreview({
  payload,
  accent,
  surface,
}: {
  payload: string;
  accent: string;
  surface: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "92%",
          minHeight: 120,
          borderWidth: 3,
          borderStyle: "dashed",
          borderColor: "#000",
          backgroundColor: "#ffffff",
          padding: 12,
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          selectable
          style={{
            color: accent,
            fontWeight: "900",
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          LIMITED OFFER
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 22,
          }}
        >
          SAVE 20%
        </Text>
        <QRCode
          value={payload}
          size={48}
          color={accent}
          backgroundColor="#ffffff"
          quietZone={0}
        />
      </View>
    </View>
  );
}

function EventPreview({
  payload,
  accent,
  surface,
}: {
  payload: string;
  accent: string;
  surface: string;
}) {
  return (
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          selectable
          style={{
            color: accent,
            fontWeight: "900",
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          EVENT PASS
        </Text>
        <View
          style={{
            width: 36,
            height: 20,
            borderRadius: 999,
            backgroundColor: accent,
            borderWidth: 2,
            borderColor: "#000",
          }}
        />
      </View>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 18,
        }}
      >
        Creator Summit
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 5 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 9,
              opacity: 0.6,
            }}
          >
            RSVP • MAP • AGENDA
          </Text>
          <Text
            selectable
            style={{
              color: accent,
              fontWeight: "900",
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            Scan ticket
          </Text>
        </View>
        <QRCode
          value={payload}
          size={52}
          color={accent}
          backgroundColor={surface}
          quietZone={0}
        />
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
  visualStyle,
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
    <View
      style={{
        minHeight: 170,
        backgroundColor: surface,
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: accent,
            borderWidth: 3,
            borderColor: "#000",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            selectable
            style={{ color: "#ffffff", fontWeight: "900", fontSize: 16 }}
          >
            {label.slice(0, 1)}
          </Text>
        </View>
        <Text
          selectable
          style={{
            color: accent,
            fontWeight: "900",
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          {category}
        </Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 17,
          }}
        >
          {title}
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 10,
            opacity: 0.6,
          }}
        >
          {label}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 36,
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: "#ffffff",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            selectable
            style={{
              color: accent,
              fontWeight: "900",
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            Scan-safe style
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 6,
            borderWidth: 2,
            borderColor: "#000",
          }}
        >
          <QRCode
            value={payload}
            size={48}
            color={accent}
            backgroundColor="#ffffff"
            quietZone={0}
          />
        </View>
      </View>
    </View>
  );
}
