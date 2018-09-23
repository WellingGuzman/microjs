const http = require('http');

function app() {
    this.middleware = [];
}

app.prototype.use = function (fn) {
    this.middleware.push(fn);
};

app.prototype.handler = function () {
    return function (req, res) {
        res.write('Hello');
        res.end();
    };
};

app.prototype.listen = function (port) {
    return http.createServer(this.handler()).listen(port || 3000);
};