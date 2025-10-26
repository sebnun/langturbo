export async function GET(request: Request) {
  // For example, fetch data from your DB here

  return new Response(JSON.stringify(process.env), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}