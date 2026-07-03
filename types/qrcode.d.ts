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

  type BitMatrix = {
    size: number;
    data: Uint8Array;
    reservedBit: Uint8Array;
    get(row: number, col: number): number;
    set(row: number, col: number, value: number, reserved?: boolean): void;
    xor(row: number, col: number, value: number): void;
    isReserved(row: number, col: number): boolean;
  };

  type ECLObject = {
    bit: number;
  };

  type QRCodeMatrix = {
    modules: BitMatrix;
    version: number;
    errorCorrectionLevel: ECLObject;
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
