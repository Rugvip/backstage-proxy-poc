const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

function setupProxiesFromDeps(app, deps) {
  const packageProxyConfigs = deps.flatMap(dep => {
    try {
      const pkg = require(`${dep}/package.json`);
      if (pkg.proxy) {
        console.log('DEBUG: pkg.proxy =', pkg.proxy);
        console.log(`Loading proxy config from ${pkg.name}`);
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
      const setupProxy = require.resolve(`${dep}/setupProxy.js`);
      const pkg = require(`${dep}/package.json`);
      console.log(`Loading separate middleware setup from ${pkg.name}`);
      return [setupProxy];
    } catch (error) {
      return [];
    }
  });
  for (const setupPath of setupPaths) {
    require(setupPath)(app);
  }
}

function main() {
  console.log('Starting up proxy');

  const app = express();

  const deps = Object.keys(require('app/package.json').dependencies);
  setupProxiesFromDeps(app, deps);

  app.listen(3080);
}

main();
