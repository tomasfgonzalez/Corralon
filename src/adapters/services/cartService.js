import { getCartTotalItems } from "../../usecases/getCartTotalItems";

export function loadCart() {
  try {
    const savedCart = localStorage.getItem("cart");
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load cart:", e);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart || []));
  } catch (e) {
    console.error("Failed to save cart:", e);
  }
}

// 👉 Adapter for UI: calculates total items
export function getCartCount(cart) {
  return getCartTotalItems(cart);
}

export function addToCart(cart, product, quantity) {
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    return cart.map(p =>
      p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
    );
  } else {
    return [...cart, { ...product, quantity }];
  }
}
