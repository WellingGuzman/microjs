const http = require('http');

var app = module.exports = function () {
    this.middleware = [];
}

app.prototype.use = function (fn) {
    this.middleware.push(fn);
};

app.prototype.handleRequest = function () {
    return (request, response) => {
        this.callMiddleware(request, response).then(() => this.end(request, response));
    }
};

app.prototype.end = function (request, response) {
    response.end();
};

app.prototype.callMiddleware = function (request, response) {
    let index = -1;
    const middleware = this.middleware;
    const executeNext = function () {
        return new Promise((resolve, reject) => {
            index++

            if (index >= middleware.length || !middleware[index]) {
                resolve();
                return;
            }

            const fn = middleware[index];

            try {
                resolve(fn(request, response, executeNext));
            } catch (err) {
                reject(err);
            }
        });
    };

    return executeNext();
};

app.prototype.listen = function (port) {
    return http.createServer(this.handleRequest()).listen(port || 3000);
};