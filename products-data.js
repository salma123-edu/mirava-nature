const allProducts = {
  "gommage-levres": {
    id: "gommage-levres",
    name: "Gommage Lèvres",
    price: 80,
    image: "https://picsum.photos/seed/gommage-levres/800/800",
    short_description: "Douceur et hydratation"
  },
  "sels-de-bain": {
    id: "sels-de-bain",
    name: "Sels de bain",
    price: 120,
    image: "https://picsum.photos/seed/sels-de-bain/800/800",
    short_description: "Relaxation parfumée"
  },
  "bougie-massage": {
    id: "bougie-massage",
    name: "Bougie massage",
    price: 150,
    image: "https://picsum.photos/seed/bougie-massage/800/800",
    short_description: "Chaleur & soin"
  },
  "brume-oreiller": {
    id: "brume-oreiller",
    name: "Brume d'oreiller",
    price: 90,
    image: "https://picsum.photos/seed/brume-oreiller/800/800",
    short_description: "Sommeil apaisé"
  },
  "roll-on-detente": {
    id: "roll-on-detente",
    name: "Roll-on détente",
    price: 70,
    image: "https://picsum.photos/seed/roll-on-detente/800/800",
    short_description: "Anti-stress naturel"
  },

  // Nouveaux produits
  "huile-corps": {
    id: "huile-corps",
    name: "Huile de corps nourrissante",
    price: 140,
    image: "https://picsum.photos/seed/huile-corps/800/800",
    short_description: "Peau douce et satinée",
    long_description: "Mélange d'huiles végétales bio pour nourrir et sublimer la peau."
  },
  "savon-artisanal": {
    id: "savon-artisanal",
    name: "Savon artisanal",
    price: 45,
    image: "https://picsum.photos/seed/savon-artisanal/800/800",
    short_description: "Nettoie en douceur",
    long_description: "Savon surgras préparé à froid, parfum naturel et mousse crémeuse."
  },
  "serum-visage": {
    id: "serum-visage",
    name: "Sérum visage régénérant",
    price: 220,
    image: "https://picsum.photos/seed/serum-visage/800/800",
    short_description: "Éclat et hydratation",
    long_description: "Sérum concentré en actifs végétaux pour revitaliser le teint."
  },
  "masque-argile": {
    id: "masque-argile",
    name: "Masque à l'argile",
    price: 65,
    image: "https://picsum.photos/seed/masque-argile/800/800",
    short_description: "Purifiant et doux",
    long_description: "Argiles sélectionnées pour absorber les impuretés sans dessécher."
  },
  "beurre-corporel": {
    id: "beurre-corporel",
    name: "Beurre corporel au karité",
    price: 160,
    image: "https://picsum.photos/seed/beurre-corporel/800/800",
    short_description: "Nutrition intense",
    long_description: "Beurre riche pour peaux sèches, fondant et protecteur."
  }
};

// Exporter les données pour utilisation côté Node si besoin
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = allProducts;
}