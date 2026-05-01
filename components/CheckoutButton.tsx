"use client";

import { useState } from "react";

export function CheckoutButton({ product, selectedSize }: { product: any, selectedSize: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!selectedSize) {
      alert("Veuillez sélectionner une taille.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          size: selectedSize
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (e) {
      alert("Erreur de connexion.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="mt-6 w-full bg-nafe-blue text-white font-display uppercase tracking-widest px-4 py-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
    >
      {loading ? "Chargement..." : "Acheter Maintenant"}
    </button>
  );
}
