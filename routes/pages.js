const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage: storage});

router.post('/uploadImage', upload.single('image'), (req, res, next) => {
    const file = req.file
    if (!file) {
        return res.status(500).send({message: "Upload fail"});
    } else {
        return res.send({message: "Upload successful", file: `/uploads/${file.filename}`});
    }
});



module.exports = router;
