// const mongodb = require('mongodb');
const Product =require('../models/product');
// const ObjectId = mongodb.ObjectId;


exports.getAddProduct = (req,res,next) => {
    // console.log("I am next Middleware");
    // if(!req.session.isLoggedIn){
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product',{
        pageTitle : 'Add Product', 
        path : '/admin/add-product',
        editing : false
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    console.log(req.session.user._id);

    const product = new Product({
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
        console.log(err);
      });
  };
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
            product: product
        });
    })
    .catch(err => {
        console.log(err);
    });

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
  
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

      .catch(err => console.log(err));
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
            console.log(err);
        });

};