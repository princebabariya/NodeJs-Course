const express = require('express');
const path = require('path');
// const rootDir = require('../util/path');
const shopController = require('../controllers/shop');
const router = express.Router();
// const adminData = require('./admin');

router.get('/',shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId' ,shopController.getProduct);
// router.get('/cart',shopController.getCart);
// router.post('/cart',shopController.postCart);
// router.post('/cart-delete-item', shopController.postCartDeleteProduct);
// // router.get('/checkout',shopController.GetCheckout);
// router.get('/orders',shopController.getOrders);
// router.post('/create-order',shopController.postOrder);


module.exports = router;