import { useState } from "react";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Button } from "@/components/ui";
import {
  copyPayload,
  downloadPng,
  downloadSvg,
  sharePayload,
} from "@/utils/export-qr";
import { downloadPdf } from "@/utils/export-pdf";
import { TemplateId } from "@/types/qr";

export function ExportActions({
  payload,
  foregroundColor,
  backgroundColor,
  title,
  subtitle,
  templateId,
  onDownloadPng,
  onDownloadAnimated,
}: {
  payload: string;
  foregroundColor: string;
  backgroundColor: string;
  title: string;
  subtitle: string;
  templateId?: TemplateId;
  onDownloadPng?: () => Promise<void>;
  onDownloadAnimated?: () => Promise<void>;
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
        <Button
          label="Download PNG"
          onPress={() =>
            run(
              "PNG downloaded.",
              onDownloadPng ||
                (() => downloadPng(payload, foregroundColor, backgroundColor)),
            )
          }
        />
        <Button
          label="Download SVG"
          variant="secondary"
          onPress={() =>
            run("SVG downloaded.", () =>
              downloadSvg(payload, foregroundColor, backgroundColor),
            )
          }
        />
        <Button
          label="Download PDF"
          variant="secondary"
          onPress={() =>
            run("PDF print page opened.", () =>
              downloadPdf(payload, foregroundColor, backgroundColor, title, subtitle),
            )
          }
        />
        {onDownloadAnimated ? (
          <Button
            label="Animated SVG"
            variant="secondary"
            onPress={() => run("Animated SVG downloaded.", onDownloadAnimated)}
          />
        ) : null}
        <Button
          label="Copy"
          variant="outline"
          onPress={() => run("Payload copied.", () => copyPayload(payload))}
        />
        <Button
          label="Share"
          variant="outline"
          onPress={() => run("Share sheet opened.", () => sharePayload(payload))}
        />
      </View>
      {status ? (
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
            opacity: 0.6,
          }}
        >
          {status}
        </Text>
      ) : null}
    </View>
  );
}
