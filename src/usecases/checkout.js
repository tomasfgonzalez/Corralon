import { orderRepository } from "../infrastructure/repositories/orderRepository";

export async function checkout(cart, guestData) {
  if (!cart || cart.length === 0) {
    return { success: false, message: "El carrito está vacío." };
  }

  const requiredFields = ["guest_name", "guest_email", "guest_phone", "guest_address", "guest_city"];
  for (const field of requiredFields) {
    if (!guestData[field]) {
      return { success: false, message: "Por favor completa todos los campos obligatorios." };
    }
  }

  const total = cart.reduce((sum, item) => {
    const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const orderData = {
    ...guestData,
    total,
    status: "pending",
    items: cart.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.discount ? item.price * (1 - item.discount / 100) : item.price
    }))
  };

  try {
    const order = await orderRepository.createOrder(orderData);
    return { success: true, order };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Error al guardar la orden." };
  }
}
