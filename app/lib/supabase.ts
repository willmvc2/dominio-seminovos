import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fkzpdcekozcncsnwyblp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrenBkY2Vrb3pjbmNzbnd5YmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTcyMjIsImV4cCI6MjA5MTI3MzIyMn0.X3ynnsjMJMEEVC1ZHUuqVJ_I5sooCkt1H_JoP0VtrUE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);