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
                return res.status(200).render('login', {message: 'Compte crée'})
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
                res.status(200).redirect('/index-connected');
        
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

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;

    pool.query('SELECT users.*, subscription.Subscription_Name FROM users INNER JOIN subscription ON users.Id_Subscription = subscription.Id_Subscription WHERE users.Users_id = ?', [userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }
        if (results.length > 0) {
            res.locals.user = results[0]; // Stocker les données de l'utilisateur et les détails de son abonnement dans res.locals.user
            next(); // Passer au prochain middleware
        } else {
            return res.status(404).send({ message: 'Aucun utilisateur trouvé avec cet ID.' });
        }
    });
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', { expires: new Date(Date.now() - 10 * 1000) });
    res.redirect('/');
};

exports.subscribe = (req, res) => {
    const userId = req.user.id; // l'ID de l'utilisateur est généralement stocké dans req.user.id après authentification
    const subscriptionId = req.params.subscriptionId; // l'ID de l'abonnement est envoyé dans le corps de la requête
    
    // Vérifiez d'abord si l'abonnement existe
    pool.query('SELECT * FROM subscription WHERE Id_Subscription = ?', [subscriptionId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'abonnement.');
        }

        if (results.length === 0) {
            return res.status(400).send('L\'abonnement n\'existe pas.');
        }

        // Mettez à jour l'abonnement de l'utilisateur
        pool.query('UPDATE users SET Id_Subscription = ? WHERE Users_id = ?', [subscriptionId, userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la mise à jour de l\'abonnement.');
            }

            res.status(200).send({ message: 'Abonnement mis à jour avec succès.' });
        });
    });
};

exports.IsAdmin = (req, res, next) => {
    const userId = req.user.id;

    pool.query('SELECT Is_Admin FROM users WHERE Users_id = ?', [userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }

        if (results.length > 0) {
            const isAdmin = results[0].Is_Admin;

            if (isAdmin === 1) {
                res.locals.Is_Admin = true;
                next(); // L'utilisateur est un admin, donc passez au prochain middleware
            }else{
                next();
            }
        }
    });
};


exports.searchBook = (req, res, next) => {
    const { bookTitle } = req.query;

    pool.query('SELECT * FROM book WHERE Book_title LIKE ?', ['%' + bookTitle + '%'], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }

        if (results.length > 0) {
            // Stocke les livres dans res.locals.books et rend la page du livre
            res.locals.book = results[0];
            res.locals.Id_Book = results[0].Id_Book;
            next();
        } else {
          return res.status(404).send({ message: 'Aucun livre trouvé avec ce titre.' });
        }
    });
};

