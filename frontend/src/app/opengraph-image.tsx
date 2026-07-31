import { ImageResponse } from "next/og";

export const alt = "Vozon AI voice agent platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #020c0b 0%, #071f1d 55%, #063f39 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
        <div style={{ color: "#56eadc", display: "flex", fontSize: 34, fontWeight: 700 }}>VOZON</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: "-3px", lineHeight: 1.05, marginTop: 42 }}>
          AI voice agents that turn every call into action.
        </div>
        <div style={{ color: "#b8cbc9", display: "flex", fontSize: 29, lineHeight: 1.4, marginTop: 32 }}>
          Automate inbound and outbound calls, appointments, lead qualification, and customer support.
        </div>
      </div>
    </div>,
    size,
  );
}
