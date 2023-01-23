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
   req.user
    .getCart()
    .then(products => {
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req,res,next) => {
    const proId = req.body.productId;
    Product.findById(proId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    });
    
    let fetchedCart;
    let newQuntity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: proId }});
        })
        .then(products => {
                let product;
                if (products.length > 0){
                        product = products[0];
                    }
                    if(product){
                            const oldQuantity = product.cartItem.quntity;
                newQuntity = oldQuantity+1;
                return product;
            }
            return Product.findById(proId);
        })
        .then(product => {
                return fetchedCart.addProduct(product, {
                through: {quantity: newQuntity}
            });
        })
        .then(() => {
                res.redirect('/cart');
            })
            .catch(err => console.log(err));
        
        
    };
exports.postCartDeleteProduct = (req, res,next) => {
    const prodId = req.body.productId;
    req.user
    .deleteItemFromCart(prodId)
    // .then(cart => {
    //     return product.cartItem.destroy();
    // })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user
    .addOrder()
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}
exports.getOrders = (req,res,next) => {
    req.user
        .getOrders()
        .then(order => {
            res.render('shop/orders',{
                path:'/orders',
                pageTitle: 'Your Orders',
                orders: order
            });
        })
        .catch(err => console.log(err));
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

