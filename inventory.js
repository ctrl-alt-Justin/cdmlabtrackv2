// ===================================
// Inventory Management System
// ===================================

console.log('✅ inventory.js loaded!');

// LocalStorage key
const STORAGE_KEY = 'labtrack_inventory';

// Global state
let inventory = [];
let editingId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired!');
    console.log('🔧 Setting up inventory system...');

    loadInventory();
    renderInventory();
    setupEventListeners();

    // Load sample data if empty
    if (inventory.length === 0) {
        loadSampleData();
    }

    console.log('✅ Inventory system initialized');
});

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Modal controls
    document.getElementById('addItemBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('itemForm').addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    document.getElementById('itemModal').addEventListener('click', (e) => {
        if (e.target.id === 'itemModal') closeModal();
    });

    // Filters and search
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('stockFilter').addEventListener('change', applyFilters);
    document.getElementById('conditionFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('sortFilter').addEventListener('change', applyFilters);
}

// ===================================
// Data Management
// ===================================
function loadInventory() {
    const stored = localStorage.getItem(STORAGE_KEY);
    inventory = stored ? JSON.parse(stored) : [];
}

function saveInventory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function loadSampleData() {
    inventory = [
        {
            id: Date.now(),
            itemName: 'Arduino Uno Rev3',
            controlId: 'ARD-001',
            quantity: 15,
            supplier: 'Arduino Store',
            location: 'Computer Lab',
            stock: 'In Stock',
            condition: 'Available',
            remarks: 'Standard development board',
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            itemName: 'Raspberry Pi 4 (4GB)',
            controlId: 'RPI-002',
            quantity: 3,
            supplier: 'Element14',
            location: 'ECE Lab',
            stock: 'Low Stock',
            condition: 'Available',
            remarks: 'Need to reorder',
            addedDate: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: Date.now() + 2,
            itemName: 'Oscilloscope DSO-X 3024A',
            controlId: 'OSC-003',
            quantity: 2,
            supplier: 'Keysight',
            location: 'EE Lab',
            stock: 'In Stock',
            condition: 'Available',
            remarks: '200 MHz, 4 channels',
            addedDate: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: Date.now() + 3,
            itemName: '3D Printer Ender 3',
            controlId: 'PRT-004',
            quantity: 1,
            supplier: 'Creality',
            location: 'ME Lab',
            stock: 'In Stock',
            condition: 'For Repairs',
            remarks: 'Nozzle needs replacement',
            addedDate: new Date(Date.now() - 259200000).toISOString()
        },
        {
            id: Date.now() + 4,
            itemName: 'Soldering Station',
            controlId: 'SLD-005',
            quantity: 0,
            supplier: 'Weller',
            location: 'Physics Lab',
            stock: 'Out of Stock',
            condition: 'Broken',
            remarks: 'Heating element failed',
            addedDate: new Date(Date.now() - 345600000).toISOString()
        }
    ];
    saveInventory();
    renderInventory();
}

// ===================================
// CRUD Operations
// ===================================
function addItem(itemData) {
    const newItem = {
        ...itemData,
        id: Date.now(),
        addedDate: new Date().toISOString()
    };
    inventory.unshift(newItem);
    saveInventory();
    renderInventory();
}

function updateItem(id, itemData) {
    const index = inventory.findIndex(item => item.id === id);
    if (index !== -1) {
        inventory[index] = { ...inventory[index], ...itemData };
        saveInventory();
        renderInventory();
    }
}

let itemToDeleteId = null;

function deleteItem(id) {
    itemToDeleteId = id;
    const item = inventory.find(i => i.id === id);
    if (item) {
        document.getElementById('deleteItemName').textContent = item.name;
        openDeleteModal();
    }
}

function openDeleteModal() {
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    itemToDeleteId = null;
}

// Confirm Delete Event Listener
document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    if (itemToDeleteId) {
        inventory = inventory.filter(item => item.id !== itemToDeleteId);
        saveInventory();
        renderInventory();
        closeDeleteModal();
    }
});

