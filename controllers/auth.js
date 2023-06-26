const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const pool = mysql.createPool({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    const { Lname, Fname, Email, Pnumber, Pswrd, Cpswrd} = req.body;

    pool.query('SELECT Users_Mail FROM users WHERE Users_Mail = ?', [Email], async (error, result) =>{
        if(error) {
            console.log(error);
        }

        if( result.length > 0 ) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        } else if(Pswrd !== Cpswrd) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }
        
        let hashedPassword = await bcrypt.hash(Pswrd, 8);
        
        pool.query('INSERT INTO users SET ?', {Users_Lastname : Lname, Users_Firstname : Fname, Users_Mail : Email, Users_Phonenumber : Pnumber, Users_Password : hashedPassword, Is_Admin : 0, Id_Subscription : 1 }, (error, results) =>{
            if(error){
                console.log(error);
            } else {
                return res.render('index', {
                    message: 'User registered!'
                })
            }
        })
    });
};

exports.login = (req, res) => {
    
}