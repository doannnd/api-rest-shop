const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

const Order = require('../models/order.model');
const Product = require('../models/product.model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Order.find().select('_id product quantity')
        .populate('product', 'name')
        .exec().then((orders) => {
            console.log(chalk.yellow('Find all order: ' + JSON.stringify(orders)));
            if (orders.length) {
                res.send({
                    message: 'Find all order success',
                    count: orders.length,
                    orders: orders.map((order) => {
                        return {
                            _id: order.id,
                            product: order.product,
                            quantity: order.quantity,
                            request: {
                                type: 'GET',
                                description: 'GET_ORDER_BY_ID',
                                url: 'http://localhost:3000/order/' + order.id
                            }
                        }
                    })
                });
            } else {
                res.status(404).json({
                    message: 'No entries point'
                });
            }
        }).catch((err) => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    Product.findById({ _id: req.body.productId })
        .exec().then((product) => {
            if (!product) {
                res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        }).then((result) => {
            if (result) {
                console.log(chalk.yellow('Result create order: ' + JSON.stringify(result)));
                res.status(201).json({
                    message: 'Order created',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: 'GET',
                            description: 'GET_ORDER_BY_ID',
                            url: 'http://localhost:3000/order/' + result._id
                        }
                    }
                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                })
            }
        }).catch((err) => {
            console.log(chalk.red(err));
            res.status(500).json({
                message: err
            })
        });

});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById({ _id: id })
        .populate('product').exec()
        .then((order) => {
            if (order) {
                console.log(chalk.yellow('Find order by id: ' + JSON.stringify(order)));
                res.status(200).json({
                    message: 'Find order by id success',
                    order: {
                        _id: order.id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            description: 'GET_ALL_ORDER',
                            url: 'http://localhost:3000/order'
                        }
                    }
                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                });
            }
        })
        .catch((err) => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id }).exec()
        .then((result) => {
            console.log(chalk.yellow('Delete order by id: ' + JSON.stringify(result)));
            if (result) {
                res.status(200).json({
                    message: 'Order deleted',
                    request: {
                        type: 'POST',
                        description: 'CREATE_A_NEW_ORDER',
                        url: 'http://localhost:3000/',
                        body: { productId: 'mongoose.Schema.Types.ObjectId', quantity: 'Number' }
                    }
                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                })
            }
        })
        .catch((err) => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;