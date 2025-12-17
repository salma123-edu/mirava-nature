const allKits = {
  "decouverte-essentiels": {
    id: "decouverte-essentiels",
    name: "Coffret Découverte - Essentiels",
    price: 280,
    image: "https://picsum.photos/seed/kit-decouverte/800/500",
    short_description: "Petit coffret pour tester nos essentiels",
    contents: ["gommage-levres", "savon-artisanal", "brume-oreiller"]
  },
  "relaxation-complete": {
    id: "relaxation-complete",
    name: "Coffret Relaxation",
    price: 420,
    image: "https://picsum.photos/seed/kit-relaxation/800/500",
    short_description: "Bougie, sels de bain et huile de massage",
    contents: ["sels-de-bain", "bougie-massage", "huile-corps"]
  },
  "coffret-sommeil": {
    id: "coffret-sommeil",
    name: "Coffret Sommeil Doux",
    price: 260,
    image: "https://picsum.photos/seed/kit-sommeil/800/500",
    short_description: "Favorise un sommeil réparateur",
    contents: ["brume-oreiller", "roll-on-detente"]
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = allKits;
}