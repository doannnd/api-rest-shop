const express = require('express');
const morgan = require('morgan');
var chalk = require('chalk');

const productRoute = require('./api/routes/product.route');
const orderRoute = require('./api/routes/order.route');

const app = express();
const port = 3000;

app.use(morgan('tiny'));

app.use('/product', productRoute);
app.use('/order', orderRoute);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        "error": {
            "message": error.message
        }
    })
});

app.listen(port, () => {
    console.log(chalk.blue('Server is running on port ', port));
});