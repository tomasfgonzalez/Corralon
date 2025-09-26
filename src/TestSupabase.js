// File: src/TestSupabase.js
import React, { useEffect } from 'react';
import { supabase } from './supabaseClient'; // adjust path if needed

export default function TestSupabase() {
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        console.log('Supabase products:', data);
        alert(`Found ${data.length} products in the table!`);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Check the console to see products from Supabase</h2>
    </div>
  );
}
