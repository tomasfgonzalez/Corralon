// File: src/infrastructure/repositories/ticketRepository.js
import { supabase } from "../supabaseClient";

export const ticketRepository = {
  async create(ticket) {
    const { error } = await supabase.from("tickets").insert([ticket]);
    if (error) throw error;
    return true;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async delete(ticketId) {
    const { error } = await supabase
      .from("tickets")
      .delete()
      .eq("id", ticketId);

    if (error) throw error;
  }
};
