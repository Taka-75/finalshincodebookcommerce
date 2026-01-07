import path from 'path';

export async function GET() {
  // Only run the diagnostic behavior in development
  if (process.env.NODE_ENV === 'development') {
    // Construct an Error whose stack references a known vendor bundle file
    const vendor = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle5.js');
    const e = new Error('DEBUG: trigger source-map lookup for vendor bundle');
    // Intentionally craft a stack frame pointing to the vendor file
    e.stack = `${e.name}: ${e.message}\n    at vulnerableFunction (${vendor}:1:1)\n    at runTest (<anonymous>:1:1)`;
    throw e;
  }

  // In production/build, return a safe response to avoid failing prerender.
  return new Response(JSON.stringify({ message: 'Debug-map endpoint disabled in production' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}