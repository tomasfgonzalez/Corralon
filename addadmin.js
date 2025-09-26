// src/pages/script.js
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Use your project URL and SERVICE ROLE KEY
const supabaseUrl = 'https://nlguqrkwyyigenzggkhu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZ3Vxcmt3eXlpZ2Vuemdna2h1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODE0NjE1OCwiZXhwIjoyMDczNzIyMTU4fQ.1PqCGGDNmfujuHVILtq5oo4tQmXQghY84Tg15eNh1eo'; // replace this
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAdmin(email, plainPassword, role = 'editor') {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ email, password_hash: hashedPassword, role }])
      .select();

    if (error) {
      console.error('Error adding admin:', error);
    } else {
      console.log('Admin added:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Example usage:
addAdmin('tomas.gonzalez@hotmail.com', 'cisco', 'superadmin');
addAdmin('pepe@hotmail.com','cisco','admin');