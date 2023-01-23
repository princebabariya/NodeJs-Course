// const mongodb = require('mongodb');
const Product =require('../models/product');
// const ObjectId = mongodb.ObjectId;
exports.getAddProduct = (req,res,next) => {
    // console.log("I am next Middleware");
    res.render('admin/edit-product',{
        pageTitle : 'Add Product', 
        path : '/admin/add-product',
        editing : false
    })
};

exports.postAddProduct = (req,res,next) =>{
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const product =  new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl
    });
    product
        .save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err); 
        })

    // product.save();
    // console.log(req.body);
    // products.push({title: req.body.title})
    // res.redirect('/');  
};

exports.getEditProduct = (req,res,next) => {
    // console.log("I am next Middleware");
    const editMode = req.query.edit;
    if(!editMode){
       return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product',{
            pageTitle : 'Edit Product', 
            path : '/admin/edit-product',
            editing : editMode,
            product: product
        });
    })
    .catch(err => {
        console.log(err);
    });

};

exports.postEditProduct = (req,res,next) => {
    const proId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
   
        const product = new Product(
            updatedTitle, 
            updatedPrice, 
            updatedDesc,
            updatedImageUrl,
             proId);
    
        product
        .save() 
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req,res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products, 
                pageTitle : 'Admin Products', 
                path: '/admin/products'
        
            });
            
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const proId = req.body.productId;
    Product.deleteById(proId)
        .then(() => {
            console.log('Deleted Product');
            res.redirect('./admin/products');

        })
        .catch(err => {
            console.log(err);
        });

};