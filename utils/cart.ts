import type { CartItem, Product } from "@/data/products";

export function addCartItem(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.id === product.id);
  return existing
    ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...cart, { ...product, quantity: 1 }];
}

export function changeCartQuantity(cart: CartItem[], id: string, change: number): CartItem[] {
  // Keep one unit as the minimum. The separate Remove button deletes the item.
  return cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item);
}

export function removeCartItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((item) => item.id !== id);
}

export function getCartTotalCents(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0);
}
