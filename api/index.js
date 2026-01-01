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
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // <-- ajouté
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Variable pour le cache de la connexion (Vercel Serverless behavior)
let cachedConnection = null;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (cachedConnection) {
        try {
            await cachedConnection;
            return mongoose.connection;
        } catch (e) {
            cachedConnection = null;
        }
    }

    // Recherche de l'URI dans les variables d'environnement (supporte MONGO_URI et MONGODB_URI)
    const localUri = "mongodb://localhost:27017/mirava_nature";
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || localUri;

    const isLocal = uri === localUri;
    // Masquage du mot de passe pour les logs
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "// $1:****@");
    console.log(`Tentative de connexion MongoDB (${isLocal ? 'LOCALE' : 'DISTANTE'}) : ${maskedUri}`);

    // On stocke la promesse de connexion pour éviter des appels multiples
    cachedConnection = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Échoue après 5s si le serveur est injoignable
        bufferCommands: false, // Désactive le buffering pour avoir des erreurs immédiates si non connecté
    });

    try {
        await cachedConnection;
        console.log(`DB ${isLocal ? 'LOCALE' : 'DISTANTE'} connectée avec succès`);
        return mongoose.connection;
    } catch (error) {
        cachedConnection = null;
        console.error(`ÉCHEC Connexion MongoDB (${isLocal ? 'LOCALE' : 'DISTANTE'}):`, error.message);
        throw error;
    }
}

// Connexion d'amorçage
connectToDatabase().catch(err => console.error("Initial connection failed:", err.message));

// --- AUTHENTIFICATION ---

app.post('/api/auth/login', async (req, res) => {
    const { username, email, password } = req.body;

    // --- LOGIN ADMIN (username) ---
    if (username) {
        const validUser = process.env.ADMIN_USERNAME || 'admin';
        const validPass = process.env.ADMIN_PASSWORD || 'salma2004';

        if (username === validUser && password === validPass) {
            const secret = 'super_secret_mirava_2025';
            const token = jwt.sign({ username: username, role: 'admin' }, secret, { expiresIn: '8h' });
            return res.json({ success: true, token: token, role: 'admin' });
        }
    }

    // --- LOGIN CLIENT (email) ---
    if (email) {
        try {
            await connectToDatabase();
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, message: "Utilisateur non trouvé" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
            }

            const secret = 'super_secret_mirava_2025';
            const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '24h' });
            return res.json({
                success: true,
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
        }
    }

    res.status(401).json({ success: false, message: "Identifiants incorrects" });
});

// Route d'inscription
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await connectToDatabase();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Cet e-mail est déjà utilisé." });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Compte créé avec succès ! Connectez-vous maintenant." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de l'inscription.", error: error.message });
    }
});

// Route pour récupérer les infos de l'utilisateur connecté
app.get('/api/auth/me', protect, async (req, res) => {
    try {
        await connectToDatabase();
        // Si c'est l'admin (basé sur le token username)
        if (req.authData.username === 'admin') {
            return res.json({ success: true, user: { name: 'Administrateur', role: 'admin' } });
        }

        const user = await User.findById(req.authData.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

// Route pour synchroniser le panier
app.post('/api/auth/cart', protect, async (req, res) => {
    const { cart } = req.body;
    try {
        await connectToDatabase();
        if (req.authData.role === 'admin') {
            return res.status(403).json({ success: false, message: "L'admin n'a pas de panier." });
        }

        await User.findByIdAndUpdate(req.authData.userId, { cart: cart });
        res.json({ success: true, message: "Panier synchronisé." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur de synchronisation", error: error.message });
    }
});

// Middleware de protection des routes
function protect(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        const secret = 'super_secret_mirava_2025';
        jwt.verify(bearerToken, secret, (err, authData) => {
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
        await connectToDatabase(); // Connexion DB garantie

        const { statut, search, page = 1, limit = 10 } = req.query; // Récupère le statut, la recherche et la pagination
        const filter = {};
        // ... rest of the code is unchanged until the catch block
        if (statut) {
            filter.statut = statut;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
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

        const totalOrders = await Commande.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / options.limit);

        const commandes = await Commande.find(filter)
            .sort(options.sort)
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        res.status(200).json({ success: true, data: commandes, pagination: { page: options.page, totalPages, totalOrders } });
    } catch (error) {
        console.error("Erreur GET commandes:", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des commandes.", error: error.message });
    }
});

// Route pour créer une nouvelle commande
app.post('/api/commandes', async (req, res) => {
    console.log("Reçu POST /api/commandes");
    console.log("Body:", JSON.stringify(req.body));

    try {
        await connectToDatabase(); // S'assurer que la base est bien connectée

        const { nom, email, telephone, adresse, modePaiement, produits, total, frais_livraison } = req.body;

        // Créer une nouvelle instance de commande
        const nouvelleCommande = new Commande({
            nom,
            email,
            telephone,
            adresse,
            modePaiement,
            produits,
            frais_livraison: frais_livraison || 0,
            total
        });

        // Sauvegarder la commande dans la base de données
        const commandeSauvegardee = await nouvelleCommande.save();
        console.log("Commande OK (v2.2) ID:", commandeSauvegardee._id);
        res.status(201).json({
            success: true,
            version: "2.3",
            orderId: commandeSauvegardee._id,
            message: "Commande enregistrée ! 🎉"
        });
    } catch (error) {
        console.error("Erreur SAVE commande:", error);
        res.status(400).json({ success: false, message: "Erreur lors de l'enregistrement de la commande.", error: error.message });
    }
});

// Route pour supprimer une commande par son ID
app.delete('/api/commandes/:id', protect, async (req, res) => {
    try {
        await connectToDatabase();
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
        await connectToDatabase();
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
