const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use('/api', createProxyMiddleware({
        target: 'http://127.0.0.1:3000',
        pathRewrite: {
            '^/api': '/'
        },
        changeOrigin: true,
    }));
};
