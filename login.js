function form(){
   
        // Récupérer les valeurs des champs du formulaire
        var lname = document.getElementById("Lname").value;
        var fname = document.getElementById("Fname").value;
        var email = document.getElementById("Email").value;
        var pnumber = document.getElementById("Pnumber").value;
        var password = document.getElementById("Pswrd").value;
        var confirmPassword = document.getElementById("Cpswrd").value;
      
        // Afficher les valeurs dans la console
        console.log("Nom:", lname);
        console.log("Prénom:", fname);
        console.log("E-mail:", email);
        console.log("Téléphone:", pnumber);
        console.log("Mot de passe:", password);
        console.log("Confirmer mot de passe:", confirmPassword);
      }


function insertBDD(lname,fname,email,pnumber,password){
    let SQL = "INSERT INTO Users (Users_id) VALUES (1)" //C'est de la merde pour l'instant

}
      