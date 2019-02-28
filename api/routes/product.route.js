const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message": "GET/product"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        "message": "POST/product"
    });
});

router.get('/:productId', (req, res, next) => {
    res.status(200).json({
        "message": "GET/product/{id}",
        "productId": req.params.productId
    });
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        "message": "PATCH/product/{id}",
        "productId": req.params.productId
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        "message": "DELETE/product/{id}",
        "productId": req.params.productId
    });
});

module.exports = router;