const express = require('express');
const path = require('path');
// const rootDir = require('../util/path');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

// const adminData = require('./admin');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.get('/checkout',isAuth, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
// router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);


module.exports = router;