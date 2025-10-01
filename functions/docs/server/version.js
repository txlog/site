export async function onRequest(context) {
  const GITHUB_API_URL = 'https://api.github.com/repos/txlog/server/releases/latest';
  
  // Cache key for this endpoint
  const CACHE_KEY = 'txlog-docs-server-version';
  const CACHE_TTL = 300; // 5 minutes in seconds
  
  // Check cache first (if available in the environment)
  const env = context.env || {};
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'txlog-version-check'
  };

  // Add GitHub token if available
  if (env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
  }

  try {
    // Try to get from cache first (Cloudflare KV if available)
    let cachedVersion = null;
    if (env.CACHE && env.CACHE.get) {
      try {
        const cached = await env.CACHE.get(CACHE_KEY);
        if (cached) {
          cachedVersion = cached;
        }
      } catch (e) {
        console.log('Cache read failed:', e);
      }
    }

    // If we have cached version, return it
    if (cachedVersion) {
      return new Response(cachedVersion, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    const githubResponse = await fetch(GITHUB_API_URL, {
      method: 'GET',
      headers: headers,
    });

    if (!githubResponse.ok) {
      // If rate limited or other API error, return a fallback version
      if (githubResponse.status === 403) {
        console.warn('GitHub API rate limited, returning fallback version');
        return new Response('ERROR: API rate limited', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=60' // Short cache for fallback
          }
        });
      }
      
      const errorText = await githubResponse.text();
      return new Response(`Error fetching GitHub data: ${githubResponse.status} ${githubResponse.statusText} - ${errorText}`, {
        status: githubResponse.status
      });
    }

    const githubData = await githubResponse.json();
    const tagName = githubData.tag_name;

    // Cache the result if possible
    if (env.CACHE && env.CACHE.put) {
      try {
        await env.CACHE.put(CACHE_KEY, tagName, { expirationTtl: CACHE_TTL });
      } catch (e) {
        console.log('Cache write failed:', e);
      }
    }

    const response = new Response(tagName, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      }
    });

    return response;

  } catch (error) {
    console.error('Worker error:', error);
    
    // Return fallback version on any error
    return new Response('ERROR: Worker error', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}