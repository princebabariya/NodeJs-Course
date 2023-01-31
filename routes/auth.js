const express = require('express');
const router = express.Router();
const authControlller = require('../controllers/auth');

router.get('/login', authControlller.getLogin);
router.get('/signup', authControlller.getSignup);
router.post('/login', authControlller.postLogin);
router.post('/signup', authControlller.postSignup);
router.post('/logout', authControlller.postLogout);


module.exports = router;