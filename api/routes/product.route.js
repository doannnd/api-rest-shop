const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

const Product = require('../models/product.model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find()
        .select('_id name price')
        .exec().then(products => {
            console.log(chalk.yellow('Find all the product: ' + JSON.stringify(products)));
            if (products.length) {
                res.status(400).json({
                    message: 'Find all product success',
                    count: products.length,
                    products: products.map((product) => {
                        return {
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            request: {
                                type: 'GET',
                                description: 'GET_PRODUCT_BY_ID',
                                url: 'http://localhost:3000/product/' + product._id
                            }
                        }
                    })
                });
            } else {
                res.status(404).json({
                    message: 'No entries point'
                });
            }

        })
        .catch(err => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(chalk.yellow('Create a product: ' + JSON.stringify(result)));
        res.status(201).json({
            message: 'Create product success',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    description: 'GET_PRODUCT_BY_ID',
                    url: 'http://localhost:3000/product/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(chalk.red(err));
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById({ _id: id })
        .select('_id name price')
        .exec()
        .then(product => {
            console.log(chalk.yellow('Find product by id: ' + JSON.stringify(product)));
            if (product) {
                res.status(200).json({
                    message: 'Find product by id success',
                    product: {
                        _id: product.id,
                        name: product.name,
                        price: product.price,
                        request: {
                            type: 'GET',
                            description: 'GET_ALL_PRODUCT',
                            url: 'http://localhost:3000/product'
                        }
                    }

                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                });
            }
        }).catch(err => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const opt of req.body) {
        updateOps[opt.propName] = opt.value;
    }
    Product.updateOne({ _id: id, $set: updateOps }).exec()
        .then(result => {
            console.log(chalk.yellow('Result update product by id: ' + JSON.stringify(result)));
            if (result) {
                res.status(200).json({
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        description: 'GET_PRODUCT_BY_ID',
                        url: 'http://localhost:3000/product/' + id
                    }
                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                });
            }
        }).catch(err => {
            console.log(chalk.red(err));
            res.send(500).json({
                error: err
            })
        });
});

router.delete('/:productId', (req, res, next) => {
    var id = req.params.productId;
    Product.remove({ _id: id }).exec()
        .then(result => {
            console.log(chalk.yellow('Result delete product with id: ' + JSON.stringify(result)));
            if (result) {
                res.status(200).json({
                    message: 'Product deleted',
                    request: {
                        type: 'POST',
                        description: 'CREATE_A_NEW_PRODUCT',
                        url: 'http://localhost:3000/product',
                        body: {name: 'String', price: 'Number'}
                    }
                });
            } else {
                res.status(404).json({
                    message: 'URL is invalid'
                });
            }
        }).catch(err => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;