exports.getBooks = (req, res, next) => {
    pool.query('SELECT * FROM book ORDER BY Id_Book DESC LIMIT 4', (error, results) => {
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


exports.getBooksEbooks = (req, res, next) => {
    pool.query('SELECT * FROM book ORDER BY Book_Title ASC', (error, results) => {
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

exports.getBookById = (req, res, next) => {
    const id = req.params.id;

    pool.query('SELECT b.*, a.Author_Name, a.Author_Surname, g.Genre_Name FROM book AS b INNER JOIN writed AS wb ON b.Id_Book = wb.Id_Book INNER JOIN authors AS a ON a.Id_Author = wb.Id_Author INNER JOIN belong_to AS bt ON b.Id_Book = bt.Id_Book INNER JOIN genre AS g ON g.Id_Genre = bt.Id_Genre WHERE b.Id_Book = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }
        if (results.length > 0) {
            res.locals.book = results[0];
            next();
        } else {
          return res.status(404).send({ message: 'Aucun livre trouvé avec cet ID.' });
        }
    });
};


exports.getTopSellingBooks = (req, res, next) => {
    // Modifier la requête pour trier les livres par ventes en ordre décroissant et limiter à 3
    pool.query('SELECT * FROM book ORDER BY Book_Reservation DESC LIMIT 4', (error, results) => {
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

exports.getBooksByGenre = (req, res, next) => {
    const genre = req.params.genre; // Récupérer le genre à partir du paramètre de route

    pool.query('SELECT b.* FROM book AS b INNER JOIN belong_to AS bt ON b.Id_Book = bt.Id_Book INNER JOIN genre AS g ON g.Id_Genre = bt.Id_Genre WHERE g.Genre_Name = ? ORDER BY b.Book_Title ASC',[genre],(error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des livres.');
        }

        // Stocker les résultats (les livres) dans res.locals
        res.locals.booksByGenre = results;

        // Passer au prochain middleware
        next();
    });
};

exports.getBooksByAuthor = (req, res, next) => {
    const author = req.params.author; // Récupérer l'auteur à partir du paramètre de route
    
    pool.query('SELECT b.* FROM book AS b INNER JOIN writed AS wb ON b.Id_Book = wb.Id_Book INNER JOIN authors AS a ON a.Id_Author = wb.Id_Author WHERE a.Author_Name = ? ORDER BY b.Book_Title ASC',[author], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des livres.');
        }   

        // Stocker les résultats (les livres) dans res.locals
        res.locals.booksByAuthor = results;

        // Passer au prochain middleware
        next();
    });
}

exports.getReservedBooks = (req, res, next) => {
    const userId = req.user.id;

    pool.query('SELECT b.* FROM book AS b INNER JOIN borrow AS bw ON b.Id_Book = bw.Id_Book INNER JOIN users AS u ON u.Users_id = bw.Users_id WHERE u.Users_id = ?', [userId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des livres.');
        }
        // Stocker les résultats (les livres) dans res.locals
        res.locals.reservedBooks = results;
        
        // Passer au prochain middleware
        next();
    });
};

exports.getSubscriptions = (req, res, next) => {
    pool.query('SELECT * FROM subscription ORDER BY Id_Subscription ASC LIMIT 3 OFFSET 1', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération des abonnements.');
        }

        // Ajouter les résultats (les abonnements) à res.locals
        res.locals.subscriptions = results;

        // Passer au prochain middleware
        next();
    });
};

 
exports.reserveBook = (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    
    // Récupérer l'abonnement de l'utilisateur
    pool.query('SELECT Id_Subscription FROM users WHERE Users_id = ?', [userId], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la récupération de l\'abonnement.');
        }

        const subscriptionId = results[0].Id_Subscription;
        let maxBooks;
        switch (subscriptionId) {
            case 1:
                maxBooks = 0; // Pas de réservation pour l'abonnement 1
                return res.status(404).send({ message: 'Vous ne pouvez pas reserver de livre. Choisissez un abonnement avant. ' });
            case 2:
                maxBooks = 1; // 1 réservation pour l'abonnement 2
                break;
            case 3:
                maxBooks = 3; // 3 réservations pour l'abonnement 3
                break;
            case 4:
                maxBooks = 5; // 5 réservations pour l'abonnement 4
                break;
            default:
                return res.status(400).send('Type d\'abonnement inconnu.');
        }

        // Vérifier combien de livres l'utilisateur a déjà réservés
        pool.query('SELECT COUNT(*) AS reservedBooks FROM borrow WHERE Users_id = ?', [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la vérification du nombre de livres réservés.');
            }

            const reservedBooks = results[0].reservedBooks;

            if (reservedBooks >= maxBooks) {
                return res.status(404).send({ message: 'Vous avez atteint la limite de livres que vous pouvez réserver.' });
            }

            // Réserver le livre pour l'utilisateur
            pool.query('INSERT INTO borrow (Users_id, Id_Book) VALUES (?, ?)', [userId, bookId], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Erreur lors de la réservation du livre.');
                }
                res.status(200).send({message:'Le livre a été réservé avec succès.'});
            });
        });
    });
};

exports.returnBook = (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

        // Supprimer la réservation du livre pour l'utilisateur
        pool.query('DELETE FROM borrow WHERE Users_id = ? AND Id_Book = ?', [userId, bookId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erreur lors de la restitution du livre.');
            }

            res.status(200).send({message:'Le livre a été retourné avec succès.'});
        });

};

exports.checkIfBookIsReserved = (req, res, next) => {
    const userId = req.user.id;
    const bookId = req.params.id;

    pool.query('SELECT * FROM borrow WHERE Users_id = ? AND Id_Book = ?', [userId, bookId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la vérification de la réservation du livre.');
        }

        if (results.length > 0) {
            res.locals.bookReserved = true;
        } else {
            res.locals.bookReserved = false;
        }

        next();
    });
};

exports.checkIfBookIsReservedInSearchBar = (req, res, next) => {
    const userId = req.user.id;
    const bookId = res.locals.Id_Book;

    pool.query('SELECT * FROM borrow WHERE Users_id = ? AND Id_Book = ?', [userId, bookId], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Erreur lors de la vérification de la réservation du livre.');
        }

        if (results.length > 0) {
            res.locals.bookReserved = true;
        } else {
            res.locals.bookReserved = false;
        }

        next();
    });
};

