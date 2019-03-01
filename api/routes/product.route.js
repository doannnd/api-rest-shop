const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

const Product = require('../models/product.model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find()
    .exec().then( products => {
        console.log(chalk.yellow('Find all the product: ' + JSON.stringify(products)));
        if (products.length) {
            res.status(400).json({
                message: 'GET/product',
                products: products
            });
        } else {
            res.status(404).json({
                message: 'No entries point'
            });
        }
        
    })
    .catch( err => {
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
    
    product.save().then( document => {
        console.log(chalk.yellow('Create a product: ' + JSON.stringify(document)));
        res.status(201).json({
            message: 'POST/product',
            createdProduct: product
        });
    }).catch( err => {
        console.log(chalk.red(err));
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById({_id: id}).exec()
    .then(product => {
        console.log(chalk.yellow('Find product by id: ' + JSON.stringify(product)));
        if (product) {
            res.status(200).json({
                message: 'GET/product/{id}',
                product: product
            });
        } else {
            res.status(404).json({
                message: 'URL is invalid'
            });
        }
    }).catch( err => {
        console.log(chalk.red(err));
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const opt of req.body) {
        updateOps[opt.propName] = opt.value;
    }
    Product.update({_id: id, $set: updateOps }).exec()
    .then(result => {
        console.log(chalk.yellow('Result update product by id: ' + JSON.stringify(result)));
        if (result) {
            res.status(200).json({
                message: 'PATCH/product/{id}',
                result: result
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
    Product.remove({_id: id}).exec()
    .then( result => {
        console.log(chalk.yellow('Result delete product with id: ' + JSON.stringify(result)));
        if (result) {
            res.status(200).json({
                message: 'DELETE/product/{id}',
                result: result
            });
        } else {
            res.status(404).json({
                message: 'URL is invalid'
            });
        }
    }).catch( err => {
        console.log(chalk.red(err));
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;