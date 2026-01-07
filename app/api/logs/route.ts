export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.error("Client reported error:", payload);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error in /api/logs:", err);
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
