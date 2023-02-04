const express = require('express');
const { body } = require('express-validator/check');
const path = require('path');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// const rootDir = require('../util/path'); // util folder is no more use
const router =  express.Router();

// const products = [];

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
//     // res.sendFile(path.join(rootDir,'views','add-product.html'))
//     // res.send("<form action = '/admin/add-product' method = 'POST'><input type = 'text' name = 'title'> <button type = 'submit'>Add Product</button></input></form>")
 
router.post(
    '/add-product', 
    [
        body('title')
        .isString()
        .isLength({ min: 3})
        .trim(),
        body('price').isFloat(),
        body('description')
        .isLength({ min: 5, max: 200 })
        .trim()
    ],   
    isAuth, 
    adminController.postAddProduct
    );
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product', 
    [
        body('title')
        .isString()
        .isLength({ min: 3})
        .trim(),
        body('price').isFloat(),
        body('description')
        .isLength({ min: 5, max: 200 })
        .trim()
    ],   
    isAuth, 
    adminController.postEditProduct
    );

router.delete('/product/:productId', isAuth, adminController.deleteProduct); 
// router.post('/delete-product', isAuth, adminController.postDeleteProduct); 

module.exports = router;

// exports.routes = router;      // both exports no longer use
// exports.products = products;