// Equipment Loans Page JavaScript

class LoansManager {
    constructor() {
        this.STORAGE_KEY = 'labtrack_loans';
        this.INVENTORY_KEY = 'labtrack_inventory';
        this.loans = this.loadLoans();
        this.inventory = this.loadInventory();
        this.currentReturnId = null;
        this.currentDeleteId = null;

        this.init();
    }

    init() {
        // Initialize UI
        this.populateEquipmentDropdown();

        // Load sample data if empty
        if (this.loans.length === 0) {
            this.loadSampleLoans();
        }

        this.displayLoans();
        this.updateStatistics();
        this.setupEventListeners();
    }

    loadSampleLoans() {
        this.loans = [
            {
                id: 1,
                studentName: 'John Doe',
                equipmentName: 'Arduino Uno',
                checkoutDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
                status: 'Active',
                notes: 'Sample loan'
            },
            {
                id: 2,
                studentName: 'Jane Smith',
                equipmentName: 'Raspberry Pi 4',
                checkoutDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], // 5 days ago
                dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago (Overdue)
                status: 'Active',
                notes: 'Overdue sample'
            }
        ];
        this.saveLoans();
    }

    // ===================================
    // Data Management
    // ===================================
    loadLoans() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    saveLoans() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.loans));
    }

    loadInventory() {
        const stored = localStorage.getItem(this.INVENTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // ===================================
    // UI Initialization
    // ===================================
    populateEquipmentDropdown() {
        const select = document.getElementById('equipmentSelect');
        if (!select) return;

        // Clear existing options except the first one
        select.innerHTML = '<option value="">Select Equipment</option>';

        // Get available equipment (In Stock or Low Stock)
        const availableEquipment = this.inventory.filter(item =>
            item.stock === 'In Stock' || item.stock === 'Low Stock'
        );

        availableEquipment.forEach(item => {
            const option = document.createElement('option');
            option.value = item.itemName;
            option.textContent = `${item.itemName} (${item.controlId}) - ${item.quantity} available`;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        // Form Submission
        document.getElementById('loanForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Filters
        document.getElementById('searchInput').addEventListener('input', () => this.displayLoans());
        document.getElementById('statusFilter').addEventListener('change', () => this.displayLoans());
        document.getElementById('sortFilter').addEventListener('change', () => this.displayLoans());

        // Modal Actions
        document.getElementById('confirmReturnBtn').addEventListener('click', () => this.confirmReturn());

        // Close modals on outside click
        window.onclick = (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                this.closeModal();
                this.closeReturnModal();
                this.closeDeleteModal();
            }
        };
    }

    // ===================================
    // Form Handling
    // ===================================
    handleFormSubmit(e) {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value;
        const equipmentName = document.getElementById('equipmentSelect').value;
        const checkoutDate = document.getElementById('checkoutDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const notes = document.getElementById('notes').value;

        if (!studentName || !equipmentName || !checkoutDate || !dueDate) {
            alert('Please fill in all required fields');
            return;
        }

        const newLoan = {
            id: Date.now(),
            studentName,
            equipmentName,
            checkoutDate,
            dueDate,
            notes,
            status: 'Active',
            returnDate: null
        };

        this.loans.unshift(newLoan);
        this.saveLoans();

        // Update inventory quantity (optional - for now just tracking loans)
        // In a real app, we would decrement the inventory count here

        this.displayLoans();
        this.updateStatistics();
        this.closeModal();
    }

    // ===================================
    // Display Logic
    // ===================================
    displayLoans() {
        const tbody = document.getElementById('loansTableBody');
        const emptyState = document.getElementById('emptyState');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const sortBy = document.getElementById('sortFilter').value;

        // Filter
        let filteredLoans = this.loans.filter(loan => {
            const matchesSearch =
                loan.studentName.toLowerCase().includes(searchTerm) ||
                loan.equipmentName.toLowerCase().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;

            // Check for overdue status dynamically
            if (loan.status === 'Active' && new Date(loan.dueDate) < new Date()) {
                loan.isOverdue = true;
                if (statusFilter === 'Overdue') return true;
            } else {
                loan.isOverdue = false;
            }

            return matchesSearch && matchesStatus;
        });

        // Sort
        filteredLoans.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'checkoutDate':
                    return new Date(b.checkoutDate) - new Date(a.checkoutDate); // Newest first
                case 'studentName':
                    return a.studentName.localeCompare(b.studentName);
                default:
                    return 0;
            }
        });

        // Render
        if (filteredLoans.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.add('active');
            return;
        }

        emptyState.classList.remove('active');
        tbody.innerHTML = filteredLoans.map(loan => {
            const isOverdue = loan.status === 'Active' && new Date(loan.dueDate) < new Date();
            const displayStatus = isOverdue ? 'Overdue' : loan.status;
            const statusClass = isOverdue ? 'status-overdue' : `status-${loan.status.toLowerCase()}`;

            return `
                <tr>
                    <td>
                        <div class="student-info">
                            <span class="student-name">${this.escapeHtml(loan.studentName)}</span>
                        </div>
                    </td>
                    <td>${this.escapeHtml(loan.equipmentName)}</td>
                    <td>${this.formatDate(loan.checkoutDate)}</td>
                    <td>${this.formatDate(loan.dueDate)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${displayStatus}
                        </span>
                    </td>
                    <td>
                        <div class="action-btns">
                            ${loan.status === 'Active' ? `
                                <button class="btn-received" onclick="loansManager.openReturnModal(${loan.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Return
                                </button>
                            ` : ''}
                            <button class="btn-delete" onclick="loansManager.deleteLoan(${loan.id})">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateStatistics() {
        const activeCount = this.loans.filter(l => l.status === 'Active').length;

        const overdueCount = this.loans.filter(l =>
            l.status === 'Active' && new Date(l.dueDate) < new Date()
        ).length;

        const today = new Date().toISOString().split('T')[0];
        const returnedTodayCount = this.loans.filter(l =>
            l.status === 'Returned' && l.returnDate === today
        ).length;

        document.getElementById('activeLoansCount').textContent = activeCount;
        document.getElementById('overdueCount').textContent = overdueCount;
        document.getElementById('returnedTodayCount').textContent = returnedTodayCount;
    }

    // ===================================
    // Actions
    // ===================================
    openReturnModal(id) {
        const loan = this.loans.find(l => l.id === id);
        if (!loan) return;

        this.currentReturnId = id;
        document.getElementById('returnItemName').textContent = loan.equipmentName;
        document.getElementById('returnStudentName').textContent = loan.studentName;
        document.getElementById('returnModal').classList.add('active');
    }

    confirmReturn() {
        if (!this.currentReturnId) return;

        const index = this.loans.findIndex(l => l.id === this.currentReturnId);
        if (index !== -1) {
            this.loans[index].status = 'Returned';
            this.loans[index].returnDate = new Date().toISOString().split('T')[0];
            this.saveLoans();
            this.displayLoans();
            this.updateStatistics();
        }
        this.closeReturnModal();
    }

    deleteLoan(id) {
        if (confirm('Are you sure you want to delete this loan record?')) {
            this.loans = this.loans.filter(l => l.id !== id);
            this.saveLoans();
            this.displayLoans();
            this.updateStatistics();
        }
    }

    // ===================================
    // Modal Helpers
    // ===================================
    openLoanModal() {
        document.getElementById('loanForm').reset();
        // Set default dates
        document.getElementById('checkoutDate').valueAsDate = new Date();
        // Default due date to 3 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
        document.getElementById('dueDate').valueAsDate = dueDate;

        document.getElementById('loanModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('loanModal').classList.remove('active');
    }

    closeReturnModal() {
        document.getElementById('returnModal').classList.remove('active');
        this.currentReturnId = null;
    }

    closeDeleteModal() {
        // Not using a custom delete modal for now, using confirm()
    }

    // ===================================
    // Utilities
    // ===================================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Initialize
const loansManager = new LoansManager();

// Expose functions globally
window.openLoanModal = () => loansManager.openLoanModal();
window.closeModal = () => loansManager.closeModal();
window.closeReturnModal = () => loansManager.closeReturnModal();
