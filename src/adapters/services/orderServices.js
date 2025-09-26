export function loadOrders() {
  const savedOrders = localStorage.getItem("orders");
  return savedOrders ? JSON.parse(savedOrders) : [];
}

export function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}
