const checkoutBtn = document.createElement("button");
checkoutBtn.id = "checkout-btn";
checkoutBtn.textContent = "Passer la commande";
document.querySelector("#cart").appendChild(checkoutBtn);

checkoutBtn.addEventListener("click", async () => {
  const nom = prompt("Votre nom:");
  const email = prompt("Votre email:");

  const panier = JSON.parse(localStorage.getItem("cart")) || [];

  if (!nom || !email || panier.length === 0) {
    alert("Nom, email et panier sont requis !");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/commande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, panier }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Commande enregistrée avec succès !");
      localStorage.removeItem("cart");
      location.reload();
    }
  } catch (err) {
    alert("Erreur : " + err.message);
  }
});

