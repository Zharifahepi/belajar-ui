import { createClient } from '@supabase/supabase-js'

// Gunakan Project URL (REST API), bukan Database string
const supabaseUrl = 'https://pzmhfythndnlkosukyvd.supabase.co' 

// Copy "anon" public key dari menu API di Supabase (biasanya berawalan eyJ...)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWhmeXRobmRubGtvc3VreXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTgwOTQsImV4cCI6MjEwNzUzNDA5NH0.QBW1BWfn4y9IfpLpglcDCFRVtocuCKTm-BOv4RA7QC8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)