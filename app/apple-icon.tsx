import { ImageResponse } from "next/og";
import { EMBER_DATA_URI } from "@/lib/og-mark";

export const size = { width: 180, height: 180 } as const;
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0712 0%, #15101f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(255, 122, 51, 0.18) 45%, rgba(8, 217, 214, 0) 72%)",
        }}
      />
      <img src={EMBER_DATA_URI} width={120} height={120} alt="" />
    </div>,
    { ...size },
  );
}
