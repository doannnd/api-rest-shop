const express = require('express');

const productRoute = require('./api/routes/product.route');
const orderRoute = require('./api/routes/order.route');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.status(200).json({
        "message": "It worked"
    });
});

app.use('/product', productRoute);
app.use('/order', orderRoute);

app.listen(port, () => {
    console.log('Server is running on port ', port);
});