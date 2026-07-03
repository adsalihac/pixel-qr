declare module "qrcode" {
  type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  type ToDataUrlOptions = {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    margin?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  };

  type QRCodeMatrix = {
    modules: boolean[][];
    version: number;
    errorCorrectionLevel: ErrorCorrectionLevel;
    maskPattern: number;
    segments: unknown[];
  };

  type CreateOptions = {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    maskPattern?: number;
    toSJISFunc?: (codePoint: string) => number[];
  };

  const QRCode: {
    toDataURL: (text: string, options?: ToDataUrlOptions) => Promise<string>;
    create: (text: string, options?: CreateOptions) => QRCodeMatrix;
  };

  export default QRCode;
}
