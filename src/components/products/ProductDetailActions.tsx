import { useState } from 'react';
import { Minus, Plus, ShoppingBasket } from 'lucide-react';
import type { Product } from '@/types/ecommerce';
import { addProduct } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

export default function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const unavailable = product.price === null || product.availability === 'unavailable';
  const max = product.stock ?? Number.MAX_SAFE_INTEGER;

  return (
    <div className="border-t border-ink/15 pt-6">
      <p className="font-display text-3xl text-ink">{formatPrice(product.price)}</p>
      <p className="mt-1 text-sm text-ink/55">{product.presentation || 'Presentación por confirmar'}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center border border-ink/20">
          <button className="quantity-button !size-11" type="button" disabled={quantity <= 1} aria-label="Reducir cantidad" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button>
          <span className="min-w-9 text-center text-sm tabular-nums">{quantity}</span>
          <button className="quantity-button !size-11" type="button" disabled={quantity >= max || unavailable} aria-label="Aumentar cantidad" onClick={() => setQuantity(Math.min(max, quantity + 1))}><Plus size={15} /></button>
        </div>
        <button className="button-primary min-h-12 flex-1" type="button" disabled={unavailable} onClick={() => { addProduct(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>
          <ShoppingBasket size={18} /> {added ? 'Añadido a tu cesta' : unavailable ? 'Oferta no disponible' : 'Añadir a la cesta'}
        </button>
      </div>
      {product.availability === 'open' && <p className="mt-3 text-xs text-leaf">Oferta abierta; la cantidad se confirma con el productor.</p>}
      {product.availability === 'limited' && product.stock !== null && <p className="mt-3 text-xs text-clay">Quedan {product.stock} unidades según la oferta.</p>}
    </div>
  );
}