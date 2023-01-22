// const products = [];
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req,res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products, 
                pageTitle : 'All Products', 
                path: '/products' 
                
            });
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getProduct = (req,res,next) => {
    const proId = req.params.productId;

    Product.findById(proId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path : '/products'
            });
        })
        .catch(err =>
            console.log(err));   
};

exports.getIndex = (req,res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products, 
                pageTitle : 'Shop', 
                path: '/'
                
            });        
        })
        .catch(err => {
            console.log(err);
        });
    
};

exports.getCart = (req,res,next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    cart.products.push({productData: product, qty: cartProductData.qty});
                }
                
            }
            res.render('shop/cart',{
                path : 'cart',
                pageTitle : 'Your Cart',
                products : cartProducts
            });
        });
    });
};

exports.postCart = (req,res,next) => {
    const proId = req.body.productId;
    Product.findById(proId, (product) => {
        Cart.addProduct(proId, product.price);
    });
    res.redirect('/cart');
   
};

exports.postCartDeleteProduct = (req, res,next) => {
    const proId = req.body.productId;
    Product.findById(proId,product => {
        Cart.deleteProduct(proId, product.price);
        res.redirect('/cart');
    })
};
exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{
        path : 'orders',
        pageTitle : 'Your Orders'
    });
};

exports.GetCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        path : '/checkout',
        pageTitle : 'Checkout'
    })
}
    // console.log("I am next Middleware");
    // console.log('shop.js',adminData.products);
    // const products = adminData.products;
   
    // res.sendFile(path.join(rootDir,'views', 'shop.html'));

