// File: src/infrastructure/repositories/adminRepository.js
import { supabase } from '../supabaseClient';

export const adminRepository = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getOrdersCount: async () => {
    const { data, error } = await supabase.from('orders').select('*', { count: 'exact' });
    if (error) throw error;
    return data.length;
  },

  getNewTicketsCount: async () => {
    const { data, error } = await supabase.from('tickets').select('*', { count: 'exact' }).eq('status', 'new');
    if (error) throw error;
    return data.length;
  },

  subscribeOrders: (callback) => {
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, callback)
      .subscribe();
    return channel;
  },

  subscribeTickets: (callback) => {
    const channel = supabase
      .channel('tickets-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, callback)
      .subscribe();
    return channel;
  },

  unsubscribeChannel: (channel) => {
    supabase.removeChannel(channel);
  }
};
