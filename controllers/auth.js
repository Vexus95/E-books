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
                res.status(200).redirect('/protected-page');
        
            }
        } else {
          return res.status(401).send({ message: 'Email non enregistré.' });
        }
    });
};

exports.verifyAuth = (req, res, next) => {
    // Récupérer le token du cookie
    const token = req.cookies.jwt;

    // Vérifier s'il y a un token
    if (!token) {
        return res.status(401).redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // stocker l'ID de l'utilisateur dans req.user
    // Vérifier la validité du token

    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) {
            console.log(error);
            return res.status(401).redirect('/login');
        }

        // Si tout va bien, passer à la prochaine fonction middleware
        next();
    });
}

exports.logout = (req, res) => {
    res.cookie('jwt', '', { expires: new Date(Date.now() - 10 * 1000) });
    res.redirect('/');
};

exports.subscribe = (req, res) => {
    const userId = req.user.id; // l'ID de l'utilisateur est généralement stocké dans req.user.id après authentification
    const subscriptionId = req.body.subscriptionId; // l'ID de l'abonnement est envoyé dans le corps de la requête

    // Vérifiez d'abord si l'abonnement existe
    pool.query('SELECT * FROM subscriptions WHERE Id_Subscription = ?', [subscriptionId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'abonnement.');
        }

        if (results.length === 0) {
            return res.status(400).send('L\'abonnement n\'existe pas.');
        }

        // Mettez à jour l'abonnement de l'utilisateur
        pool.query('UPDATE Users SET subscription_id = ? WHERE id = ?', [subscriptionId, userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la mise à jour de l\'abonnement.');
            }

            res.status(200).send('Abonnement mis à jour avec succès.');
        });
    });
};

exports.getBooks = (req, res, next) => {
    pool.query('SELECT * FROM book ', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des livres.');
        }

        // Ajouter les résultats (les livres) à res.locals
        res.locals.books = results;

        // Passer au prochain middleware
        next();
    });
};

exports.getTopSellingBooks = (req, res, next) => {
    // Modifier la requête pour trier les livres par ventes en ordre décroissant et limiter à 3
    pool.query('SELECT * FROM book ORDER BY Book_Reservation DESC LIMIT 3', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des livres.');
        }

        // Ajouter les résultats (les livres) à res.locals
        res.locals.bestbooks = results;

        // Passer au prochain middleware
        next();
    });
};

exports.getBooksByGenre = (req, res) => {
    const genre = req.params.genre; // Récupérer le genre à partir du paramètre de route

    pool.query('SELECT b.* FROM book AS b INNER JOIN belong_to AS bt ON b.Id_Book = bt.Id_Book INNER JOIN genre AS g ON g.Id_Genre = bt.Id_Genre WHERE g.Genre_Name = ?;',[genre],(error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la récupération des livres.');
            }

            // Envoyer les résultats (les livres) à la vue
            res.status(200).render('index', { booksByGenre: results });
        }
    );
}; 
 
exports.reserveBook = (req, res) => {
    const userId = req.user.id; // l'ID de l'utilisateur est généralement stocké dans req.user.id après authentification
    const bookId = req.body.bookId; // l'ID du livre est envoyé dans le corps de la requête

    // Obtenir les informations sur l'abonnement de l'utilisateur
    pool.query('SELECT Subscription_Max_Book FROM subscription JOIN Users ON Users.Id_Subscription = subscription.Id_Subscription WHERE Users_id = ?', [userId], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des informations sur l\'abonnement.');
        }

        const maxBooks = results[0].max_books;

        // Vérifier combien de livres l'utilisateur a déjà réservé
        pool.query('SELECT COUNT(*) AS reservedBooks FROM borrow WHERE Users_id = ?', [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la vérification du nombre de livres réservés.');
            }

            const reservedBooks = results[0].reservedBooks;

            if (reservedBooks >= maxBooks) {
                return res.status(400).send('Vous avez atteint la limite de livres que vous pouvez réserver.');
            }

            // Réserver le livre pour l'utilisateur
            pool.query('INSERT INTO borrow (Users_id, Id_Book) VALUES (?, ?)', [userId, bookId], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Erreur lors de la réservation du livre.');
                }

                res.status(200).send('Le livre a été réservé avec succès.');
            });
        });
    });
}

exports.addBook = (req, res) => {
    const { title, author, link } = req.body; // Ces champs dépendent des données requises pour créer un livre dans votre base de données

    pool.query('INSERT INTO book (Book_Title, Book_Author,Book_Link) VALUES (?, ?, ?)', [title, author, link], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de l\'ajout du livre.');
        }

        res.status(200).send('Le livre a été ajouté avec succès.');
    });
};

exports.updateBook = (req, res) => {
    const { bookId, title, author, isbn, publishedDate } = req.body; // Ces champs dépendent des informations nécessaires pour modifier un livre dans votre base de données

    pool.query('UPDATE Book SET Book_Title = ?, Book_Author = ?, Book_Link = ?, WHERE id = ?', [title, author, link, bookId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la mise à jour du livre.');
        }

        res.status(200).send('Le livre a été mis à jour avec succès.');
    });
};

exports.deleteBook = (req, res) => {
    const bookId = req.params.bookId; // l'ID du livre est généralement envoyé dans l'URL, par exemple /books/123 où 123 est l'ID du livre

    pool.query('DELETE FROM books WHERE Id_Book = ?', [bookId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la suppression du livre.');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Aucun livre trouvé avec cet ID.');
        }

        res.status(200).send('Le livre a été supprimé avec succès.');
    });
};

