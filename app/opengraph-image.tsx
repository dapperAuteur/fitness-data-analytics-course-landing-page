import { ImageResponse } from "next/og";

export const alt =
  "Foundations of Fitness and Health Metrics — a 5-week course for data-curious coaches, trainers, and athletes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #1d4ed8 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, opacity: 0.9 }}>
          <div
            style={{
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            FDAC · fdac.witus.online
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.05,
            }}
          >
            <div style={{ display: "flex" }}>Foundations of Fitness</div>
            <div style={{ display: "flex" }}>and Health Metrics</div>
          </div>
          <div style={{ display: "flex", fontSize: 32, opacity: 0.92, maxWidth: 920 }}>
            A 5-week course for coaches, trainers, and data-curious athletes.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <span>Brand Anthony McDonald · B4C LLC</span>
          <span>Get the free 3-page guide →</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
