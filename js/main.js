// Main UI & Job Functions
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

async function fetchJobs() {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else {
        jobs = data || [];
        filteredJobs = [...jobs];
        renderJobs();
    }
}

function renderJobs() {
    const container = document.getElementById('jobs-list');
    container.innerHTML = '';

    if (filteredJobs.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center py-20 text-gray-400">No matching jobs found.</div>`;
        return;
    }

    filteredJobs.forEach(job => {
        const card = document.createElement('div');
        card.className = `job-card bg-white rounded-3xl p-8 cursor-pointer`;
        card.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <h3 class="font-semibold text-2xl">${job.title}</h3>
                    <p class="text-red-600 mt-1">${job.company}</p>
                </div>
                <div class="text-sm text-gray-400">${new Date(job.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric'})}</div>
            </div>
            <p class="text-gray-600 mt-4 line-clamp-3">${job.description}</p>
            <div class="mt-6 flex gap-3">
                ${job.location ? `<span class="text-sm px-4 py-1 bg-gray-100 rounded-2xl">${job.location}</span>` : ''}
                ${job.salary ? `<span class="text-sm px-4 py-1 bg-emerald-100 text-emerald-700 rounded-2xl">${job.salary}</span>` : ''}
            </div>
        `;
        card.onclick = () => showJobDetail(job);
        container.appendChild(card);
    });

    document.getElementById('job-count').textContent = `${filteredJobs.length} jobs`;
}

function filterJobs() {
    const term = document.getElementById('search-input').value.toLowerCase();
    filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) ||
        (job.description && job.description.toLowerCase().includes(term))
    );
    renderJobs();
}

// Secret Admin Path
function checkSecretAccess() {
    if (window.location.pathname.endsWith('/secretadmin')) {
        showAdminLogin();
    }
}

async function init() {
    await fetchJobs();
    checkSecretAccess();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) currentUser = user;
}

window.onload = init;
