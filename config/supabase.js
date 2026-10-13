// config/supabase.js — Cliente de Conexão com o Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL ou SUPABASE_ANON_KEY não configurados nas variáveis de ambiente.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
