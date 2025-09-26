// File: src/pages/admin/AdminOrders.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*') // Start simple; we can add order_items later
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setErrorMsg(err.message || 'Error desconocido');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const markAsSent = async (orderId) => {
    if (!window.confirm('Marcar pedido como enviado?')) return;

    const { error } = await supabase
      .from('orders')
      .update({ status: 'sent' })
      .eq('id', orderId);

    if (error) return alert('Error al actualizar el pedido');

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'sent' } : o));
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancelar pedido?')) return;

    const { error } = await supabase
      .from('orders')
      .update({ status: 'canceled' })
      .eq('id', orderId);

    if (error) return alert('Error al cancelar el pedido');

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'canceled' } : o));
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('¿Eliminar este pedido permanentemente?')) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) return alert('Error al eliminar el pedido');

    setOrders(orders.filter(o => o.id !== orderId));
  };

  if (loading) return <p className="p-10">Cargando pedidos...</p>;
  if (errorMsg) return <p className="p-10 text-red-600">Error: {errorMsg}</p>;

  return (
    <div className="p-10">
      <h2 className="font-semibold mb-4">Pedidos Recibidos</h2>
      {orders.length === 0 ? (
        <p>No hay pedidos</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded shadow flex flex-col gap-2 bg-gray-50">
              <div>
                <p><strong>Cliente:</strong> {order.guest_name}</p>
                <p><strong>Email:</strong> {order.guest_email}</p>
                <p><strong>Teléfono:</strong> {order.guest_phone}</p>
                <p><strong>Dirección:</strong> {order.guest_address}</p>
                <p><strong>Ciudad:</strong> {order.guest_city}</p>
                <p><strong>Método de Pago:</strong> {order.payment_method}</p>
                {order.comments && <p><strong>Comentarios:</strong> {order.comments}</p>}
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Estado:</strong> {order.status}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>

              <div className="flex gap-2 mt-2">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => markAsSent(order.id)}
                      className="bg-green-600 text-yellow-300 px-3 py-1 rounded hover:bg-green-700"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {(order.status === 'sent' || order.status === 'canceled') && (
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
