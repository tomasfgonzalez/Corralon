// File: src/pages/Admin.js
import React, { useState, useEffect } from 'react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminTickets from './AdminTickets';
import { supabase } from '../../supabaseClient';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedAdmin, setLoggedAdmin] = useState(null);
  const [view, setView] = useState('products'); // products | orders | tickets
  const [loading, setLoading] = useState(false);
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { user } = data;
    if (!user) {
      alert('Login failed');
      setLoading(false);
      return;
    }

    setLoggedAdmin(user);
    setLoading(false);
  };

  useEffect(() => {
    if (!loggedAdmin) return;

    // Fetch number of new tickets
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact' })
        .eq('status', 'new');

      if (!error && data) {
        setNewTicketsCount(data.length);
      }
    };

    // Fetch number of orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      if (!error && data) {
        setOrdersCount(data.length);
      }
    };

    fetchTickets();
    fetchOrders();

    // Real-time subscription for tickets
    const ticketsChannel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        () => setNewTicketsCount(prev => prev + 1)
      )
      .subscribe();

    // Real-time subscription for orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => setOrdersCount(prev => prev + 1)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [loggedAdmin]);

  if (!loggedAdmin) {
    return (
      <div className='p-10 max-w-md mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Login de Admin</h1>
        <form onSubmit={handleLogin} className='flex flex-col gap-2'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='border p-2 rounded'
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='border p-2 rounded'
            required
          />
          <button
            type='submit'
            className='bg-brandGreen text-brandYellow py-2 rounded hover:bg-green-700 transition'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-100 shadow">
        <button
          onClick={() => setView('products')}
          className={`px-4 py-2 rounded ${view === 'products' ? 'bg-brandGreen text-brandYellow' : 'bg-gray-200'}`}
        >
          Productos
        </button>
        <button
          onClick={() => setView('orders')}
          className={`relative px-4 py-2 rounded ${view === 'orders' ? 'bg-brandGreen text-brandYellow' : 'bg-gray-200'}`}
        >
          Pedidos
          {ordersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {ordersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setView('tickets')}
          className={`relative px-4 py-2 rounded ${view === 'tickets' ? 'bg-brandGreen text-brandYellow' : 'bg-gray-200'}`}
        >
          Tickets
          {newTicketsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {newTicketsCount}
            </span>
          )}
        </button>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setLoggedAdmin(null);
          }}
          className="ml-auto px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          Logout
        </button>
      </nav>

      {view === 'products' && <AdminProducts setLogged={() => setLoggedAdmin(null)} />}
      {view === 'orders' && <AdminOrders />}
      {view === 'tickets' && <AdminTickets />}
    </div>
  );
}
