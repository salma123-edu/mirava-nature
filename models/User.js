const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis."]
    },
    email: {
        type: String,
        required: [true, "L'e-mail est requis."],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis."]
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    cart: [{
        id: String,
        name: String,
        qty: Number,
        price: Number,
        image: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
