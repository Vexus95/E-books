CREATE TABLE Book(
   Id_Book INT,
   Book_Title VARCHAR(50),
   Book_Rating INT,
   Book_ImagePath VARCHAR(2000),
   Book_Description VARCHAR(2000),
   Book_PublicationDate DATE,
   Book_Link VARCHAR(2000),
   Book_Reservation INT,
   PRIMARY KEY(Id_Book)
);

CREATE TABLE Subscription(
   Id_Subscription INT,
   Subscription_Name VARCHAR(50),
   Subscription_Price INT,
   Subscription_Max_Book INT,
   Subscription_ImagePath VARCHAR(2000),
   PRIMARY KEY(Id_Subscription)
);

CREATE TABLE Authors(
   Id_Author INT,
   Author_Name VARCHAR(50),
   Author_Surname VARCHAR(50),
   PRIMARY KEY(Id_Author)
);

CREATE TABLE Genre(
   Id_Genre INT,
   Genre_Name VARCHAR(50),
   PRIMARY KEY(Id_Genre)
);

CREATE TABLE Users(
   Users_id INT,
   Users_Lastname VARCHAR(50),
   Users_Firstname VARCHAR(50),
   Users_Mail VARCHAR(50),
   Users_Phonenumber VARCHAR(50),
   Users_Password VARCHAR(50),
   Is_Admin INT,
   Id_Subscription INT,
   PRIMARY KEY(Users_id),
   FOREIGN KEY(Id_Subscription) REFERENCES Subscription(Id_Subscription)
);

CREATE TABLE Borrow(
   Users_id INT,
   Id_Book INT,
   PRIMARY KEY(Users_id, Id_Book),
   FOREIGN KEY(Users_id) REFERENCES Users(Users_id),
   FOREIGN KEY(Id_Book) REFERENCES Book(Id_Book)
);

CREATE TABLE Write(
   Id_Book INT,
   Id_Author INT,
   PRIMARY KEY(Id_Book, Id_Author),
   FOREIGN KEY(Id_Book) REFERENCES Book(Id_Book),
   FOREIGN KEY(Id_Author) REFERENCES Authors(Id_Author)
);

CREATE TABLE Belong_To(
   Id_Book INT,
   Id_Genre INT,
   PRIMARY KEY(Id_Book, Id_Genre),
   FOREIGN KEY(Id_Book) REFERENCES Book(Id_Book),
   FOREIGN KEY(Id_Genre) REFERENCES Genre(Id_Genre)
);


