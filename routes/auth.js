const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const authControlller = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authControlller.getLogin);
router.get('/signup', authControlller.getSignup);
router.post(
    '/login', 
    [
        body('email')
        .isEmail()
        .withMessage('Please enter valid Email Address. ')
        .normalizeEmail(),
        body('password', 'Password has to be valid')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
        authControlller.postLogin
    );
router.post(
    '/signup', 
    [
    check('email')
    .isEmail()
    .withMessage('Please enter valid Email Address. ')
    .custom((value, { req }) => {  
        // if(value === 'prince@.com') {
        //     throw new Error('This email address if forbidden');
        // }
        // return true;
        return User.findOne({
            email: value
        })
        .then(userDoc => {
            if(userDoc){
                // req.flash('error','Email already exists');
                // return res.redirect('/signup');
                return Promise.reject('Email already exists');
            }
    });
}) 
    .normalizeEmail(),
    body(
        'password', 
    'Please enter password with only numbers and text and at least 5 characters.'
    )
    .isLength({min: 5})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if(value!== req.body.password){
            throw new Error('Passwords have to match');
        }
        return true;
    })
    ],
    authControlller.postSignup
    );

router.post('/logout', authControlller.postLogout);
router.get('/reset', authControlller.getReset);
router.post('/reset', authControlller.postReset);
router.get('/reset/:token', authControlller.getNewPassword);
router.post('/new-password', authControlller.postNewPassword);


module.exports = router;