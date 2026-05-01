"use client";

import { useState } from "react";
import { CheckoutButton } from "./CheckoutButton";

export function ProductCard({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "");

  return (
    <div className="nafe-clip-card bg-nafe-surface/60 border border-white/5 p-6 hover:border-nafe-blue/40 transition-colors flex flex-col">
      <div className="aspect-square bg-black/50 mb-6 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-steel-grey">Image Produit</span>
        )}
      </div>
      
      <p className="font-display text-2xl font-bold mb-2 flex-grow">{product.name}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-nafe-blue">{product.price} €</span>
        <div className="flex gap-2">
          {product.sizes.map((size: string) => (
            <button 
              key={size} 
              onClick={() => setSelectedSize(size)}
              className={`text-[10px] font-mono border px-2 py-1 transition-colors ${selectedSize === size ? 'border-nafe-blue text-nafe-blue' : 'border-white/20 text-white hover:border-white/50'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <CheckoutButton product={product} selectedSize={selectedSize} />
    </div>
  );
}
