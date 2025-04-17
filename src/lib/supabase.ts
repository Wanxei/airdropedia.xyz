import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmnhgxzjvvvzexdlwged.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbmhneHpqdnZ2emV4ZGx3Z2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjcwNjIsImV4cCI6MjA2MDQwMzA2Mn0.IbAjnhIE1ej-9x9sGshuT5wQwdOjx20l-aMGdEmrh1A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 