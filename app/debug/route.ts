export async function GET() {
  // Intentionally throw to trigger the dev overlay and source-map lookup
  throw new Error('DEBUG: intentional error to trigger overlay and source-map parsing');
}