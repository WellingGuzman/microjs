const http = require('http');

module.exports = app;

function app() {
  this.middleware = [];
}

app.prototype.use = function (fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('middleware must be a function');
  }

  this.middleware.push(fn);

  return this;
};

app.prototype.handleRequest = function() {
  return (request, response) => {
    this.callMiddleware(request, response).then(() => this.finalize(request, response));
  }
};

app.prototype.finalize = function (request, response) {
  this.send(response);
};

app.prototype.send = function (response) {
  response.end();
};

app.prototype.callMiddleware = function (request, response) {
  let index = -1;

  const executeNext = () => {
    return new Promise((resolve, reject) => {
      index++

      if (index >= this.middleware.length || !this.middleware[index]) {
        resolve();
        return;
      }

      const fn = this.middleware[index];

      try {
        resolve(fn(request, response, executeNext));
      } catch (err) {
        reject(err);
      }
    });
  };

  return executeNext();
};

app.prototype.listen = function () {
  const server = http.createServer(this.handleRequest());

  server.on('listening', () => {
    console.log('listening on port: ' + server.address().port);
  });

  return server.listen.apply(server, arguments)
};
