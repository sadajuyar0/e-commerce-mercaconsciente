import { persistentAtom } from '@nanostores/persistent';
import type { CartItem, Product } from '@/types/ecommerce';

export const cartStore = persistentAtom<CartItem[]>('mercaconsciente-cart-v1', [], {
  encode: JSON.stringify,
  decode: (value) => {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  },
});

export function addProduct(product: Product, amount = 1): void {
  if (product.price === null || product.availability === 'unavailable' || amount < 1) return;
  const existing = cartStore.get().find((item) => item.productId === product.id);
  const quantity = Math.min((existing?.quantity ?? 0) + amount, product.stock ?? Number.MAX_SAFE_INTEGER);
  const nextItem: CartItem = {
    productId: product.id,
    name: product.name,
    producer: product.producer,
    producerContact: product.producerContact,
    presentation: product.presentation,
    price: product.price,
    quantity,
    stock: product.stock,
    image: product.image,
  };
  cartStore.set(existing
    ? cartStore.get().map((item) => item.productId === product.id ? nextItem : item)
    : [...cartStore.get(), nextItem]);
}

export function removeProduct(productId: string): void {
  cartStore.set(cartStore.get().filter((item) => item.productId !== productId));
}

export function updateQuantity(productId: string, quantity: number): void {
  const item = cartStore.get().find((entry) => entry.productId === productId);
  if (!item) return;
  if (quantity < 1) return removeProduct(productId);
  cartStore.set(cartStore.get().map((entry) => entry.productId === productId
    ? { ...entry, quantity: Math.min(quantity, entry.stock ?? Number.MAX_SAFE_INTEGER) }
    : entry));
}

export function clearCart(): void {
  cartStore.set([]);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}