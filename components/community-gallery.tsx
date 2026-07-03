import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors } from "@/constants/theme";
import { Panel, Button } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { GalleryEntry } from "@/types/qr";

const exampleEntries: GalleryEntry[] = [
  {
    id: "ex-coffee",
    name: "Coffee Shop Menu",
    createdAt: "2026-06-01T10:00:00Z",
    author: "PixelQR",
    formValues: {
      kind: "url",
      content: "menu.brewlab.co",
      emailSubject: "",
      phoneCountryCode: "+1",
      wifiSsid: "",
      wifiPassword: "",
      wifiEncryption: "WPA",
      title: "Brew Lab",
      subtitle: "Scan our menu",
      calendarEventName: "",
      calendarDate: "",
      calendarLocation: "",
      calendarDescription: "",
      cryptoCurrency: "bitcoin",
      cryptoAmount: "",
    },
    customization: {
      foregroundColor: "#3b1f0b",
      backgroundColor: "#fef3c7",
      gradientMode: "none",
      gradientColor: "#d97706",
      dotStyle: "rounded",
      eyeStyle: "rounded",
      innerEyeColor: "#d97706",
      outerEyeColor: "#3b1f0b",
      size: 220,
      padding: 16,
      transparentBackground: false,
      logoSize: 0,
      logoBackground: false,
      frameStyle: "ticket",
      frameLabel: "",
      frameCtaText: "",
      frameCtaColor: "#FF6B6B",
      frameBorderWidth: 4,
      cornerRadius: 0,
      shadowDepth: "medium",
    },
    likes: 24,
    liked: false,
    isExample: true,
  },
  {
    id: "ex-fashion",
    name: "Fashion Lookbook",
    createdAt: "2026-06-05T14:00:00Z",
    author: "PixelQR",
    formValues: {
      kind: "url",
      content: "lookbook.avenue.style",
      emailSubject: "",
      phoneCountryCode: "+1",
      wifiSsid: "",
      wifiPassword: "",
      wifiEncryption: "WPA",
      title: "Avenue Studio",
      subtitle: "Explore the collection",
      calendarEventName: "",
      calendarDate: "",
      calendarLocation: "",
      calendarDescription: "",
      cryptoCurrency: "bitcoin",
      cryptoAmount: "",
    },
    customization: {
      foregroundColor: "#1e1b4b",
      backgroundColor: "#e0e7ff",
      gradientMode: "linear",
      gradientColor: "#7c3aed",
      dotStyle: "circle",
      eyeStyle: "circle",
      innerEyeColor: "#7c3aed",
      outerEyeColor: "#1e1b4b",
      size: 220,
      padding: 18,
      transparentBackground: false,
      logoSize: 0,
      logoBackground: false,
      frameStyle: "simple",
      frameLabel: "",
      frameCtaText: "",
      frameCtaColor: "#FF6B6B",
      frameBorderWidth: 4,
      cornerRadius: 0,
      shadowDepth: "medium",
    },
    likes: 18,
    liked: false,
    isExample: true,
  },
  {
    id: "ex-gym",
    name: "Gym Check-in",
    createdAt: "2026-06-10T08:00:00Z",
    author: "PixelQR",
    formValues: {
      kind: "url",
      content: "checkin.ironfit.app",
      emailSubject: "",
      phoneCountryCode: "+1",
      wifiSsid: "",
      wifiPassword: "",
      wifiEncryption: "WPA",
      title: "Iron Fit",
      subtitle: "Tap to check in",
      calendarEventName: "",
      calendarDate: "",
      calendarLocation: "",
      calendarDescription: "",
      cryptoCurrency: "bitcoin",
      cryptoAmount: "",
    },
    customization: {
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
      gradientMode: "none",
      gradientColor: "#000000",
      dotStyle: "square",
      eyeStyle: "square",
      innerEyeColor: "#000000",
      outerEyeColor: "#000000",
      size: 220,
      padding: 16,
      transparentBackground: false,
      logoSize: 0,
      logoBackground: false,
      frameStyle: "bold",
      frameLabel: "",
      frameCtaText: "",
      frameCtaColor: "#FF6B6B",
      frameBorderWidth: 4,
      cornerRadius: 0,
      shadowDepth: "medium",
    },
    likes: 31,
    liked: false,
    isExample: true,
  },
  {
    id: "ex-photo",
    name: "Photographer Portfolio",
    createdAt: "2026-06-12T16:00:00Z",
    author: "PixelQR",
    formValues: {
      kind: "url",
      content: "portfolio.lensandlight.co",
      emailSubject: "",
      phoneCountryCode: "+1",
      wifiSsid: "",
      wifiPassword: "",
      wifiEncryption: "WPA",
      title: "Lens & Light",
      subtitle: "View portfolio",
      calendarEventName: "",
      calendarDate: "",
      calendarLocation: "",
      calendarDescription: "",
      cryptoCurrency: "bitcoin",
      cryptoAmount: "",
    },
    customization: {
      foregroundColor: "#1a1a2e",
      backgroundColor: "#e4e4f5",
      gradientMode: "linear",
      gradientColor: "#16213e",
      dotStyle: "soft",
      eyeStyle: "rounded",
      innerEyeColor: "#16213e",
      outerEyeColor: "#1a1a2e",
      size: 220,
      padding: 18,
      transparentBackground: false,
      logoSize: 0,
      logoBackground: false,
      frameStyle: "shadow",
      frameLabel: "",
      frameCtaText: "",
      frameCtaColor: "#FF6B6B",
      frameBorderWidth: 3,
      cornerRadius: 0,
      shadowDepth: "medium",
    },
    likes: 15,
    liked: false,
    isExample: true,
  },
];

