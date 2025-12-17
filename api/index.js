const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); // <-- ajouté
// Importer le modèle de commande
const Commande = require('../Commande.js');
const Contact = require('../contact.js'); // <--- ajout

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));

// --- AUTHENTIFICATION ---

// Route de connexion
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Fallback aux identifiants par défaut si les variables d'env ne sont pas définies sur Vercel
    const validUser = process.env.ADMIN_USERNAME || 'admin';
    const validPass = process.env.ADMIN_PASSWORD || 'salma2004';

    if (username === validUser && password === validPass) {
        // Créer un token
        const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
        const token = jwt.sign({ username: username }, secret, { expiresIn: '8h' });
        res.json({ success: true, token: token });
    } else {
        res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }
});

// Middleware de protection des routes
function protect(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

// --- FIN AUTHENTIFICATION ---


// Route pour récupérer toutes les commandes
app.get('/api/commandes', protect, async (req, res) => {
    try {
        const { statut, search, page = 1, limit = 10 } = req.query; // Récupère le statut, la recherche et la pagination
        const filter = {};

        if (statut) {
            filter.statut = statut; // Ajoute le statut au filtre s'il est fourni
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i'); // 'i' pour insensible à la casse
            filter.$or = [
                { nom: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ];
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { dateCommande: -1 }
        };

        // Compter le nombre total de documents avec le filtre
        const totalOrders = await Commande.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / options.limit);

        // Récupérer toutes les commandes de la base de données, triées par date (la plus récente en premier)
        const commandes = await Commande.find(filter)
            .sort(options.sort)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        res.status(200).json({ success: true, data: commandes, pagination: { page: options.page, totalPages, totalOrders } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des commandes.", error: error.message });
    }
});

// Route pour créer une nouvelle commande
app.post('/api/commandes', async (req, res) => {
    try {
        const { nom, email, telephone, adresse, modePaiement, produits, total } = req.body;

        // Créer une nouvelle instance de commande
        const nouvelleCommande = new Commande({
            nom,
            email,
            telephone,
            adresse,
            modePaiement,
            produits,
            total
        });

        // Sauvegarder la commande dans la base de données
        const commandeSauvegardee = await nouvelleCommande.save();
        res.status(201).json({ success: true, message: "Commande enregistrée avec succès !", data: commandeSauvegardee });
    } catch (error) {
        res.status(400).json({ success: false, message: "Erreur lors de l'enregistrement de la commande.", error: error.message });
    }
});

// Route pour supprimer une commande par son ID
app.delete('/api/commandes/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide pour MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID de commande invalide." });
        }

        const commandeSupprimee = await Commande.findByIdAndDelete(id);

        if (!commandeSupprimee) {
            return res.status(404).json({ success: false, message: "Commande non trouvée." });
        }

        res.status(200).json({ success: true, message: "Commande supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la suppression de la commande.", error: error.message });
    }
});

// Route pour modifier le statut d'une commande
app.patch('/api/commandes/:id/statut', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID de commande invalide." });
        }

        const statutsValides = ['En attente', 'En cours de préparation', 'Expédiée', 'Annulée'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ success: false, message: "Statut non valide." });
        }

        const commandeMiseAJour = await Commande.findByIdAndUpdate(
            id,
            { statut: statut },
            { new: true } // Renvoie le document mis à jour
        );

        if (!commandeMiseAJour) {
            return res.status(404).json({ success: false, message: "Commande non trouvée." });
        }

        res.status(200).json({ success: true, message: "Statut mis à jour avec succès.", data: commandeMiseAJour });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du statut.", error: error.message });
    }
});

// Route pour recevoir les messages de contact / précommande
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Champs manquants.' });
        }
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ success: true, message: 'Message reçu. Merci !' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur.', error: err.message });
    }
});
// Lancement du serveur (uniquement si exécuté directement, pas via Vercel)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
        console.log(`Ouvrir dans le navigateur : http://localhost:${port}/acceuil.html`);
    });
}

module.exports = app;
