const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        // api_key: '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'
        // api_key: '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',
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
                errorMessage: message,
                oldInput: {
                    email: '',
                    password: ''
                },
                validationErrors: []
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
        errorMessage: message,
        oldInput: {
            email: '', 
            password: '', 
            confirmPassword: ''
        },
        validationErrors: []
    });

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        // console.log(errors.array());
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }
    User.findOne({email: email})
    .then(user => {
        if(!user){
            // req.flash('error','Invalid email or password');
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
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
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email, 
                password: password, 
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }
        bcrypt.hash(password,12) 
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            console.log(email);
            res.redirect('/login');
            // return transporter.sendMail({
            //     to: email,
            //     from: 'princebabariya1184@gmail.com ',
            //     subject: 'Signup Successfully',
            //     html: '<h1>You successfully signedup ! </h1>'
            // });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
   
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/reset',{
        path:'/reset',
        pageTitle: 'Reset Password',
        errorMessage: message

    });

};

exports.postReset = (req,res,next) => {
      crypto.randomBytes(32,(err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                req.flash('error', 'No account found. ');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'princebabariya1184@gmail.com ',
                subject: 'Signup Successfully',
                html: `
                    <p> You requested a password reset</p>
                    <p> Click this <a href = "http://localhost:3000/reset/${token}"> Link </a> to set a new password </p>
                `
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
      });

};


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now() } })
    .then(user => {
        let message = req.flash('error');
        if(message.length > 0){
            message = message[0];
        }
        else{
            message = null;
        }
        res.render('auth/new-password',{
            path:'/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString(),
            passwordToken : token
    
        });    
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postNewPassword = (req,res,next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now() },
        _id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword,12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


