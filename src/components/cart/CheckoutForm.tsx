import { useEffect, useState } from 'react';
import { ArrowRight, Check, Clipboard, Copy, LoaderCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { cartStore, cartSubtotal, clearCart } from '@/store/cartStore';
import type { Order } from '@/types/ecommerce';
import { formatPrice } from '@/utils/format';
import { withBase } from '@/utils/paths';

const ORDER_KEY = 'mercaconsciente-last-order-v1';

function createOrderCode(): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MC-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${suffix}`;
}

export default function CheckoutForm() {
  const items = useStore(cartStore);
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length) return;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(ORDER_KEY) ?? 'null');
      if (stored && typeof stored === 'object' && 'code' in stored && 'items' in stored && Array.isArray(stored.items)) {
        setOrder(stored as Order);
      }
    } catch {
      localStorage.removeItem(ORDER_KEY);
    }
  }, [items.length]);

  function submitOrder(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    if (!items.length) return setError('Tu cesta está vacía. Añade al menos un producto para continuar.');
    const data = new FormData(event.currentTarget);
    const nextOrder: Order = {
      code: createOrderCode(),
      status: 'pending_payment',
      customerName: String(data.get('name') ?? '').trim(),
      customerPhone: String(data.get('phone') ?? '').trim(),
      deliveryAddress: String(data.get('address') ?? '').trim(),
      items: items.map((item) => ({ ...item })),
      total: cartSubtotal(items),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(ORDER_KEY, JSON.stringify(nextOrder));
    clearCart();
    setOrder(nextOrder);
  }

  async function copyCode() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('No se pudo copiar el código automáticamente. Selecciónalo para copiarlo.');
    }
  }

  if (order) {
    return (
      <div className="max-w-2xl border-y-2 border-ink py-8 sm:py-10">
        <div className="grid size-12 place-items-center rounded-full bg-leaf text-white"><Check size={23} /></div>
        <p className="eyebrow mt-6">Pedido registrado en esta demo</p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Gracias, {order.customerName.split(' ')[0]}.</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">Tu pedido queda como <strong>pendiente de pago</strong>. Esta referencia se guardó solo en este navegador; no se envió a un servidor.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 border border-ink/15 bg-white p-4">
          <span className="mr-auto text-[11px] font-semibold uppercase tracking-[.1em] text-ink/55">Referencia de pedido</span>
          <code className="font-mono text-lg font-bold text-ink">{order.code}</code>
          <button className="icon-button !size-10" type="button" onClick={copyCode} aria-label="Copiar referencia" title="Copiar referencia">{copied ? <Check size={17} /> : <Copy size={17} />}</button>
        </div>
        <div className="mt-8 border-l-2 border-clay bg-[#efede4] p-5 sm:p-6">
          <h3 className="font-display text-xl text-ink">Pago manual</h3>
          <p className="mt-2 text-sm leading-6 text-ink/70">Los datos reales de cuenta o llave Bre-B todavía no fueron definidos. No realices una transferencia usando esta demo. Cuando se habilite el pago, la referencia anterior permitirá identificar tu pedido.</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-clay"><Clipboard size={16} /> Guarda la referencia: {order.code}</p>
        </div>
        <div className="mt-8 border-t border-ink/15 pt-5">
          <h3 className="font-display text-xl text-ink">Resumen</h3>
          <ul className="mt-4 divide-y divide-ink/10">{order.items.map((item) => <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} <span className="text-ink/55">× {item.quantity} · {item.producer}</span></span><span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span></li>)}</ul>
          <div className="mt-3 flex justify-between border-t border-ink/15 pt-4 font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
        {error && <p className="mt-4 text-sm text-clay" role="alert">{error}</p>}
        <a className="button-primary mt-7" href={withBase('/shop')}>Volver a la tienda <ArrowRight size={16} /></a>
      </div>
    );
  }

  if (!items.length) {
    return <div className="border-y border-ink/15 py-10"><p className="font-display text-2xl text-ink">Aún no hay productos para confirmar</p><p className="mt-2 text-sm text-ink/60">Agrega productos a tu cesta y vuelve aquí.</p><a className="button-primary mt-6" href={withBase('/shop')}>Explorar la tienda <ArrowRight size={16} /></a></div>;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_330px]">
      <form className="grid gap-5" onSubmit={submitOrder}>
        <div><h2 className="font-display text-2xl text-ink">¿A quién entregamos?</h2><p className="mt-2 text-sm text-ink/60">Estos datos se guardarán solo en el pedido local de esta demo.</p></div>
        <label className="field-label">Nombre completo<input className="form-control" name="name" autoComplete="name" required maxLength={100} placeholder="Tu nombre" /></label>
        <label className="field-label">Celular de contacto<input className="form-control" name="phone" type="tel" autoComplete="tel" required maxLength={24} placeholder="Número de celular" /></label>
        <label className="field-label">Dirección de entrega<textarea className="form-control min-h-24 resize-y" name="address" autoComplete="street-address" required maxLength={240} placeholder="Dirección, barrio y ciudad" /></label>
        {error && <p className="text-sm text-clay" role="alert">{error}</p>}
        <button className="button-primary w-fit" type="submit">{items.length ? 'Crear pedido de demostración' : <><LoaderCircle size={16} /> Preparando pedido</>} <ArrowRight size={16} /></button>
        <p className="text-xs leading-5 text-ink/55">Al continuar no se realiza ningún cobro. El estado del pedido será “pendiente de pago”.</p>
      </form>
      <aside className="h-fit border-t-2 border-ink pt-5 lg:sticky lg:top-8">
        <h2 className="font-display text-2xl text-ink">Tu pedido</h2>
        <ul className="mt-4 divide-y divide-ink/10">{items.map((item) => <li key={item.productId} className="flex justify-between gap-4 py-3 text-xs"><span>{item.name}<br /><span className="text-ink/55">{item.quantity} × {formatPrice(item.price)}</span></span><span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span></li>)}</ul>
        <div className="mt-3 flex justify-between border-t border-ink/15 pt-4 font-semibold"><span>Total</span><span>{formatPrice(cartSubtotal(items))}</span></div>
      </aside>
    </div>
  );
}