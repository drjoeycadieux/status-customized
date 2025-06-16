// Netlify function to serve config with proper headers
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Return the services configuration
  const config = {
    services: [
      {
        id: "joeycadieux-website",
        name: "Joey Cadieux Portfolio",
        url: "https://joeycadieux.dev",
        description: "Personal portfolio and blog website",
        expectedStatus: 200
      },
      {
        id: "softwarefoundations-website",
        name: "Software Foundations",
        url: "https://softwarefoundations.cloud",
        description: "Software Foundations main website",
        expectedStatus: 200
      }
    ],
    notifications: {
      email: {
        enabled: false,
        recipients: []
      },
      slack: {
        enabled: false,
        webhook: ""
      },
      discord: {
        enabled: false,
        webhook: ""
      }
    },
    settings: {
      checkInterval: 300000,
      timeout: 10000,
      retries: 3
    }
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(config, null, 2)
  };
};
