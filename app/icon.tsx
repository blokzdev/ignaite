import { ImageResponse } from "next/og";
import { EMBER_DATA_URI } from "@/lib/og-mark";

export const size = { width: 32, height: 32 } as const;
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0712",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      <img src={EMBER_DATA_URI} width={22} height={22} alt="" />
    </div>,
    { ...size },
  );
}
