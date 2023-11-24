const express = require('express');
const cors = require('cors');
const app = express();
const appPort = 3000;

app.use(cors());

app.listen(appPort, () => {
    console.log(`Ton server nodeJS CatsEye a démarré sur le http://localhost:${appPort}`);
});

// *** Connection à la base de donnée ***
const mysql = require('mysql2');
const datacnx = require('./databaseConnexion.json'); // ajoute tes informations de connexion dans le fichier databaseConnexion.json.
const { host, port, user, password, database } = datacnx.database;
const db = mysql.createConnection({ host, port, user, password, database });

if (host != "" && port != "" && user != "" && password != "" && database != "") {
    db.connect(err => {
        if (err) {
            console.log(err, 'dberr');
            process.exit(err);
        } else { console.log(`Tu es connecté à la base de données: ${database} ... GOOD JOB !`); }
    });
} else {
    console.log("FATAL ERROR:", "T'as oublié quelque chose !? - Ton fichier de connexion n'est pas correcte. :( ");
    process.exit(1);
}

// EXEMPLE de requête intégrée
app.get('/', (req, res) => {
    // Voici un exemple de requête intégrer au code.
    // Cette requête retourne les informations de la table paramétres.
    let qr = `SELECT p.id, p.keyword, p.value FROM catsEye.parametres p;`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'err');
        }
        if (result.length > 0) {
            res.send({
                message: 'Liste des informations de la table parametres',
                data: result
            });
        } else {
            res.send({
                message: `Il n'y a aucun paramètre à afficher`,
            });
        }
    });
});

app.get('/listeMateriels', (req, res) => {
    // Ajoute ta requête SQL entre les quotes ` =>[Alt Gr + 7]
    let qr = `SELECT code, marque, modele, prixAchat FROM catsEye.materiels order by prixAchat asc;`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'err');
        }
        if (result.length > 0) {
            res.send({
                message: 'Materiels ordonnés par prix croissant',
                data: result
            });
        } else {
            res.send({
                message: `Il n'y a aucun matériel à afficher`,
            });
        }
    });
});

//2) Liste des ahérents ordonnés par nom et prénom: id, nom, prenom, mail
app.get('/listeAdherents', (req, res) => {
    // Ajoute ta requete SQL entre les quotes => [Alt Gr+ 7]
    let qr = `Select id, nom,prenom, mail From catsEye.adherents order by nom and prenom;`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'err');
        }
        if (result.length > 0) {
            res.send({
                message: 'Liste des adhérents ordonnés par nom et prénom',
                data: result


            });
        } else {
            res.send({
                message: `Il n'y a aucun adhérent à afficher`,
            });
        }
    });
});

// Bonus : Fournir le chemin et le nom du logo.
app.get('/retrieveSourceImages', (req, res) => {
    // Ajoute ta requête SQL entre les quotes ` => [Alt Gr + 7]
    let qr = `Select value from parametres where keyword = 'logo'or keyword='cheminImage';`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'err');
        }
        if (result.length > 0) {
            res.send({
                message: 'retourne le chemin du logo',
                data: result
            });
        } else {
            res.send({
                message: `Il n'y a rien à afficher`,
            });
        }
    });
});

// *** EXERCICES 2 - PROJECTIONS AVEC PARAMETRES ***
//3) Détail pour un adhérents, sélectionné d'aprés sont id. : id, dateCreation, nom, prenom, dateNaissance, mail, telephone, mobile, adresse, ville
app.get('/detailAdherents/:id', (req, res) => {
    let gId = req.params.id;
    // Ajoute ta requête SQL entre les quotes ` => [Alt Gr + 7]
    let qr = `SELECT id, dateCreation,nom, prenom, dateNaissance,mail,telephone,mobile,adresse,ville
    FROM catsEye.adherents
    Where id=\'${gId}\ ;`;

    db.query(qr, (err, result) => {
        if (err) {
            console.log(err, 'err');
        }
        if (result.length > 0) {
            res.send({
                message: 'Détail d\'un adhérent',
                data: result
            });
        } else {
            res.send({
                message: `Il n'y a aucun adhérent avec un ID = ${gId}`,
            });
        }
    });
});
