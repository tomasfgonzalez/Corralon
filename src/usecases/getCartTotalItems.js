// File: src/usecases/getCartTotalItems.js
export function getCartTotalItems(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}
