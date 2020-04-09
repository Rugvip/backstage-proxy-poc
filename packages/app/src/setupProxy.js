module.exports = app => {
  const setupPaths = Object.keys(require('../package.json').dependencies)
    .map(dep => {
      try {
        return require.resolve(`${dep}/setupProxy.js`);
      } catch (error) {
        console.log(`no proxy setup found for ${dep}`);
      }
    })
    .filter(Boolean);

  for (const setupPath of setupPaths) {
    console.log('DEBUG: setupPath =', setupPath);
    require(setupPath)(app);
  }

  app.get('/loller', (req, res) => {
    res.end('HELLOLLER!');
  });
};
