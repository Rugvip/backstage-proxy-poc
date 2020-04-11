const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  const deps = Object.keys(require('../package.json').dependencies);

  const packageProxyConfigs = deps.flatMap(dep => {
    try {
      const pkg = require(`${dep}/package.json`);
      if (pkg.proxy) {
        return [pkg.proxy];
      }
    } catch (error) {}
    return [];
  });

  for (const packageProxyConfig of packageProxyConfigs) {
    for (const [path, config] of Object.entries(packageProxyConfig)) {
      app.use(path, createProxyMiddleware(config));
    }
  }

  const setupPaths = deps.flatMap(dep => {
    try {
      return [require.resolve(`${dep}/setupProxy.js`)];
    } catch (error) {
      return [];
    }
  });
  for (const setupPath of setupPaths) {
    require(setupPath)(app);
  }
};
