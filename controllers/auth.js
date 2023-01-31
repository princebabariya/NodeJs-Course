const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req,res,next) => {
            // console.log(req.get('Cookie'));
            // const isLoggedIn = req
            // .get('Cookie')
            // .trim()
            // .split('=')[1] === 'true';
            // console.log(req.session.isLoggedIn);
            let message = req.flash('error');
            if(message.length > 0){
                message = message[0];
            }
            else{
                message = null;
            }
            res.render('auth/login',{
                path:'/login',
                pageTitle: 'Login',
                errorMessage: message
            });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup',{
        path:'/signup',
        pageTitle: 'Signup',
        errorMessage: message

    });

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user){
            req.flash('error','Invalid email or password');
          return res.redirect('/login');
        }
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error','Invalid email or password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({
        email: email
    })
    .then(userDoc => {
        if(userDoc){
            req.flash('error','Email already exists');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12) 
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
           return transporter.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Signup Successfully',
                html: '<h1>You successfully signedup ! </h1>'
            });
        })
        .catch(err => {
            console.log(err);
        })

    })
   
    .catch(err => {
        console.log(err);
    });


};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
   
}