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
                message: 'Cet email est deja utilisé'
            })
        } else if(Pswrd !== Cpswrd) {
            return res.render('register', {
                message: 'Les mots de passe ne correspondent pas'
            })
        }
        
        let hashedPassword = await bcrypt.hash(Pswrd, 8);
        
        pool.query('INSERT INTO users SET ?', {Users_Lastname : Lname, Users_Firstname : Fname, Users_Mail : Email, Users_Phonenumber : Pnumber, Users_Password : hashedPassword, Is_Admin : 0, Id_Subscription : 1 }, (error, results) =>{
            if(error){
                console.log(error);
            } else {
                return res.render('index', {
                    message: 'Compte crée'
                })
            }
        })
    });
};

exports.login = (req, res) => {
    const { Email, Pswrd } = req.body;
  
    pool.query('SELECT * FROM users WHERE Users_Mail = ?', [Email], async (error, results) => {
      if (error) {
        console.log(error);
      }
  
      if (results.length === 0) {
        return res.render('login', {
          message: 'L\'utilisateur n\'existe pas'
        });
      }
  
      const user = results[0];
      const isPasswordMatch = await bcrypt.compare(Pswrd, user.Users_Password);
  
      if (!isPasswordMatch) {
        return res.render('login', {
          message: 'Le mot de passe est incorrect'
        });
      }
  
      const token = jwt.sign({ userId: user.Users_id }, 'your-jwt-secret');
  
      // Stockez le JWT dans un cookie ou renvoyez-le dans la réponse
      res.cookie('token', token);
      // OU
      // res.json({ token: token });
  
      return res.render('/', {
        message: 'Connecté avec succès'
      });
    });
  };