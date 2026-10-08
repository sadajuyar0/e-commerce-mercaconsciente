import { ArrowUpRight, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types/ecommerce';
import { addProduct } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const unavailable = product.availability === 'unavailable' || product.price === null;

  return (
    <article className="product-card group">
      <a href={`/product/${product.id}`} className="product-image-link" aria-label={`Ver ${product.name}`}>
        <img className="product-image" src={product.image} alt={`Imagen de referencia para ${product.name}`} loading="lazy" width="900" height="900" />
        <span className="image-note">Imagen de referencia</span>
      </a>
      <div className="flex min-h-[176px] flex-col px-4 pb-4 pt-4 sm:px-5">
        <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-leaf">
          <span className="truncate">{product.producer}</span>
          <span className="whitespace-nowrap text-ink/50">{product.availability === 'open' ? 'Por encargo' : product.availability === 'limited' ? 'Temporada' : 'Consultar'}</span>
        </div>
        <a href={`/product/${product.id}`} className="line-clamp-2 font-display text-[19px] leading-[1.18] text-ink hover:text-leaf">{product.name}</a>
        <p className="mt-2 line-clamp-1 text-xs text-ink/55">{product.presentation || 'Presentación por confirmar'}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <span className="font-semibold text-ink">{formatPrice(product.price)}</span>
          <button className="icon-button !size-10 !border-leaf/20 !bg-white hover:!bg-leaf hover:!text-white disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={unavailable} onClick={() => addProduct(product)} aria-label={`Añadir ${product.name} al carrito`} title={unavailable ? 'Precio o disponibilidad por confirmar' : 'Añadir al carrito'}>
            {unavailable ? <ShoppingBag size={18} /> : <Plus size={19} />}
          </button>
        </div>
      </div>
      <a className="sr-only" href={`/product/${product.id}`} aria-label={`Más información sobre ${product.name}`}><ArrowUpRight /></a>
    </article>
  );
}