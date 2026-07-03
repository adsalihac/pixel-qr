import { useState } from "react";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Button } from "@/components/ui";
import { copyPayload, downloadPng, downloadSvg, sharePayload } from "@/utils/export-qr";
import { TemplateId } from "@/types/qr";

export function ExportActions({
  payload,
  foregroundColor,
  backgroundColor,
  title,
  subtitle,
  templateId
}: {
  payload: string;
  foregroundColor: string;
  backgroundColor: string;
  title: string;
  subtitle: string;
  templateId?: TemplateId;
}) {
  const [status, setStatus] = useState("");

  const run = async (label: string, action: () => Promise<void>) => {
    setStatus("Preparing...");
    try {
      await action();
      setStatus(label);
    } catch {
      setStatus("Export action could not complete on this device.");
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button label="Download PNG" onPress={() => run("PNG downloaded.", () => downloadPng(payload, foregroundColor, backgroundColor, { title, subtitle, templateId }))} />
        <Button label="Download SVG" variant="secondary" onPress={() => run("SVG downloaded.", () => downloadSvg(payload, foregroundColor, backgroundColor))} />
        <Button label="Copy" variant="secondary" onPress={() => run("Payload copied.", () => copyPayload(payload))} />
        <Button label="Share" variant="secondary" onPress={() => run("Share sheet opened.", () => sharePayload(payload))} />
      </View>
      {status ? (
        <Text selectable style={{ color: colors.textMuted, fontSize: 12 }}>
          {status}
        </Text>
      ) : null}
    </View>
  );
}
