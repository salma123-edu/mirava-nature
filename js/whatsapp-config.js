// WhatsApp Configuration pour MIRAVA NATURE
// IMPORTANT: Remplacez YOUR_WHATSAPP_NUMBER par votre vrai numéro WhatsApp
// Format: Code pays + numéro (sans espaces, sans +)
// Exemple pour le Maroc: '212612345678'

const WHATSAPP_CONFIG = {
    // Votre numéro WhatsApp Business (format: 212XXXXXXXXX pour le Maroc)
    businessNumber: '212642461561',

    // Message de bienvenue (optionnel)
    welcomeMessage: '🛍️ NOUVELLE COMMANDE - MIRAVA NATURE\n\n'
};

// Export pour utilisation dans d'autres fichiers
if (typeof window !== 'undefined') {
    window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
}
