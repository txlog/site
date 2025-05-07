export async function onRequest(context) {
  return Response.redirect('https://github.com/txlog/agent/releases/latest', 302);
}