import React, { useState } from "react";
import { createTicket } from "../usecases/createTicket";

export default function Contactanos() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    const result = await createTicket({ email, message });
    setSuccess(result.success);

    if (result.success) {
      setEmail("");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contáctanos</h1>
      <p className="mb-6">Envíanos un mensaje y te responderemos lo antes posible.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Tu mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded"
          rows="5"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brandGreen text-brandYellow py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {success === true && (
        <p className="mt-4 text-green-600">
          ✅ Tu mensaje fue enviado correctamente.
        </p>
      )}
      {success === false && (
        <p className="mt-4 text-red-600">
          ❌ Hubo un error al enviar el mensaje. Intenta nuevamente.
        </p>
      )}
    </div>
  );
}
