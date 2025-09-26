// File: src/usecases/adminUseCases.js
import { adminRepository } from '../infrastructure/repositories/adminRepository';
import { orderRepository } from '../infrastructure/repositories/orderRepository';

// Admin auth and stats (ya existentes)
export const loginAdmin = async (email, password) => adminRepository.login(email, password);
export const logoutAdmin = async () => adminRepository.logout();
export const fetchOrdersCount = async () => adminRepository.getOrdersCount();
export const fetchNewTicketsCount = async () => adminRepository.getNewTicketsCount();
export const subscribeOrders = (callback) => adminRepository.subscribeOrders(callback);
export const subscribeTickets = (callback) => adminRepository.subscribeTickets(callback);
export const unsubscribeChannel = (channel) => adminRepository.unsubscribeChannel(channel);

// Admin orders actions
export const fetchOrders = async () => orderRepository.fetchOrders();

export const markOrderAsSent = async (orderId) => orderRepository.updateOrderStatus(orderId, 'sent');

export const cancelOrder = async (orderId) => orderRepository.updateOrderStatus(orderId, 'canceled');

export const deleteOrder = async (orderId) => orderRepository.deleteOrder(orderId);
