const express = require("express");
const mysql = require("mysql2");
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config( { path : './.env'});

const app = express();

const pool = mysql.createPool({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

app.use(express.static('views/images')); 

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'))


app.listen(5001, () =>{
    console.log("Le Serveur est lancé sur le port 5001")
});