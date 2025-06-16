// Simple monitoring script for testing
const services = [
  { name: 'Google', url: 'https://google.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Example', url: 'https://example.com' }
];

async function checkService(service) {
  try {
    const start = Date.now();
    const response = await fetch(service.url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });
    const responseTime = Date.now() - start;
    
    return {
      name: service.name,
      url: service.url,
      status: response.ok ? 'up' : 'down',
      responseTime: responseTime,
      statusCode: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: service.name,
      url: service.url,
      status: 'down',
      responseTime: 0,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function runHealthChecks() {
  console.log('🔍 Running health checks...\n');
  
  const results = await Promise.all(services.map(checkService));
  
  results.forEach(result => {
    const status = result.status === 'up' ? '🟢' : '🔴';
    console.log(`${status} ${result.name}: ${result.status} (${result.responseTime}ms)`);
  });
  
  console.log(`\n✅ Health check completed at ${new Date().toLocaleString()}`);
  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthChecks();
}

export { checkService, runHealthChecks };
