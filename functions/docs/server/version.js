addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const GITHUB_API_URL = 'https://api.github.com/repos/txlog/server/releases/latest';

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'txlog-version-check'
  };

  try {
    const githubResponse = await fetch(GITHUB_API_URL, {
      method: 'GET',
      headers: headers,
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return new Response(`Error fetching GitHub data: ${githubResponse.status} ${githubResponse.statusText} - ${errorText}`, {
        status: githubResponse.status
      });
    }

    const githubData = await githubResponse.json();
    const tagName = githubData.tag_name

    const response = new Response(tagName, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    });

    return response;

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(`Internal error: ${error.message}`, { status: 500 });
  }
}