// ===================================
// Users Management - JavaScript
// ===================================

const STORAGE_KEY = 'labtrack_users';
let users = [];
let editingUserId = null;

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    checkPageAccess();
    loadUsers();
    initializeEventListeners();
    renderUsers();
    updateStats();
});

// ===================================
// Check Page Access
// ===================================
function checkPageAccess() {
    const settings = JSON.parse(localStorage.getItem('labtrack_settings') || '{}');
    const userRole = settings.userRole || 'Admin';

    if (userRole !== 'Admin' && userRole !== 'Program Chair') {
        alert('Access Denied: You do not have permission to view this page.');
        window.location.href = 'dashboard.html';
    }
}

// ===================================
// Load Users from LocalStorage
// ===================================
function loadUsers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        users = JSON.parse(stored);
    } else {
        // Initialize with sample data
        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@labtrack.com',
                role: 'Admin',
                dateAdded: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@labtrack.com',
                role: 'Program Chair',
                dateAdded: new Date().toISOString().split('T')[0]
            },
            {
                id: 3,
                name: 'Prof. Michael Chen',
                email: 'michael.chen@labtrack.com',
                role: 'Teacher',
                dateAdded: new Date().toISOString().split('T')[0]
            },
            {
                id: 4,
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@labtrack.com',
                role: 'Teacher',
                dateAdded: new Date().toISOString().split('T')[0]
            },
            {
                id: 5,
                name: 'John Smith',
                email: 'john.smith@student.labtrack.com',
                role: 'Student',
                dateAdded: new Date().toISOString().split('T')[0]
            },
            {
                id: 6,
                name: 'Jane Doe',
                email: 'jane.doe@student.labtrack.com',
                role: 'Student',
                dateAdded: new Date().toISOString().split('T')[0]
            }
        ];
        saveUsers();
    }
}

// ===================================
// Save Users to LocalStorage
// ===================================
function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ===================================
// Event Listeners
// ===================================
function initializeEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', filterUsers);

    // Filters
    document.getElementById('roleFilter').addEventListener('change', filterUsers);
    document.getElementById('sortFilter').addEventListener('change', filterUsers);

    // Form submission
    document.getElementById('userForm').addEventListener('submit', handleFormSubmit);
}

// ===================================
// Render Users Table
// ===================================
function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');

    if (users.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('active');
        return;
    }

    emptyState.classList.remove('active');

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="role-badge ${getRoleClass(user.role)}">${escapeHtml(user.role)}</span></td>
            <td>${formatDate(user.dateAdded)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="window.openEditModal(${user.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Role
                    </button>
                    <button class="btn-delete" onclick="window.openDeleteModal(${user.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===================================
// Filter Users
// ===================================
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filtered = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Sort
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'email':
                return a.email.localeCompare(b.email);
            case 'role':
                return a.role.localeCompare(b.role);
            case 'recent':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            default:
                return 0;
        }
    });

    // Temporarily replace users array for rendering
    const originalUsers = users;
    users = filtered;
    renderUsers();
    users = originalUsers;
}

// ===================================
// Update Statistics
// ===================================
function updateStats() {
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'Admin').length;
    const teacherCount = users.filter(u => u.role === 'Teacher' || u.role === 'Program Chair').length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('adminCount').textContent = adminCount;
    document.getElementById('teacherCount').textContent = teacherCount;
}

// ===================================
// Modal Functions
// ===================================
window.openAddModal = function () {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('active');
};

window.openEditModal = function (userId) {
    editingUserId = userId;
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('modalTitle').textContent = 'Edit User Role';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userModal').classList.add('active');
};

window.closeModal = function () {
    document.getElementById('userModal').classList.remove('active');
    editingUserId = null;
};

window.openDeleteModal = function (userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('deleteUserName').textContent = user.name;
    document.getElementById('confirmDeleteBtn').onclick = () => deleteUser(userId);
    document.getElementById('deleteModal').classList.add('active');
};

window.closeDeleteModal = function () {
    document.getElementById('deleteModal').classList.remove('active');
};

// ===================================
// Form Submission
// ===================================
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name || !email || !role) {
        alert('Please fill in all required fields');
        return;
    }

    if (editingUserId) {
        // Update existing user
        const user = users.find(u => u.id === editingUserId);
        if (user) {
            user.name = name;
            user.email = email;
            user.role = role;
        }
    } else {
        // Add new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            role,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        users.push(newUser);
    }

    saveUsers();
    renderUsers();
    updateStats();
    window.closeModal();
}

// ===================================
// Delete User
// ===================================
function deleteUser(userId) {
    users = users.filter(u => u.id !== userId);
    saveUsers();
    renderUsers();
    updateStats();
    window.closeDeleteModal();
}

// ===================================
// Utility Functions
// ===================================
function getRoleClass(role) {
    switch (role) {
        case 'Admin':
            return 'role-admin';
        case 'Program Chair':
            return 'role-chair';
        case 'Teacher':
            return 'role-teacher';
        case 'Student':
            return 'role-student';
        default:
            return '';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
