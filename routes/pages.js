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

router.get('/index-connected', authController.verifyAuth, authController.getBooks, authController.getTopSellingBooks, (req, res) => {
    res.render('index', {id: req.user.id, books: res.locals.books, bestbooks: res.locals.bestbooks });
});

router.get('/book-connected/:id', authController.verifyAuth, authController.getBookById, (req, res) => {
    res.render('book', {id: req.params.id, book: res.locals.book });
});

router.get('/searchBook-connected', authController.verifyAuth, authController.searchBook, (req, res) => {
    return res.render('book', { id: req.user.id, book: res.locals.book });
});

router.get('/searchBook', authController.searchBook, (req, res) => {
    return res.render('book', { book: res.locals.book });
});

router.get('/user/:id', authController.verifyAuth, authController.getUserById, authController.getReservedBooks, (req, res) => {
    res.render('profil', { user: res.locals.user, books: res.locals.reservedBooks }); // Passe user à la vue 'profile'
});

router.get('/book/:id', authController.getBookById, (req, res) => {
    res.render('book', { book: res.locals.book });
});

router.post('/book-connected/:bookId', authController.verifyAuth, authController.reserveBook);

router.get('/logout', authController.logout);

module.exports = router;
