// File: src/pages/admin/AdminTickets.js
import React, { useEffect, useState } from 'react';
import { fetchTickets, deleteTicketById } from '../../usecases/ticketUseCases';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Load tickets
  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await fetchTickets();
      setTickets(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al cargar tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Delete a ticket
  const handleDelete = async (ticketId) => {
    if (!window.confirm('¿Eliminar este ticket permanentemente?')) return;

    try {
      await deleteTicketById(ticketId);
      setTickets(tickets.filter(t => t.id !== ticketId));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el ticket');
    }
  };

  if (loading) return <p className="p-6">Cargando tickets...</p>;
  if (errorMsg) return <p className="p-6 text-red-600">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets de Contacto</h1>
      {tickets.length === 0 ? (
        <p>No hay tickets todavía.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((t) => (
            <li key={t.id} className="border p-4 rounded shadow">
              <p><strong>Email:</strong> {t.email}</p>
              <p><strong>Mensaje:</strong> {t.message}</p>
              {t.status && <p><strong>Estado:</strong> {t.status}</p>}
              <p className="text-sm text-gray-500">{new Date(t.created_at).toLocaleString()}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
