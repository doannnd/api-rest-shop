const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message": "GET/order/"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        "message": "POST/order"
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        "message": "GET/order/{id}",
        "orderId": req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        "message": "DELETE/order/{id}",
        "orderId": req.params.orderId
    });
});

module.exports = router;