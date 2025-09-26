import { ticketRepository } from "../infrastructure/repositories/ticketRepository";

export async function createTicket({ email, message }) {
  try {
    await ticketRepository.create({ email, message });
    return { success: true };
  } catch (err) {
    console.error("Error creating ticket:", err);
    return { success: false, error: err };
  }
}
