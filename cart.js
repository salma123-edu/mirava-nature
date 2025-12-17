
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===============================================
//  AFFICHAGE DU MINI PANIER
// ===============================================
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElem = document.getElementById("cart-count");
  const miniCartItems = document.getElementById("mini-cart-items");
  const miniCartTotal = document.getElementById("mini-cart-total");

  if (miniCartItems) miniCartItems.innerHTML = "";

  let totalQty = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalQty += item.qty;
    totalPrice += item.price * item.qty;

    if (miniCartItems) {
      const div = document.createElement("div");
      div.classList.add("mini-cart-item");
      div.innerHTML = `
        <span>${escapeHtml(item.name)}</span>
        <span>${item.qty} × ${item.price} MAD</span>
      `;
      miniCartItems.appendChild(div);
    }
  });

  if (countElem) countElem.textContent = totalQty;
  if (miniCartTotal)
    miniCartTotal.textContent = cart.length
      ? `Total : ${totalPrice} MAD`
      : "Panier vide";
}

window.updateCartUI = updateCartUI;

// ===============================================
//  AJOUT AU PANIER
// ===============================================
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

window.addToCart = addToCart;

// ===============================================
//  MINI PANIER AFFICHER / CACHER
// ===============================================
function initMiniCart() {
  const toggleBtn = document.getElementById("cart-toggle");
  const miniCart = document.getElementById("mini-cart");

  if (!toggleBtn || !miniCart) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    miniCart.style.display =
      miniCart.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!miniCart.contains(e.target) && !toggleBtn.contains(e.target)) {
      miniCart.style.display = "none";
    }
  });
}

// ===============================================
//  BOUTON PASSER LA COMMANDE SUR panier.html
// ===============================================
function initCheckoutButton() {
  const isCartPage = location.pathname.toLowerCase().includes("panier");
  if (!isCartPage) return;

  const container = document.querySelector("#cart") || document.body;

  const btn = document.createElement("button");
  btn.id = "checkout-btn";
  btn.textContent = "Passer la commande";
  btn.classList.add("add-btn");
  btn.style.marginTop = "16px";
  container.appendChild(btn);

  btn.addEventListener("click", async () => {
    const nom = prompt("Votre nom :");
    const email = prompt("Votre email :");
    const telephone = prompt("Votre téléphone :");
    const adresse = prompt("Votre adresse :");
    const modePaiement = "livraison";

    const panier = JSON.parse(localStorage.getItem("cart")) || [];

    if (!nom || !email || !telephone || !adresse || panier.length === 0) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    const total = panier.reduce(
      (t, p) => t + p.price * p.qty,
      0
    );

    try {
      const res = await fetch("http://localhost:5000/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          email,
          telephone,
          adresse,
          modePaiement,
          produits: panier,
          total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Commande enregistrée avec succès !");
        localStorage.removeItem("cart");
        updateCartUI();
        location.reload();
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      alert("Erreur de connexion : " + err.message);
    }
  });
}

// ===============================================
//  INITIALISATION GLOBALE
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
  initMiniCart();
  initCheckoutButton();
  updateCartUI();
});

window.addEventListener("storage", updateCartUI);
