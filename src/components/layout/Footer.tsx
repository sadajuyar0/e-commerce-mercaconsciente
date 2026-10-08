import { ArrowUpRight, Sprout } from 'lucide-react';
import { withBase } from '@/utils/paths';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <a href={withBase('/')} className="inline-flex items-center gap-2 font-display text-2xl"><Sprout size={23} /> Mercaconsciente</a>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">Una mesa compartida entre quienes producen con cuidado y quienes eligen saber de dónde viene lo que consumen.</p>
        </div>
        <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/80">
          <a href={withBase('/shop')} className="footer-link">Tienda <ArrowUpRight size={14} /></a>
          <a href={withBase('/about')} className="footer-link">Nosotros <ArrowUpRight size={14} /></a>
          <a href={withBase('/contact')} className="footer-link">Contacto <ArrowUpRight size={14} /></a>
        </nav>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/55">Mercaconsciente · Oferta de temporada SEP–OCT 2026</div>
    </footer>
  );
}