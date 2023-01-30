const User = require('../models/user');

exports.getLogin = (req,res,next) => {
            // console.log(req.get('Cookie'));
            // const isLoggedIn = req
            // .get('Cookie')
            // .trim()
            // .split('=')[1] === 'true';
            // console.log(req.session.isLoggedIn);
            res.render('auth/login',{
                path:'/login',
                pageTitle: 'Login',
                isAuthenticated: false
            });
};

exports.postLogin = (req, res, next) => {
    User.findById('63cfb09a4f99513f59a3d6b5')
    .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
   
}