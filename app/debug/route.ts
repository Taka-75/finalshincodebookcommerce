export async function GET() {
  // In development we intentionally throw to trigger overlays/source-map lookup.
  if (process.env.NODE_ENV === 'development') {
    throw new Error('DEBUG: intentional error to trigger overlay and source-map parsing');
  }

  // In production/build, return a safe response to avoid failing prerender.
  return new Response(JSON.stringify({ message: 'Debug endpoint disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}