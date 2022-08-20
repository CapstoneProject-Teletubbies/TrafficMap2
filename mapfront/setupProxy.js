const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: 'https://dev.chaerin.shop:443/',
            changeOrigin: true,
        })
    );
};