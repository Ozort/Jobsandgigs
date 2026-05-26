// js/main.js

console.log("✅ main.js loaded successfully");

// ================== MAIN UI FUNCTIONS ==================
function showHome() {
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('job-detail-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function showJobDetail(job) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('job-detail-page').classList.remove('hidden');

    const content = document.getElementById('job-detail-content');
    content.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h1 class="text-4xl font-bold">${job.title}</h1>
                <p class="text-2xl text-red-600 mt-2">${job.company}</p>
            </div>
            <div class="text-right text-sm text-gray-400">Posted ${new Date(job.created_at).toLocaleDateString()}</div>
        </div>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            ${job.location ? `<div><div class="text-xs uppercase text-gray-400">Location</div><div class="font-medium">${job.location}</div></div>` : ''}
            ${job.salary ? `<div><div class="text-xs uppercase text-gray-400">Compensation</div><div class="font-medium">${job.salary}</div></div>` : ''}
        </div>
        <div class="mt-12 prose text-gray-700">${job.description.replace(/\n/g, '<br><br>')}</div>
        <div class="mt-16 pt-10 border-t">
            <a href="mailto:hello@jobsandgigs.com?subject=Application for ${encodeURIComponent(job.title)}" 
               class="block text-center bg-red-600 text-white py-6 rounded-3xl font-semibold text-lg">
                Apply Now
            </a>
        </div>
    `;
}

// ================== SECRET ADMIN ACCESS (Improved) ==================
function checkSecretAccess() {
    console.log("🔍 Checking secret access...");
    console.log("Current URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("Search params:", window.location.search);

    const params = new URLSearchParams(window.location.search);
    
    if (params.get('admin') === 'secret' || params.get('access') === 'admin') {
        console.log("✅ Secret admin code detected! Opening login...");
        showAdminLogin();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        console.log("❌ No secret param found");
    }
}

// ================== OTHER FUNCTIONS (fetchJobs, renderJobs, etc.) ==================
// ... (keep all your existing functions: fetchJobs, renderJobs, filterJobs, etc.)

async function init() {
    console.log("🚀 Initializing app...");
    await fetchJobs();
    checkSecretAccess();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        console.log("👤 User already logged in");
        currentUser = user;
        showAdminDashboard();
    }
}

window.onload = init;
