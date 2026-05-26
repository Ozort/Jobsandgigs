const SUPABASE_URL = 'https://usgjrtcvcrpqqocvleny.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZ2pydGN2Y3JwcXFvY3ZsZW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDg2OTgsImV4cCI6MjA5NTM4NDY5OH0.0ju7BrUueQhldAyya--NZYctJ4AOhTll4eop45fVpZc'; 

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let jobs = [];
let currentUser = null;
let filteredJobs = [];
