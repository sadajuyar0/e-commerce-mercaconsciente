export type Availability = 'limited' | 'open' | 'unavailable' | 'unknown';

export interface Product {
  id: string;
  name: string;
  description: string;
  producer: string;
  producerContact: string;
  presentation: string;
  price: number | null;
  stock: number | null;
  availability: Availability;
  category: string;
  image: string;
  sourceRow: number;
  imageIsDemo: boolean;
  categoryIsDerived: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CartItem {
  productId: string;
  name: string;
  producer: string;
  producerContact: string;
  presentation: string;
  price: number;
  quantity: number;
  stock: number | null;
  image: string;
}

export interface Order {
  code: string;
  status: 'pending_payment';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}