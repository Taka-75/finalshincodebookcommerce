"use client";

import React, { useEffect } from "react";

export default function GlobalError({ error }: { error: any }) {
  // Client-side logging for quick diagnostics in the browser console
  useEffect(() => {
    try {
      console.error("Global error (client):", error);
      if (error && error.digest) {
        console.error("Error digest:", error.digest);
      }

      // Post minimal error info to server endpoint so it appears in Vercel logs
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: String(error?.message ?? ""), digest: error?.digest ?? null, stack: String(error?.stack ?? "") }),
      }).catch((e) => console.warn("Failed to POST error to /api/logs:", e));
    } catch (e) {
      console.error("Error while logging global error (client):", e);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Server error</h1>
          <p>Sorry - something went wrong on the server.</p>
          <p>If you are the site owner, check server logs for details (search for Client reported error).</p>
          {error?.digest && (
            <p style={{ marginTop: 12 }}>
              <strong>Digest:</strong> <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