// ===================================
// Modal Operations
// ===================================
function openAddModal() {
    console.log('🎯 openAddModal called!');
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    openModal();
}

function openEditModal(id) {
    editingId = id;
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.itemName;
    document.getElementById('controlId').value = item.controlId;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('supplier').value = item.supplier || '';
    document.getElementById('location').value = item.location;
    document.getElementById('stock').value = item.stock;
    document.getElementById('condition').value = item.condition;
    document.getElementById('remarks').value = item.remarks || '';

    openModal();
}

function openModal() {
    document.getElementById('itemModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    document.body.style.overflow = '';
    editingId = null;
}

// ===================================
// Form Handling
// ===================================
function handleFormSubmit(e) {
    e.preventDefault();

    const itemData = {
        itemName: document.getElementById('itemName').value,
        controlId: document.getElementById('controlId').value,
        quantity: parseInt(document.getElementById('quantity').value),
        supplier: document.getElementById('supplier').value,
        location: document.getElementById('location').value,
        stock: document.getElementById('stock').value,
        condition: document.getElementById('condition').value,
        remarks: document.getElementById('remarks').value
    };

    if (editingId) {
        updateItem(editingId, itemData);
    } else {
        addItem(itemData);
    }

    closeModal();
}

// ===================================
// Rendering
// ===================================
function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    const emptyState = document.getElementById('emptyState');

    // Apply filters first
    const filteredInventory = getFilteredInventory();

    if (filteredInventory.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('visible');
        return;
    }

    emptyState.classList.remove('visible');

    tbody.innerHTML = filteredInventory.map(item => `
        <tr>
            <td><strong>${item.itemName}</strong></td>
            <td>${item.controlId}</td>
            <td>${item.quantity}</td>
            <td>${item.location}</td>
            <td><span class="stock-badge ${getStockClass(item.stock)}">${item.stock}</span></td>
            <td><span class="condition-badge ${getConditionClass(item.condition)}">${item.condition}</span></td>
            <td>${item.supplier || '-'}</td>
            <td>${item.remarks || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal(${item.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===================================
// Filtering and Sorting
// ===================================
function getFilteredInventory() {
    let filtered = [...inventory];

    // Search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(item =>
            item.itemName.toLowerCase().includes(searchTerm) ||
            item.controlId.toLowerCase().includes(searchTerm) ||
            item.supplier?.toLowerCase().includes(searchTerm)
        );
    }

    // Stock filter
    const stockFilter = document.getElementById('stockFilter').value;
    if (stockFilter !== 'all') {
        filtered = filtered.filter(item => item.stock === stockFilter);
    }

    // Condition filter
    const conditionFilter = document.getElementById('conditionFilter').value;
    if (conditionFilter !== 'all') {
        filtered = filtered.filter(item => item.condition === conditionFilter);
    }

    // Location filter
    const locationFilter = document.getElementById('locationFilter').value;
    if (locationFilter !== 'all') {
        filtered = filtered.filter(item => item.location === locationFilter);
    }

    // Sort
    const sortBy = document.getElementById('sortFilter').value;
    switch (sortBy) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            break;
        case 'name':
            filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));
            break;
        case 'quantity':
            filtered.sort((a, b) => b.quantity - a.quantity);
            break;
        case 'stock':
            const stockOrder = { 'Out of Stock': 0, 'Low Stock': 1, 'In Stock': 2 };
            filtered.sort((a, b) => stockOrder[a.stock] - stockOrder[b.stock]);
            break;
    }

    return filtered;
}

function applyFilters() {
    renderInventory();
}

// ===================================
// Helper Functions
// ===================================
function getStockClass(stock) {
    return stock.toLowerCase().replace(/ /g, '-');
}

function getConditionClass(condition) {
    return condition.toLowerCase().replace(/ /g, '-');
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.deleteItem = deleteItem;
window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.closeDeleteModal = closeDeleteModal;
window.handleFormSubmit = handleFormSubmit;
