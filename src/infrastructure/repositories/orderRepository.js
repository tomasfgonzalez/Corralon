// File: src/infrastructure/repositories/orderRepository.js
import { supabase } from "../supabaseClient";

export const orderRepository = {
  async createOrder(orderData) {
    // Insert main order
    const { data: order, error: orderError } = await supabase
      .from("orders")
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

    // Insert items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderData.items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        price: i.price
      })));

    if (itemsError) throw itemsError;

    return order;
  },

  async fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(orderId, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },

  async deleteOrder(orderId) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (error) throw error;
  }
};
