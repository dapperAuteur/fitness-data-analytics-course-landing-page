"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Root error boundary. It catches errors thrown in the root layout itself, which the per-route
// boundaries never see, so without this file such a crash renders Next's default screen and is
// reported nowhere. It renders its own <html>/<body> and cannot rely on globals.css being loaded,
// hence the inline styles. Buttons are 44px tall for touch, and there is exactly one <h1>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No-op when no DSN is configured.
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          color: "#0f172a",
          backgroundColor: "#f8fafc",
        }}
      >
        <main style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Something went wrong on our end
          </h1>
          <p style={{ color: "#475569", marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
            The page could not load. Nothing you entered was lost, and the problem has been
            reported. Please try again in a moment.
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#0891b2",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* This boundary renders outside the router, so a plain anchor is correct here. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 20px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                textDecoration: "none",
                color: "inherit",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Back to home
            </a>
          </div>
          {error.digest ? (
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 16 }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
