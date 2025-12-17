const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition de la structure d'une commande
const CommandeSchema = new Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis."]
    },
    email: {
        type: String,
        required: [true, "L'e-mail est requis."]
    },
    telephone: {
        type: String,
        required: [true, "Le téléphone est requis."]
    },
    adresse: {
        type: String,
        required: [true, "L'adresse est requise."]
    },
    modePaiement: {
        type: String,
        required: [true, "Le mode de paiement est requis."]
    },
    produits: [{
        name: String,
        qty: Number,
        price: Number
    }],
    total: {
        type: Number,
        required: true
    },
    dateCommande: {
        type: Date,
        default: Date.now
    },
    statut: {
        type: String,
        enum: ['En attente', 'En cours de préparation', 'Expédiée', 'Annulée'],
        default: 'En attente'
    }
});

module.exports = mongoose.model('Commande', CommandeSchema);