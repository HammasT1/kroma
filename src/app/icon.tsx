import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0e0e10",
        color: "#d4b27a",
        fontSize: 44,
        fontWeight: 900,
        borderRadius: 14,
      }}
    >
      K
    </div>,
    size,
  );
}
