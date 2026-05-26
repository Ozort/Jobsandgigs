// js/main.js - COMPLETE DEBUG VERSION

console.log("✅ main.js loaded");

// Global variables
let jobs = [];
let currentUser = null;
let filteredJobs = [];

// ================== SECRET ADMIN ACCESS ==================
function checkSecretAccess() {
    console.log("🔍 Checking for admin access...");
    console.log("URL:", window.location.href);

    const params = new URLSearchParams(window.location.search);
    
    if (params.get('admin') === 'secret') {
        console.log("✅ Admin secret detected! Opening login...");
        setTimeout(() => {
            showAdminLogin();
        }, 300); // Small delay to ensure DOM is ready
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        console.log("❌ No admin parameter found");
    }
}

// ================== BASIC UI FUNCTIONS ==================
function showHome() {
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('job-detail-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
}

// ================== INIT ==================
async function init() {
    console.log("🚀 App initializing...");
    
    await fetchJobs();           // This is in supabase.js or needs to be defined
    checkSecretAccess();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        console.log("👤 Already logged in as:", user.email);
        currentUser = user;
        showAdminDashboard();
    }
}

window.onload = init;
