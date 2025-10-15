const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND_URL = 'http://localhost:5000'; 

module.exports = function(app) {
  app.use(
    // 1. Target all API routes that start with /api
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
    })
  );
  
  // 2. CRITICAL: Remove the simple "proxy" setting from package.json
};