module.exports = app => {
  console.log(`DEBUG: setting up welcome plugin proxy with ${app}`);

  app.get('/derp', (req, res) => {
    res.end('HELLO!');
  });
};
