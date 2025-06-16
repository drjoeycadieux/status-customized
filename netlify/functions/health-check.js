// Netlify Function for health checks (optional)
// This can be used for server-side monitoring without CORS issues

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const { url } = event.queryStringParameters || {};
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' })
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Status-Page-Monitor/1.0'
      },
      timeout: 10000
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      },
      body: JSON.stringify({
        url: url,
        status: response.ok ? 'up' : 'down',
        statusCode: response.status,
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        url: url,
        status: 'down',
        error: error.message,
        responseTime: 0,
        timestamp: new Date().toISOString()
      })
    };
  }
};
