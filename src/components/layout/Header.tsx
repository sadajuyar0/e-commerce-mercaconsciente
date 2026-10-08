import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Menu, ShoppingBasket, Sprout, X } from 'lucide-react';
import { cartCount, cartStore } from '@/store/cartStore';
import { withBase } from '@/utils/paths';

const links = [
  { href: '/shop', label: 'Tienda' },
  { href: '/about', label: 'Nuestra historia' },
  { href: '/contact', label: 'Contacto' },
];

export default function Header() {
  const items = useStore(cartStore);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setReady(true), []);

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
        Hecho cerca, elegido con cuidado
      </div>
      <header className="relative z-20 border-b border-ink/10 bg-paper/95">
        <div className="site-container flex min-h-[76px] items-center justify-between gap-4">
          <a href={withBase('/')} className="flex items-center gap-2.5 text-ink" aria-label="Mercaconsciente, inicio">
            <span className="grid size-10 place-items-center rounded-full bg-leaf text-white"><Sprout size={21} strokeWidth={1.8} /></span>
            <span className="font-display text-[21px] leading-none">Mercaconsciente</span>
          </a>
          <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
            {links.map((link) => <a key={link.href} href={withBase(link.href)} className="nav-link">{link.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href={withBase('/cart')} className="icon-button relative" aria-label={`Carrito, ${ready ? cartCount(items) : 0} productos`} title="Carrito">
              <ShoppingBasket size={21} />
              <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-clay text-[10px] font-bold text-white">{ready ? cartCount(items) : 0}</span>
            </a>
            <button className="icon-button md:hidden" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && <nav aria-label="Navegación móvil" className="flex flex-col border-t border-ink/10 px-5 py-3 md:hidden">{links.map((link) => <a key={link.href} href={withBase(link.href)} className="nav-link py-3" onClick={() => setMenuOpen(false)}>{link.label}</a>)}</nav>}
      </header>
    </>
  );
}