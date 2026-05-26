function showAdminLogin() {
    document.getElementById('admin-login-modal').classList.remove('hidden');
}

function hideAdminLogin() {
    document.getElementById('admin-login-modal').classList.add('hidden');
}

async function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    if (!email || !password) return alert("Please enter email and password");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login failed: " + error.message);
    else {
        currentUser = data.user;
        hideAdminLogin();
        showAdminDashboard();
    }
}

async function logoutAdmin() {
    await supabase.auth.signOut();
    currentUser = null;
    showHome();
}

function showAdminDashboard() {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('job-detail-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    renderAdminTable();
}

async function addJob(e) {
    e.preventDefault();
    if (!currentUser) return;

    const newJob = {
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        salary: document.getElementById('salary').value
    };

    const { error } = await supabase.from('jobs').insert(newJob);
    if (error) alert(error.message);
    else {
        alert('✅ Job posted successfully!');
        e.target.reset();
        fetchJobs();
    }
}

async function deleteJob(id) {
    if (!confirm('Delete this job permanently?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchJobs();
}

function filterAdminJobs() {
    const term = document.getElementById('admin-search').value.toLowerCase();
    const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(term) || job.company.toLowerCase().includes(term)
    );
    renderAdminTable(filtered);
}

function renderAdminTable(data = jobs) {
    const tbody = document.getElementById('admin-jobs-table');
    tbody.innerHTML = '';

    data.forEach(job => {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50";
        row.innerHTML = `
            <td class="p-6 font-medium">${job.title}</td>
            <td class="p-6 text-gray-600">${job.company}</td>
            <td class="p-6 text-gray-500">${new Date(job.created_at).toLocaleDateString()}</td>
            <td class="p-6 text-center">
                <button onclick="deleteJob('${job.id}'); event.stopImmediatePropagation()" 
                        class="text-red-600 hover:text-red-700 font-medium">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
