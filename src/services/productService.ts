import offers from '@/data/offers.json';
import { categories } from '@/data/categories';
import type { Category, Product } from '@/types/ecommerce';

const products = offers as Product[];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find((product) => product.id === id);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return products.filter((product) => product.price !== null && product.availability !== 'unavailable').slice(0, limit);
}