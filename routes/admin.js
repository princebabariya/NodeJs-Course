const express = require('express');
const path = require('path');
const adminController = require('../controllers/admin');

// const rootDir = require('../util/path'); // util folder is no more use
const router =  express.Router();

// const products = [];

router.get('/add-product', adminController.getAddProduct);
// router.get('/products', adminController.getProducts);
//     // res.sendFile(path.join(rootDir,'views','add-product.html'))
//     // res.send("<form action = '/admin/add-product' method = 'POST'><input type = 'text' name = 'title'> <button type = 'submit'>Add Product</button></input></form>")
 
router.post('/add-product',adminController.postAddProduct);
// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product',adminController.postDeleteProduct); 

module.exports = router;

// exports.routes = router;      // both exports no longer use
// exports.products = products;