exports.getAuthors = (req, res, next) => {

    pool.query('SELECT * FROM authors', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }
        if (results.length > 0) {
            res.locals.authors = results; // Stocker les auteurs dans res.locals.authors
            next(); // Passer au prochain middleware
        } else {
            return res.status(404).send({ message: 'Aucun auteur trouvé.' });
        }
    });
};

exports.getGenres = (req, res, next) => {
    pool.query('SELECT * FROM genre', (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ message: 'Une erreur est survenue lors de l\'interrogation de la base de données.' });
        }
        if (results.length > 0) {
            res.locals.genres = results; // Stocker les genres dans res.locals.genres
            next(); // Passer au prochain middleware
        } else {
            return res.status(404).send({ message: 'Aucun genre trouvé.' });
        }
    });
};

exports.deleteBook = (req, res) => {
    const { deletetitle } = req.body; // Extrait le titre du livre à supprimer du corps de la requête

    pool.query('SELECT Id_Book FROM book WHERE Book_Title = ?', [deletetitle], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send({message:'Erreur lors de la récupération de l\'ID du livre.'});
        }

        if (results.length > 0) {
            const bookId = results[0].Id_Book;

            // Supprimer les relations avec les genres
            pool.query('DELETE FROM belong_to WHERE Id_Book = ?', [bookId], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({message:'Erreur lors de la suppression des relations de genres.'});
                }
            
                // Supprimer les relations avec les auteurs
                pool.query('DELETE FROM writed WHERE Id_Book = ?', [bookId], (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({message:'Erreur lors de la suppression des relations des auteurs.'});
                    }

                    // Supprimer le livre lui-même
                    pool.query('DELETE FROM book WHERE Id_Book = ?', [bookId], (error, results) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).send({message:'Erreur lors de la suppression du livre.'});
                        }

                        res.status(200).send({message:'Le livre et ses relations ont été supprimés avec succès.'});
                    });
                });
            });
        } else {
            res.status(404).send({message:'Aucun livre trouvé avec ce titre.'});
        }
    });
};


exports.addBook = (req, res) => {
    const { title, rating, imageLink, description, publicationDate, bookLink, authorName, authorSurname, genreName } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Erreur lors de l\'établissement de la connexion à la base de données.'});
        }
        
        connection.beginTransaction(error => {
            if (error) {
                console.log(error);
                return res.status(500).send({message: 'Erreur lors de l\'initiation de la transaction.'});
            }

            connection.query('SELECT Id_Author FROM authors WHERE Author_Name = ? AND Author_Surname = ?', [authorName, authorSurname], (error, results) => {
                if (error || results.length === 0) {
                    return connection.rollback(() => {
                        console.log(error);
                        res.status(500).send({message: 'Erreur lors de la recherche de l\'auteur.'});
                    });
                }

                const authorId = results[0].Id_Author;

                connection.query('SELECT Id_Genre FROM genre WHERE Genre_Name = ?', [genreName], (error, results) => {
                    if (error || results.length === 0) {
                        return connection.rollback(() => {
                            console.log(error);
                            res.status(500).send({message: 'Erreur lors de la recherche du genre.'});
                        });
                    }

                    const genreId = results[0].Id_Genre;

                    connection.query(
                        'INSERT INTO book SET ?',
                        {
                            Book_Title: title,
                            Book_Rating: rating,
                            Book_ImagePath: imageLink,
                            Book_Description: description,
                            Book_PublicationDate: publicationDate,
                            Book_Link: bookLink
                        },
                        (error, results) => {
                            if (error) {
                                return connection.rollback(() => {
                                    console.log(error);
                                    res.status(500).send({message: 'Erreur lors de l\'ajout du livre.'});
                                });
                            }

                            const bookId = results.insertId;

                            connection.query('INSERT INTO writed SET ?', { Id_Book: bookId, Id_Author: authorId }, (error, results) => {
                                if (error) {
                                    return connection.rollback(() => {
                                        console.log(error);
                                        res.status(500).send({message: 'Erreur lors de l\'ajout de l\'auteur du livre.'});
                                    });
                                }

                                connection.query('INSERT INTO belong_to SET ?', { Id_Book: bookId, Id_Genre: genreId }, (error, results) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            console.log(error);
                                            res.status(500).send({message: 'Erreur lors de l\'ajout du genre du livre.'});
                                        });
                                    }

                                    connection.commit(error => {
                                        if (error) {
                                            return connection.rollback(() => {
                                                console.log(error);
                                                res.status(500).send({message: 'Erreur lors de la finalisation de la transaction.'});
                                            });
                                        }

                                        res.status(200).send({message: 'Le livre a été ajouté avec succès.'});
                                    });
                                });
                            });
                        }
                    );
                });
            });
        });
    });
};

