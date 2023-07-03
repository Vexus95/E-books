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

router.get('/admin', authController.verifyAuth,(req,res) =>{
    res.render('admin', { Users_id: req.user.id});
});

router.get('/subscribe/:id', authController.verifyAuth, authController.IsAdmin, authController.getSubscriptions, (req,res) =>{
    res.render('subscribe', { Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, subscriptions: res.locals.subscriptions});
})

router.get('/e-book', authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', { books: res.locals.books, genres: res.locals.genres, authors:res.locals.authors});
});

router.get('/e-book/genre/:genre', authController.getBooksByGenre,  authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', {books: res.locals.booksByGenre, genres: res.locals.genres, authors:res.locals.authors});
});

router.get('/e-book/author/:author', authController.getBooksByAuthor,  authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', {  books: res.locals.booksByAuthor, genres: res.locals.genres, authors:res.locals.authors});
});

router.get('/user/:id', authController.verifyAuth, authController.IsAdmin, authController.getUserById, authController.getReservedBooks, (req, res) => {
    res.render('profil', { Users_id: res.locals.Users_id, IsAdmin: res.locals.Is_Admin, books: res.locals.reservedBooks }); // Passe user à la vue 'profile'
});

router.get('/book/:id', authController.getBookById, (req, res) => {
    res.render('book', { book: res.locals.book});
});

router.get('/searchBook', authController.searchBook, (req, res) => {
    return res.render('book', { book: res.locals.book });
});

router.get('/index-connected', authController.verifyAuth, authController.IsAdmin, authController.getBooks, authController.getTopSellingBooks, (req, res) => {
    res.render('index', {Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, books: res.locals.books, bestbooks: res.locals.bestbooks });
});

router.get('/book-connected/:id', authController.verifyAuth, authController.IsAdmin, authController.getBookById, authController.checkIfBookIsReserved, (req, res) => {
    res.render('book', {Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, book: res.locals.book});
});

router.get('/searchBook-connected', authController.verifyAuth, authController.IsAdmin, authController.searchBook, authController.checkIfBookIsReservedInSearchBar,(req, res) => {
    return res.render('book', { Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, book: res.locals.book, id : res.locals.Id_Book });
});

router.get('/e-book-connected', authController.verifyAuth, authController.IsAdmin, authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', { Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, books: res.locals.books, genres: res.locals.genres, authors:res.locals.authors});
});

router.get('/e-book-connected/genre/:genre', authController.getBooksByGenre, authController.verifyAuth, authController.IsAdmin, authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', { Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, books: res.locals.booksByGenre, genres: res.locals.genres, authors:res.locals.authors});
});

router.get('/e-book-connected/author/:author', authController.getBooksByAuthor, authController.verifyAuth, authController.IsAdmin, authController.getBooksEbooks, authController.getGenres, authController.getAuthors, (req, res) =>{
    res.render('e-book', { Users_id: req.user.id, IsAdmin: res.locals.Is_Admin, books: res.locals.booksByAuthor, genres: res.locals.genres, authors:res.locals.authors});
});

router.post('/subscribe/:subscriptionId',authController.verifyAuth, authController.subscribe);

router.post('/book-connected-reserve/:bookId', authController.verifyAuth, authController.reserveBook);

router.post('/book-connected-rendre/:bookId', authController.verifyAuth, authController.returnBook);

router.get('/logout', authController.logout);

module.exports = router;
