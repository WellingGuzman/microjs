const app = require('../lib/app');
const e = new app();

e.use(function (req, res, next) {
  const data = JSON.stringify({hola: 'bola'});

  res.setHeader('Content-Type', 'application/json; charset=utf8');
  res.setHeader('Content-Length', Buffer.byteLength(data));
  res.write(data);
});

e.listen(3000, 'localhost', () => {
  console.log('test application running');
});
