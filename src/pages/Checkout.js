// File: src/pages/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Checkout({ cart, setCart }) {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    if (!guestName || !guestEmail || !guestPhone || !guestAddress || !guestCity) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    const orderData = {
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_address: guestAddress,
      guest_city: guestCity,
      payment_method: paymentMethod,
      comments,
      total,
      status: 'pending',
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.discount ? item.price * (1 - item.discount / 100) : item.price
      }))
    };

    try {
      // Save main order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          guest_name: orderData.guest_name,
          guest_email: orderData.guest_email,
          guest_phone: orderData.guest_phone,
          guest_address: orderData.guest_address,
          guest_city: orderData.guest_city,
          payment_method: orderData.payment_method,
          comments: orderData.comments,
          total: orderData.total,
          status: orderData.status
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderData.items.map(i => ({
          order_id: order.id,
          product_id: i.product_id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        })));

      if (itemsError) throw itemsError;

      alert('Compra realizada con éxito!');
      setCart([]);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error al guardar la orden');
    }

    setLoading(false);
  };

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Finalizar Compra</h2>
      <div className='flex flex-col gap-2 mb-4'>
        <input
          type='text'
          placeholder='Nombre completo'
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='email'
          placeholder='Correo electrónico'
          value={guestEmail}
          onChange={e => setGuestEmail(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='text'
          placeholder='Teléfono'
          value={guestPhone}
          onChange={e => setGuestPhone(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='text'
          placeholder='Dirección de envío'
          value={guestAddress}
          onChange={e => setGuestAddress(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='text'
          placeholder='Ciudad'
          value={guestCity}
          onChange={e => setGuestCity(e.target.value)}
          className='border p-2 rounded'
        />
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='Efectivo'>Efectivo</option>
          <option value='Transferencia'>Transferencia</option>
          <option value='Tarjeta'>Tarjeta</option>
        </select>
        <textarea
          placeholder='Comentarios (opcional)'
          value={comments}
          onChange={e => setComments(e.target.value)}
          className='border p-2 rounded'
        />
      </div>
      <p className='font-bold mb-2'>Total: ${total.toFixed(2)}</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition'
      >
        {loading ? 'Procesando...' : 'Confirmar Compra'}
      </button>
    </div>
  );
}
