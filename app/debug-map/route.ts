import path from 'path';

export async function GET() {
  // Construct an Error whose stack references a known vendor bundle file
  const vendor = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle5.js');
  const e = new Error('DEBUG: trigger source-map lookup for vendor bundle');
  // Intentionally craft a stack frame pointing to the vendor file
  e.stack = `${e.name}: ${e.message}\n    at vulnerableFunction (${vendor}:1:1)\n    at runTest (<anonymous>:1:1)`;
  throw e;
}