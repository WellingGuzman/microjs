const app = require('../lib/app');
const e = new app();

e.use(function (req, res, next) {
    res.write('Hello');
    next();
});

e.use(function (req, res, next) {
    res.write(' ');
    next();
});

e.use(function (req, res, next) {
    res.write('World');
});

// Won't be executed
e.use(function (req, res, next) {
    res.write('!');
});

e.listen();