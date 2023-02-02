// const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Product =require('../models/product');
// const ObjectId = mongodb.ObjectId;
const {validationResult} = require('express-validator');

exports.getAddProduct = (req,res,next) => {
    // console.log("I am next Middleware");
    // if(!req.session.isLoggedIn){
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product',{
        pageTitle : 'Add Product', 
        path : '/admin/add-product',
        editing : false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // console.log(imageUrl);
    if(!image){
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Add Product', 
            path : '/admin/add-product',
            editing : false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Add Product', 
            path : '/admin/add-product',
            editing : false,
            hasError: true,
            product: {
                title: title,
                imageUrl:imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;
    console.log(req.session.user._id);

    const product = new Product({
    //   _id: new mongoose.Types.ObjectId('63db566ecf3a5c4477f5a662'),
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.session.user._id
    });
    product
      .save()
      .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        });
    };
          // res.redirect('/500');
        // console.log('error occcured');
        // console.log(err);
    //     return res.status(500).render('admin/edit-product',{
    //         pageTitle : 'Add Product', 
    //         path : '/admin/add-product',
    //         editing : false,
    //         hasError: true,
    //         product: {
    //             title: title,
    //             imageUrl:imageUrl,
    //             price: price,
    //             description: description
    //         },
    //         errorMessage: 'Database operation failed.',
    //         validationErrors: []
    //     });
        
    // product.save();
    // console.log(req.body);
    // products.push({title: req.body.title})
    // res.redirect('/');  

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
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        // res.redirect('/500');
        // console.log(err);
    });

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Add Product', 
            path : '/admin/edit-product',
            editing : true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl:updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc ,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

  
    Product.findById(prodId)
      .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
           product.imageUrl = updatedImageUrl;
        return product.save()      
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
          })
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }); 
};

exports.getProducts = (req,res,next) => {
    Product.find({userId: req.user._id})
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products, 
                pageTitle : 'Admin Products', 
                path: '/admin/products'
            });         
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
         });
}

exports.postDeleteProduct = (req, res, next) => {
    const proId = req.body.productId;
    Product.deleteOne({_id: proId, userId: req.user._id})
    // Product.findByIdAndRemove(proId)
        .then(() => {
            console.log('Deleted Product');
            res.redirect('./admin/products');

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};