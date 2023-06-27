const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.getBooks, (req, res) =>{
    res.render('index');
});

router.get('/register', (req, res) =>{
    res.render('register');
});

router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/protected-page', authController.verifyAuth, (req, res) => {
    res.render('index-connected');
});

router.get('/logout', authController.logout);

module.exports = router;
