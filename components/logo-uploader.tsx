import { Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/theme";
import { Button } from "@/components/ui";

export function LogoUploader({
  uri,
  onChange,
}: {
  uri?: string;
  onChange: (uri?: string) => void;
}) {
  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          minHeight: 90,
          borderWidth: 4,
          borderColor: "#000",
          borderStyle: "dashed",
          backgroundColor: colors.white,
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          gap: 8,
        }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: 44, height: 44 }}
            resizeMode="contain"
          />
        ) : null}
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          {uri
            ? "Logo ready for preview exports"
            : "Upload a square logo for branded QR codes"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Button label="Upload logo" variant="secondary" onPress={pickLogo} />
        {uri ? (
          <Pressable
            onPress={() => onChange(undefined)}
            style={{ justifyContent: "center", paddingHorizontal: 10 }}
          >
            <Text
              selectable
              style={{
                color: colors.accent,
                fontWeight: "700",
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Remove
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
