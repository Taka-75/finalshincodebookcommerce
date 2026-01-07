import React from "react";

export default function GlobalError({ error }: { error: any }) {
  // Log full error server-side (will appear in Vercel function logs)
  try {
    console.error("Global server error:", error);
    if (error && error.digest) {
      console.error("Error digest:", error.digest);
    }
  } catch (e) {
    console.error("Error while logging global error:", e);
  }

  return (
    <html>
      <body>
        <div style={{ padding: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Server error</h1>
          <p>Sorry — something went wrong on the server.</p>
          <p>If you're the site owner, check server logs for details (look for "Global server error").</p>
        </div>
      </body>
    </html>
  );
}
