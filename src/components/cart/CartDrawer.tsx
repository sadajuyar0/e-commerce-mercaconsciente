import { useStore } from '@nanostores/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cartStore, cartSubtotal, removeProduct, updateQuantity } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';
import { withBase } from '@/utils/paths';

export default function CartDrawer() {
  const items = useStore(cartStore);
  const subtotal = cartSubtotal(items);

  if (!items.length) {
    return <div className="py-16 text-center"><p className="font-display text-3xl text-ink">Tu cesta está esperando</p><p className="mt-3 text-sm text-ink/60">Explora la oferta de productores locales para empezar.</p><a className="button-primary mt-7" href={withBase('/shop')}>Ir a la tienda <span aria-hidden="true">→</span></a></div>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="divide-y divide-ink/15 border-y border-ink/15">
        {items.map((item) => (
          <article key={item.productId} className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
            <img className="aspect-square size-[76px] rounded-sm object-cover sm:size-[104px]" src={item.image} alt="" width="900" height="900" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-leaf">{item.producer}</p>
              <a href={withBase(`/product/${item.productId}`)} className="mt-1 block font-display text-lg leading-tight text-ink hover:text-leaf">{item.name}</a>
              <p className="mt-1 text-xs text-ink/55">{item.presentation || 'Presentación por confirmar'}</p>
              <p className="mt-2 text-sm font-semibold text-ink sm:hidden">{formatPrice(item.price * item.quantity)}</p>
            </div>
            <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:flex-col sm:items-end">
              <div className="flex items-center border border-ink/15">
                <button type="button" className="quantity-button" aria-label={`Reducir ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus size={14} /></button>
                <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">{item.quantity}</span>
                <button type="button" className="quantity-button" aria-label={`Aumentar ${item.name}`} disabled={item.stock !== null && item.quantity >= item.stock} onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus size={14} /></button>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden whitespace-nowrap text-sm font-semibold text-ink sm:inline">{formatPrice(item.price * item.quantity)}</span>
                <button type="button" className="icon-button !size-9 text-clay" title={`Eliminar ${item.name}`} aria-label={`Eliminar ${item.name}`} onClick={() => removeProduct(item.productId)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-fit border-t-2 border-ink pt-5 lg:sticky lg:top-8">
        <h2 className="font-display text-2xl text-ink">Resumen</h2>
        <div className="mt-5 flex justify-between gap-4 text-sm"><span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
        <p className="mt-3 text-xs leading-5 text-ink/55">El envío se coordina al confirmar. Este catálogo no cobra en línea.</p>
        <a className="button-primary mt-6 w-full" href={withBase('/checkout')}>Continuar con el pedido <span aria-hidden="true">→</span></a>
      </aside>
    </div>
  );
}