export function CommunityGallery() {
  const gallery = useQRStore((state) => state.gallery);
  const refreshGallery = useQRStore((state) => state.refreshGallery);
  const publishCurrent = useQRStore((state) => state.publishCurrent);
  const toggleLike = useQRStore((state) => state.toggleGalleryLike);
  const removeFromGallery = useQRStore((state) => state.removeFromGallery);
  const restoreFromGallery = useQRStore((state) => state.restoreFromGallery);

  useEffect(() => {
    refreshGallery();
  }, [refreshGallery]);

  const allEntries = [...exampleEntries, ...gallery];

  return (
    <Panel>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
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
            Community Gallery
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
            Browse designs, get inspired, and publish your own.
          </Text>
        </View>
        <Button
          label="Publish mine"
          variant="secondary"
          onPress={publishCurrent}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
        }}
      >
        {allEntries.length === 0 ? (
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 12,
              opacity: 0.4,
              textAlign: "center",
              padding: 20,
            }}
          >
            No designs yet. Publish your QR to the gallery!
          </Text>
        ) : (
          allEntries.map((entry) => (
            <GalleryCard
              key={entry.id}
              entry={entry}
              onLike={() => toggleLike(entry.id)}
              onUse={() => restoreFromGallery(entry)}
              onDelete={
                entry.isExample
                  ? undefined
                  : () => removeFromGallery(entry.id)
              }
            />
          ))
        )}
      </View>
    </Panel>
  );
}

function GalleryCard({
  entry,
  onLike,
  onUse,
  onDelete,
}: {
  entry: GalleryEntry;
  onLike: () => void;
  onUse: () => void;
  onDelete?: () => void;
}) {
  const qrSize = 100;
  const qrPayload = entry.formValues.content || "pixelqr.app";

  return (
    <View
      style={{
        width: 210,
        backgroundColor: colors.white,
        borderWidth: 4,
        borderColor: "#000",
        overflow: "hidden",
        boxShadow: "6px 6px 0px 0px #000",
      }}
    >
      {/* Color bar */}
      <View
        style={{
          height: 6,
          backgroundColor: entry.customization.foregroundColor,
        }}
      />

      {/* QR preview area */}
      <View
        style={{
          padding: 14,
          alignItems: "center",
          gap: 10,
          backgroundColor: entry.customization.backgroundColor || "#fff",
        }}
      >
        <View
          style={{
            borderWidth: 3,
            borderColor: "#000",
            padding: 6,
            backgroundColor: "#fff",
          }}
        >
          <QRCode
            value={qrPayload}
            size={qrSize}
            color={entry.customization.foregroundColor}
            backgroundColor="#ffffff"
            quietZone={0}
          />
        </View>

        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 13,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {entry.name}
        </Text>

        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 10,
            opacity: 0.5,
            textAlign: "center",
          }}
        >
          by {entry.author}
        </Text>
      </View>

      {/* Actions row */}
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 3,
          borderTopColor: "#000",
          borderBottomWidth: 0,
        }}
      >
        <Pressable
          onPress={onLike}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            paddingVertical: 10,
            borderRightWidth: 3,
            borderRightColor: "#000",
            backgroundColor: entry.liked ? colors.muted : colors.white,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 12,
            }}
          >
            {entry.liked ? "❤️" : "♡"}
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 11,
            }}
          >
            {entry.likes}
          </Text>
        </Pressable>

        <Pressable
          onPress={onUse}
          style={({ pressed }) => ({
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRightWidth: entry.isExample ? 0 : 3,
            borderRightColor: "#000",
            backgroundColor: colors.secondary,
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
            Use
          </Text>
        </Pressable>

        {onDelete ? (
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => ({
              paddingHorizontal: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.white,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              selectable
              style={{
                color: colors.accent,
                fontWeight: "900",
                fontSize: 14,
              }}
            >
              ×
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
