import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout as checkoutUseCase } from "../usecases/checkout";

export default function Checkout({ cart, setCart }) {
  const [guestData, setGuestData] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    guest_address: "",
    guest_city: "",
    payment_method: "Efectivo",
    comments: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    setLoading(true);
    const result = await checkoutUseCase(cart, guestData);

    if (result.success) {
      alert("Compra realizada con éxito!");
      setCart([]);
      navigate("/");
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  const total = cart.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Finalizar Compra</h2>
      <div className="flex flex-col gap-2 mb-4">
        <input
          name="guest_name"
          type="text"
          placeholder="Nombre completo"
          value={guestData.guest_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="guest_email"
          type="email"
          placeholder="Correo electrónico"
          value={guestData.guest_email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="guest_phone"
          type="text"
          placeholder="Teléfono"
          value={guestData.guest_phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="guest_address"
          type="text"
          placeholder="Dirección de envío"
          value={guestData.guest_address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="guest_city"
          type="text"
          placeholder="Ciudad"
          value={guestData.guest_city}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="payment_method"
          value={guestData.payment_method}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
        <textarea
          name="comments"
          placeholder="Comentarios (opcional)"
          value={guestData.comments}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <p className="font-bold mb-2">Total: ${total.toFixed(2)}</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? "Procesando..." : "Confirmar Compra"}
      </button>
    </div>
  );
}
