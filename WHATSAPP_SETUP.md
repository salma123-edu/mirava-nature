# 📱 Configuration WhatsApp - MIRAVA NATURE

## Guide Simple de Configuration

### Étape 1 : Obtenir votre numéro WhatsApp

Vous avez besoin de votre numéro WhatsApp Business au format international.

**Format requis :** Code pays + numéro (sans espaces, sans +, sans tirets)

**Exemples :**
- 🇲🇦 Maroc : `212612345678` (pour +212 6 12 34 56 78)
- 🇫🇷 France : `33612345678` (pour +33 6 12 34 56 78)
- 🇩🇿 Algérie : `213612345678` (pour +213 6 12 34 56 78)

---

### Étape 2 : Configurer le fichier

1. Ouvrez le fichier `js/whatsapp-config.js`
2. Remplacez `YOUR_WHATSAPP_NUMBER` par votre vrai numéro
3. Sauvegardez le fichier

**Exemple :**
```javascript
const WHATSAPP_CONFIG = {
  businessNumber: '212612345678',  // ← Votre numéro ici
  welcomeMessage: '🛍️ NOUVELLE COMMANDE - MIRAVA NATURE\n\n'
};
```

---

### Étape 3 : Tester

1. Ouvrez votre site web
2. Ajoutez des produits au panier
3. Allez sur la page de commande
4. Remplissez le formulaire
5. Cliquez sur **"Confirmer la commande"**
6. WhatsApp s'ouvre avec le message pré-rempli
7. Cliquez sur **"Envoyer"** dans WhatsApp
8. Vous recevez la commande sur votre WhatsApp ! 🎉

---

## 🎯 Comment ça fonctionne ?

1. Le client remplit le formulaire de commande
2. Il clique sur "Confirmer la commande"
3. **WhatsApp s'ouvre automatiquement** avec un message contenant :
   - Informations du client
   - Liste des produits commandés
   - Montant total
   - ID de commande
4. Le client clique sur "Envoyer"
5. **Vous recevez la commande instantanément sur votre WhatsApp** 📱

---

## ✅ Avantages

- ✅ **100% Gratuit** - Pas de frais
- ✅ **Instantané** - Vous recevez les commandes immédiatement
- ✅ **Simple** - Juste votre numéro WhatsApp
- ✅ **Fiable** - WhatsApp est toujours disponible
- ✅ **Pas de configuration compliquée** - Contrairement à EmailJS
- ✅ **Fonctionne partout** - Mobile et Desktop

---

## 📱 Format du Message

Voici à quoi ressemble le message que vous recevrez :

```
🛍️ NOUVELLE COMMANDE - MIRAVA NATURE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Nom: Salma El Amrani
📧 Email: salma@example.com
📱 Téléphone: 0612345678
📍 Adresse: 123 Rue Mohammed V, Rabat

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛒 DÉTAILS DE LA COMMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Huile d'Argan Bio 50ml
  Qté: 2 × 150 DH = 300.00 DH
• Savon Noir Naturel
  Qté: 1 × 80 DH = 80.00 DH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 TOTAUX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sous-total: 380.00 DH
Frais de livraison: 30.00 DH
─────────────────────────────
TOTAL: 410.00 DH

💳 Mode de paiement: Paiement à la livraison 🚚

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 ID Commande: MN-1736105225000-A3B9C
📅 Date: 05/01/2026, 20:40
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ❓ Dépannage

### Le message d'avertissement apparaît
**Problème :** "⚠️ WhatsApp n'est pas encore configuré"

**Solution :** 
- Ouvrez `js/whatsapp-config.js`
- Remplacez `YOUR_WHATSAPP_NUMBER` par votre vrai numéro
- Sauvegardez et rechargez la page

### WhatsApp ne s'ouvre pas
**Possible causes :**
- WhatsApp n'est pas installé sur l'appareil
- Le navigateur bloque les pop-ups

**Solution :**
- Sur mobile : Installez WhatsApp
- Sur desktop : Autorisez les pop-ups pour votre site

### Je ne reçois pas les messages
**Vérifiez :**
- Votre numéro est au bon format (212XXXXXXXXX)
- WhatsApp est bien installé et connecté
- Le client a bien cliqué sur "Envoyer" dans WhatsApp

---

## 💡 Conseils

1. **Utilisez WhatsApp Business** pour une meilleure gestion
2. **Créez des réponses rapides** pour répondre aux commandes
3. **Activez les notifications** pour ne rien manquer
4. **Organisez vos conversations** avec des étiquettes

---

## 🆚 WhatsApp vs EmailJS

| Critère | WhatsApp | EmailJS |
|---------|----------|---------|
| Configuration | ✅ Simple (juste un numéro) | ❌ Complexe (compte, template, clés) |
| Coût | ✅ Gratuit | ⚠️ Limité (200/mois) |
| Réception | ✅ Instantané | ⚠️ Peut aller dans spam |
| Fiabilité | ✅ 100% | ⚠️ Dépend de la config |
| Notification | ✅ Sur téléphone | ❌ Email uniquement |

---

**C'est tout ! Profitez de vos commandes WhatsApp ! 🚀**
