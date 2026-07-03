import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, FieldLabel, Input } from "@/components/ui";

const endpoints = [
  {
    method: "POST",
    path: "/api/qr/generate",
    desc: "Generate a QR code image from JSON payload.",
    body: `{
  "content": "https://example.com",
  "foreground": "#111827",
  "background": "#ffffff",
  "size": 260,
  "format": "png"
}`,
    response: "200 → QR code image (PNG/SVG)",
  },
  {
    method: "POST",
    path: "/api/qr/bulk",
    desc: "Generate multiple QR codes from an array.",
    body: `{
  "items": [
    { "label": "Menu", "content": "https://menu.example.com" },
    { "label": "Reviews", "content": "https://reviews.example.com" }
  ],
  "format": "png"
}`,
    response: "200 → ZIP file with QR images",
  },
  {
    method: "GET",
    path: "/api/qr/:id",
    desc: "Retrieve a saved QR configuration.",
    response: "200 → { id, formValues, customization }",
  },
];

export function ApiSection() {
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
          API & Workspaces
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
          Programmatic QR generation via REST API. API key required for
          authenticated requests.
        </Text>
      </View>

      {/* API Key */}
      <View style={{ gap: 8 }}>
        <FieldLabel>Your API Key</FieldLabel>
        <Input
          value="pk_pixelqr_demo_key"
          onChangeText={() => {}}
          placeholder="API key"
        />
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 10,
            opacity: 0.4,
          }}
        >
          Base URL: https://api.pixelqr.app/v1
        </Text>
      </View>

      {/* Endpoints */}
      <View style={{ gap: 14 }}>
        <FieldLabel>Endpoints</FieldLabel>
        {endpoints.map((ep, i) => (
          <View
            key={ep.path}
            style={{
              borderWidth: 3,
              borderColor: "#000",
              backgroundColor: colors.background,
              overflow: "hidden",
            }}
          >
            {/* Method + Path */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderBottomWidth: 3,
                borderBottomColor: "#000",
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: colors.white,
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#000",
                  backgroundColor:
                    ep.method === "GET" ? "#10b981" : colors.secondary,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 9,
                    letterSpacing: 1,
                  }}
                >
                  {ep.method}
                </Text>
              </View>
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "700",
                  fontSize: 12,
                  fontFamily: "monospace",
                }}
              >
                {ep.path}
              </Text>
            </View>

            <View style={{ padding: 10, gap: 8 }}>
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "700",
                  fontSize: 11,
                  opacity: 0.7,
                }}
              >
                {ep.desc}
              </Text>
              {ep.body ? (
                <View
                  style={{
                    backgroundColor: "#000",
                    padding: 10,
                  }}
                >
                  <Text
                    selectable
                    style={{
                      color: "#00ff00",
                      fontWeight: "700",
                      fontSize: 10,
                      fontFamily: "monospace",
                    }}
                  >
                    {ep.body}
                  </Text>
                </View>
              ) : null}
              {ep.response ? (
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "700",
                    fontSize: 10,
                    opacity: 0.5,
                  }}
                >
                  {ep.response}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 11,
          opacity: 0.4,
          textAlign: "center",
        }}
      >
        API reference and full documentation coming soon.
      </Text>
    </Panel>
  );
}
