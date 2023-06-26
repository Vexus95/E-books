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
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }

        if( result.length > 0 ) {
          return res.status(400).send({ message: 'Cet email est deja utilisé' });
        } else if(Pswrd !== Cpswrd) {
            return res.status(400).send({ message: 'Les mots de passe ne correspondent pas' });
        }
        
        let hashedPassword = await bcrypt.hash(Pswrd, 8);
        
        pool.query('INSERT INTO users SET ?', {Users_Lastname : Lname, Users_Firstname : Fname, Users_Mail : Email, Users_Phonenumber : Pnumber, Users_Password : hashedPassword, Is_Admin : 0, Id_Subscription : 1 }, (error, results) =>{
            if(error){
                console.log(error);
                return res.status(500).send({ message: 'Une erreur est survenue lors de l\'insertion des données.' });
            } else {
                return res.status(200).render('index', {
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
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }

        if (results.length > 0) {
            const isPasswordValid = await bcrypt.compare(Pswrd, results[0].Users_Password);
            
            if (!isPasswordValid) {
              return res.status(401).send({ message: 'Le mot de passe est incorrect.' });
            } else {
                const id = results[0].Users_id; // Ajustez en fonction de la structure de vos données
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });


                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
        
            }
        } else {
          return res.status(401).send({ message: 'Email non enregistré.' });
        }
    });
};

