const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');


router.get('/', authController.getBooks, authController.getTopSellingBooks, (req, res) => {
    res.render('index', { books: res.locals.books, bestbooks: res.locals.bestbooks });
});

router.get('/register', (req, res) =>{
    res.render('register');
});

router.get('/login', (req, res) =>{
    res.render('login');
});

router.get('/protected-page', authController.verifyAuth, authController.getBooks, authController.getTopSellingBooks, (req, res) => {
    res.render('index-connected', { books: res.locals.books, bestbooks: res.locals.bestbooks });
});

router.get('/searchBook', authController.searchBook);

router.get('/profil', (req, res) =>{
    res.render('profil');
});

router.get('/book/:id', authController.getBookById, (req, res) => {
    res.render('book', { book: res.locals.book });
});

router.get('/logout', authController.logout);

module.exports = router;
