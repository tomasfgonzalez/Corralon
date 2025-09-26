// File: src/pages/AdminTickets.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setTickets(data);
      else console.error('Error fetching tickets:', error);
    };

    fetchTickets();
  }, []);

  // Delete ticket
  const deleteTicket = async (ticketId) => {
    if (!window.confirm('¿Eliminar este ticket permanentemente?')) return;

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId);

    if (error) return alert('Error al eliminar el ticket');

    setTickets(tickets.filter(t => t.id !== ticketId));
  };

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
              <p className="text-sm text-gray-500">
                {new Date(t.created_at).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => deleteTicket(t.id)}
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
