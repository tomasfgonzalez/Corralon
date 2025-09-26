// File: src/usecases/ticketUseCases.js
import { ticketRepository } from "../infrastructure/repositories/ticketRepository";

export const fetchTickets = async () => {
  return await ticketRepository.getAll();
};

export const deleteTicketById = async (ticketId) => {
  await ticketRepository.delete(ticketId);
};
