import type { Category } from '@/types/ecommerce';

export const categories: Category[] = [
  { id: 'all', name: 'Todos los productos', description: 'La oferta completa de la temporada.' },
  { id: 'panaderia', name: 'Panadería', description: 'Fermentos, panes y horneados.' },
  { id: 'bebidas', name: 'Bebidas', description: 'Café, infusiones y bebidas artesanales.' },
  { id: 'frescos-y-lacteos', name: 'Frescos y lácteos', description: 'Productos frescos de temporada.' },
  { id: 'cuidado-personal-y-hogar', name: 'Cuidado personal y hogar', description: 'Alternativas para el cuidado diario.' },
  { id: 'despensa-natural', name: 'Despensa natural', description: 'Alacena artesanal y productos de origen.' },
];

export function categoryId(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}