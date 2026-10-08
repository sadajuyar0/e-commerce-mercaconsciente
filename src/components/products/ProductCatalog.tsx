import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, Product } from '@/types/ecommerce';
import { categoryId } from '@/data/categories';
import ProductCard from '@/components/products/ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
}

export default function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es-CO');
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || categoryId(product.category) === category;
      const matchesText = !term || `${product.name} ${product.producer} ${product.description}`.toLocaleLowerCase('es-CO').includes(term);
      return matchesCategory && matchesText;
    });
    if (sort === 'price-asc') return [...filtered].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price-desc') return [...filtered].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    return filtered;
  }, [products, category, query, sort]);

  return (
    <div>
      <div className="grid gap-3 border-y border-ink/15 py-4 md:grid-cols-[minmax(200px,1fr)_minmax(180px,260px)_minmax(165px,205px)]">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Buscar producto o productor</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca un producto o productor" />
        </label>
        <label className="select-field">
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span className="sr-only">Filtrar por categoría</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="select-field">
          <span className="sr-only">Ordenar productos</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Orden original</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>
      <div className="flex min-h-12 items-center justify-between gap-4 py-3 text-sm text-ink/65" aria-live="polite">
        <p>{visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'}</p>
        {query && <button className="text-leaf underline underline-offset-4" type="button" onClick={() => setQuery('')}>Limpiar búsqueda</button>}
      </div>
      {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="border-y border-ink/15 py-16 text-center"><p className="font-display text-2xl text-ink">No encontramos ese producto</p><p className="mt-2 text-sm text-ink/60">Prueba otra palabra o categoría.</p></div>}
    </div>
  );
}