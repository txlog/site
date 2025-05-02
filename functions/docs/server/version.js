export const onRequest = async (context) => {
  const response = await fetch("https://api.github.com/repos/txlog/server/tags");
  const data = await response.json();
  return new Response(data[0].name);
}