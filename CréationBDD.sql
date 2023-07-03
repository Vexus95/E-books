CREATE TABLE Book(
   Id_Book INT AUTO_INCREMENT,
   Book_Title VARCHAR(50),
   Book_ImagePath VARCHAR(500),
   Book_Description VARCHAR(300),
   Book_PublicationDate DATE,
   Book_Link VARCHAR(50),
   Book_Reservation INt,
   PRIMARY KEY(Id_Book)
);

CREATE TABLE Subscription(
   Id_Subscription INT AUTO_INCREMENT,
   Subscription_Name VARCHAR(50),
   Subscription_Price INT,
   Subscription_Max_Books INT,
   PRIMARY KEY(Id_Subscription)
);

CREATE TABLE Authors(
   Id_Author INT AUTO_INCREMENT,
   Author_Name VARCHAR(50),
   Author_Surname VARCHAR(50),
   PRIMARY KEY(Id_Author)
);

CREATE TABLE Genre(
   Id_Genre INT AUTO_INCREMENT,
   Genre_Name VARCHAR(50),
   PRIMARY KEY(Id_Genre)
);

CREATE TABLE Users(
   Users_id INT AUTO_INCREMENT,
   Users_LastName VARCHAR(50),
   Users_FirstName VARCHAR(50),
   Users_Mail VARCHAR(50),
   Users_Phonenumber VARCHAR(50),
   Users_Password VARCHAR(50),
   Is_Admin boolean,
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

CREATE TABLE Writed(
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