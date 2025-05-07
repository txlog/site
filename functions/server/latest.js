export async function onRequest(context) {
  return Response.redirect('https://github.com/txlog/server/releases/latest', 302);
}