INSERT INTO book(Book_Title,Book_Rating,Book_ImagePath,Book_Description,Book_PublicationDate,Book_Link,Book_Reservation) VALUES("Dragon Ball T.1",10,"https://www.glenat.com/sites/default/files/images/livres/couv/9782723434621-001-T.jpeg","Découvrez un monde où la puissance dépasse l'imagination et où l'aventure ne connaît aucune limite.
 Dragon Ball, l'œuvre légendaire d'Akira Toriyama, est une épopée captivante qui mélange art martial, fantastique et science-fiction.
 
 L'histoire commence avec Goku, un jeune garçon doté d'une force incroyable et d'une queue de singe. Il se lance dans un voyage pour trouver les sept Dragon Balls, des artefacts magiques qui accordent un vœu à celui qui les rassemble. Au cours de sa quête, Goku rencontre de nombreux alliés et ennemis, tous avec des pouvoirs exceptionnels.
 
 Des combats épiques se déroulent alors que Goku et ses compagnons affrontent des adversaires redoutables, tels que l'empire maléfique de Freezer, les androïdes dévastateurs ou encore les dieux de la destruction. Mais au-delà des affrontements, Dragon Ball aborde également des thèmes profonds tels que l'amitié, la loyauté et le dépassement de soi.
 
 Au fil des saisons, Goku évolue, acquiert de nouvelles transformations et atteint des niveaux de puissance inimaginables. Les scènes d'action sont spectaculaires, les personnages charismatiques et l'humour est omniprésent. Dragon Ball a su conquérir des générations de fans grâce à son univers riche et son histoire captivante.
 
 Plongez dans cette saga légendaire où se mêlent combats épiques, quêtes palpitantes et émotions intenses. Dragon Ball vous transportera dans un monde où la détermination et le courage sont les clés de la victoire. Oserez-vous rejoindre Goku et ses amis dans leur lutte pour la survie de l'univers ?","1984-12-03","/pdf/Dragon_Ball_double_album_T01_Sangoku.pdf",8);
 INSERT INTO book(Book_Title,Book_Rating,Book_ImagePath,Book_Description,Book_PublicationDate,Book_Link,Book_Reservation) VALUES("One Piece T.1",10,"https://www.glenat.com/sites/default/files/images/livres/couv/9782723488525-T.jpg","Dans un monde où les océans sont infinis et où les pirates règnent en maîtres, embarquez dans une aventure épique avec One Piece. Cette saga captivante créée par Eiichiro Oda vous plonge dans un univers de pirates, de pouvoirs surnaturels et de quêtes incroyables.
 
 L'histoire commence avec Monkey D. Luffy, un jeune garçon au grand rêve : devenir le Seigneur des Pirates en trouvant le trésor ultime appelé le One Piece. Pour accomplir son but, Luffy assemble un équipage hétéroclite de compagnons dotés de compétences spéciales, comme le tireur d'élite Usopp, le navigateur Nami, le cuisinier Sanji et le médecin Tony Tony Chopper.
 
 Au cours de leur voyage à travers les mers tumultueuses, Luffy et son équipage se retrouvent impliqués dans des batailles épiques contre d'autres pirates redoutables, des Marines impitoyables et même des êtres surnaturels. Ils affrontent des adversaires puissants, comme le Capitaine Corsaire Crocodile, l'ancien amiral de la Marine Aokiji, et l'infâme Empereur des Pirates, Barbe Noire.
 
 One Piece est également une histoire de camaraderie et de valeurs. L'équipage du Chapeau de Paille est uni par des liens indéfectibles d'amitié et de loyauté, et ils sont prêts à tout pour protéger leurs amis et réaliser leurs rêves. Ils traversent des moments tragiques, des défis insurmontables et des révélations surprenantes qui renforcent leur détermination à atteindre leur objectif ultime.
 
 Avec des îles exotiques, des combats épiques, des pouvoirs mystérieux et une dose d'humour, One Piece est une aventure qui captive les lecteurs depuis des décennies. Plongez dans cet univers rempli de personnages attachants, de mystères profonds et de rebondissements inattendus. Rejoignez Luffy et son équipage dans leur quête pour conquérir les mers et trouver le trésor légendaire qui changera leur destin à jamais.","1997-07-22","/pdf/Naruto T.1.pdf",10);
  INSERT INTO book(Book_Title,Book_Rating,Book_ImagePath,Book_Description,Book_PublicationDate,Book_Link,Book_Reservation) VALUES("Naruto T.1",9,"https://m.media-amazon.com/images/I/71gwzyXnaNL._AC_UF1000,1000_QL80_.jpg","Dans un monde ninja rempli d'action, de courage et de destinées entrelacées, plongez dans l'univers captivant de Naruto. Créé par Masashi Kishimoto, ce récit épique suit les aventures de Naruto Uzumaki, un jeune ninja au cœur brûlant de volonté.
 
 L'histoire commence avec Naruto, un garçon orphelin rejeté par la société en raison du démon renard à neuf queues scellé en lui. Déterminé à devenir le plus grand ninja de son village, Naruto s'entraîne sans relâche à l'académie ninja. Il se lie d'amitié avec ses camarades Sakura Haruno et Sasuke Uchiha, formant ainsi une équipe légendaire.
 
 Au fil de leurs missions, Naruto et son équipe sont confrontés à des ennemis redoutables, comme Orochimaru, un puissant serpent ninja, et l'organisation criminelle Akatsuki. Ils doivent surmonter des épreuves mortelles et se battre pour protéger leurs proches. Pendant ce temps, Naruto cherche également à découvrir la vérité sur son passé et à devenir le Hokage, le chef de son village.
 
 Naruto est une histoire d'amitié profonde, de sacrifices et de persévérance. Les liens entre les personnages se renforcent au fil du temps, et ils apprennent à surmonter leurs propres démons intérieurs. Naruto lui-même doit affronter ses peurs, gérer sa propre nature démoniaque et chercher la reconnaissance de ceux qui l'ont autrefois rejeté.
 
 Avec des combats ninjas passionnants, des techniques de combat spectaculaires et des retournements de situation étonnants, Naruto est une saga qui vous transporte dans un monde où la volonté peut tout surmonter. Suivez Naruto dans sa quête pour devenir un ninja respecté, découvrir sa véritable identité et protéger ceux qui lui sont chers. Plongez-vous dans cette aventure pleine d'émotions, de camaraderie et de puissance, et découvrez pourquoi Naruto est devenu une référence incontournable dans le monde du manga et de l'anime.","1999-09-21","/pdf/Naruto T.1.pdf",6);
 INSERT INTO book(Book_Title,Book_Rating,Book_ImagePath,Book_Description,Book_PublicationDate,Book_Link,Book_Reservation) VALUES("Attack on Titan T.1",8.5,"https://m.media-amazon.com/images/I/91tYV+R03kL._AC_UF1000,1000_QL80_.jpg","Dans un monde cruel où l'humanité est aux abois, plongez dans l'univers captivant de Attack on Titan (Shingeki no Kyojin en japonais). Créée par Hajime Isayama, cette saga épique nous entraîne dans une bataille désespérée pour la survie.
 
 L'histoire se déroule dans un monde où d'énormes Titans, des créatures géantes mangeuses d'hommes, règnent en maîtres. Les derniers vestiges de l'humanité se sont retranchés derrière d'immenses murs pour échapper à leur menace constante. C'est dans ce contexte que nous suivons Eren Jaeger et ses compagnons, des soldats courageux prêts à tout pour protéger leur monde.
 
 Mais lorsque le mur d'enceinte est brisé par un Titan colossal, le destin d'Eren est bouleversé. Il rejoint les rangs de l'armée pour devenir un soldat d'élite, déterminé à venger la mort de sa mère et à détruire tous les Titans. Au fur et à mesure de leur combat, Eren et ses camarades découvrent de sombres secrets sur l'origine des Titans et sur le véritable enjeu de cette guerre.
 
 Attack on Titan est une saga intense et pleine de rebondissements. Les personnages sont confrontés à des dilemmes moraux, des trahisons et des révélations choquantes. La lutte pour la survie de l'humanité est ponctuée de scènes d'action brutales, où les combats contre les Titans sont viscéraux et captivants.
 
 Mais au-delà de l'action, Attack on Titan explore des thèmes profonds tels que la cruauté de la nature humaine, la quête de liberté et les sacrifices nécessaires pour protéger ceux qui sont chers. Plongez-vous dans cette aventure sombre et captivante, où l'humanité lutte désespérément pour sa survie face à des ennemis colossaux. Découvrez pourquoi Attack on Titan est devenu une référence incontournable dans le monde du manga et de l'anime.","2009-09-09","/pdf/Naruto T.1.pdf",5);
 INSERT INTO book(Book_Title,Book_Rating,Book_ImagePath,Book_Description,Book_PublicationDate,Book_Link,Book_Reservation) VALUES("Death Note T.1",8,"https://m.media-amazon.com/images/I/812k3BWrksL._AC_UF1000,1000_QL80_.jpg","Dans un monde où le pouvoir de vie et de mort est entre les mains d'un carnet, plongez dans l'univers captivant de Death Note. Créée par Tsugumi Ohba et Takeshi Obata, cette série fascinante explore les sombres implications de la justice et du pouvoir absolu.
 
 L'histoire se concentre sur Light Yagami, un brillant lycéen qui découvre un carnet mystérieux appelé le Death Note. Ce carnet confère à son propriétaire le pouvoir de tuer toute personne dont il connaît le visage et le nom. Poussé par un sens aigu de la justice, Light décide d'utiliser le Death Note pour éliminer les criminels et créer un monde libre de la corruption.
 
 Cependant, ses actions ne passent pas inaperçues. Un détective brillant et énigmatique, connu sous le nom de L, se lance à la poursuite de Light pour le stopper. S'ensuit un jeu psychologique intense entre les deux protagonistes, alors qu'ils tentent de découvrir l'identité de l'autre tout en manipulant les autres personnes autour d'eux.
 
 Death Note est une série qui explore les questions de morale, de justice et du pouvoir corrupteur de la vengeance. Les réflexions profondes sur la nature humaine et la frontière ténue entre le bien et le mal font de cette histoire un incontournable du manga et de l'anime.
 
 Avec son atmosphère sombre, ses retournements de situation saisissants et ses stratégies élaborées, Death Note captive les lecteurs et les spectateurs à chaque page et chaque épisode. Plongez dans ce récit captivant et découvrez où les choix moraux mèneront Light et L dans leur affrontement intellectuel haletant.","2003-12-01","/pdf/Naruto T.1.pdf",2);

INSERT INTO subscription(Subscription_Name, Subscription_Price, Subscription_Max_Book, Subscription_ImagePath) VALUES("rien",0,0,"");
INSERT INTO subscription(Subscription_Name, Subscription_Price, Subscription_Max_Book, Subscription_ImagePath) VALUES("Yamcha",3.99,3,"/images/abonnement1.png");
INSERT INTO subscription(Subscription_Name, Subscription_Price, Subscription_Max_Book, Subscription_ImagePath) VALUES("Piccolo",6.99,5,"/images/abonnement2.png");
INSERT INTO subscription(Subscription_Name, Subscription_Price, Subscription_Max_Book, Subscription_ImagePath) VALUES("Goku",9.99,100,"/images/abonnement3.png");

INSERT INTO authors(Author_Name, Author_Surname) VALUES ("Akira","Toriyama");
INSERT INTO authors(Author_Name, Author_Surname) VALUES ("Oda","Eiichirō");
INSERT INTO authors(Author_Name, Author_Surname) VALUES ("Masashi","Kishimoto");
INSERT INTO authors(Author_Name, Author_Surname) VALUES ("Hajime","Isayama");
INSERT INTO authors(Author_Name, Author_Surname) VALUES ("Tsugumi","Ohba");

INSERT INTO genre(Genre_Name) VALUES("Action");
INSERT INTO genre(Genre_Name) VALUES("Aventure");
INSERT INTO genre(Genre_Name) VALUES("Science Fiction");
INSERT INTO genre(Genre_Name) VALUES("Mystere");
INSERT INTO genre(Genre_Name) VALUES("Comedie");
INSERT INTO genre(Genre_Name) VALUES("Drame");
INSERT INTO genre(Genre_Name) VALUES("Fantasy");
INSERT INTO genre(Genre_Name) VALUES("Humour");
INSERT INTO genre(Genre_Name) VALUES("Thriller");
INSERT INTO genre(Genre_Name) VALUES("Horreur");

INSERT INTO writed(Id_Book, Id_Author) VALUES(1,1);
INSERT INTO writed(Id_Book, Id_Author) VALUES(2,2);
INSERT INTO writed(Id_Book, Id_Author) VALUES(3,3);
INSERT INTO writed(Id_Book, Id_Author) VALUES(4,4);
INSERT INTO writed(Id_Book, Id_Author) VALUES(5,5);

INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(1,1);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(1,2);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(1,3);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(1,5);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(1,8);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(2,2);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(2,5);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(2,6);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(2,7);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(2,8);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(3,1);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(3,6);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(4,4);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(4,9);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(4,10);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(5,4);
INSERT INTO belong_to(Id_Book, Id_Genre) VALUES(5,9);
