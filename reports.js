// Analytics Reports Page JavaScript
// Integrates with inventory data and generates charts/statistics

class ReportsManager {
    constructor() {
        this.inventory = this.loadInventory();
        this.loans = this.loadLoans();
        this.conditionChart = null;
        this.categoryChart = null;
        this.init();
    }

    init() {
        // Calculate and display statistics
        this.calculateStatistics();

        // Generate charts
        this.createConditionChart();
        this.createCategoryChart();

        // Display broken items table
        this.displayBrokenItems();
    }

    // Load inventory from localStorage
    loadInventory() {
        const stored = localStorage.getItem('labtrack_inventory');
        return stored ? JSON.parse(stored) : [];
    }

    // Load loans from localStorage
    loadLoans() {
        const stored = localStorage.getItem('labtrack_loans');
        return stored ? JSON.parse(stored) : [];
    }

    // Calculate inventory statistics
    calculateStatistics() {
        const total = this.inventory.length;
        const available = this.inventory.filter(item => item.condition === 'Available').length;
        const broken = this.inventory.filter(item =>
            item.condition === 'Broken' || item.condition === 'For Repairs'
        ).length;

        // "In Use" is now based on Active and Overdue loans
        const inUse = this.loans.filter(loan =>
            loan.status === 'Active' || loan.status === 'Overdue'
        ).length;

        document.getElementById('totalItems').textContent = total;
        document.getElementById('availableItems').textContent = available;
        document.getElementById('inUseItems').textContent = inUse;
        document.getElementById('brokenItems').textContent = broken;
    }

    // Create donut chart for Item Condition Status
    createConditionChart() {
        const available = this.inventory.filter(item => item.condition === 'Available').length;
        const broken = this.inventory.filter(item =>
            item.condition === 'Broken' || item.condition === 'For Repairs'
        ).length;

        // Use active loans for "Used" count
        const used = this.loans.filter(loan =>
            loan.status === 'Active' || loan.status === 'Overdue'
        ).length;

        const ctx = document.getElementById('conditionChart');

        this.conditionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'Broken', 'In Use'],
                datasets: [{
                    data: [available, broken, used],
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',   // Green for Available
                        'rgba(239, 68, 68, 0.8)',   // Red for Broken
                        'rgba(59, 130, 246, 0.8)'   // Blue for Used
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 12,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                }
            }
        });

        // Create custom legend
        this.createConditionLegend(available, broken, used);
    }

    // Create custom legend for condition chart
    createConditionLegend(available, broken, used) {
        const legendContainer = document.getElementById('conditionLegend');
        const legendData = [
            { label: 'Available', value: available, color: 'rgba(34, 197, 94, 0.8)' },
            { label: 'Broken', value: broken, color: 'rgba(239, 68, 68, 0.8)' },
            { label: 'In Use', value: used, color: 'rgba(59, 130, 246, 0.8)' }
        ];

        legendContainer.innerHTML = legendData.map(item => `
            <div class="legend-item">
                <div class="legend-color" style="background: ${item.color}"></div>
                <span class="legend-label">${item.label} (${item.value})</span>
            </div>
        `).join('');
    }

    // Create horizontal bar chart for Inventory by Category
    createCategoryChart() {
        // Group items by location (using location as category)
        const categoryCount = {};
        this.inventory.forEach(item => {
            const category = item.location || 'Uncategorized';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);

        const ctx = document.getElementById('categoryChart');

        this.categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Items',
                    data: counts,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: 12,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: '#9ca3af',
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Display broken/damaged items in table
    displayBrokenItems() {
        const brokenItems = this.inventory.filter(item =>
            item.condition === 'Broken' || item.condition === 'For Repairs'
        );

        const tbody = document.getElementById('brokenTableBody');
        const emptyState = document.getElementById('emptyBrokenState');
        const countBadge = document.getElementById('brokenCount');

        countBadge.textContent = `${brokenItems.length} Items`;

        if (brokenItems.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.add('active');
            return;
        }

        emptyState.classList.remove('active');
        tbody.innerHTML = brokenItems.map(item => `
            <tr>
                <td>${this.escapeHtml(item.itemName)}</td>
                <td>${this.escapeHtml(item.controlId)}</td>
                <td><span class="category-badge">${this.escapeHtml(item.location || 'N/A')}</span></td>
                <td><span class="status-badge-broken">${this.escapeHtml(item.condition)}</span></td>
                <td>${new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</td>
            </tr>
        `).join('');
    }

    // Export inventory to XLSX
    exportToXLSX() {
        if (this.inventory.length === 0) {
            alert('No inventory data to export');
            return;
        }

        // Prepare data for export
        const exportData = this.inventory.map(item => ({
            'Item Name': item.itemName,
            'Control ID': item.controlId,
            'Quantity': item.quantity,
            'Location': item.location,
            'Stock Status': item.stock,
            'Condition': item.condition,
            'Supplier': item.supplier || '',
            'Remarks': item.remarks || ''
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const colWidths = [
            { wch: 25 }, // Item Name
            { wch: 15 }, // Control ID
            { wch: 10 }, // Quantity
            { wch: 20 }, // Location
            { wch: 15 }, // Stock Status
            { wch: 15 }, // Condition
            { wch: 20 }, // Supplier
            { wch: 30 }  // Remarks
        ];
        ws['!cols'] = colWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = `LabTrack_Inventory_${date}.xlsx`;

        // Download file
        XLSX.writeFile(wb, filename);
    }

    // Helper: Escape HTML
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize reports manager
const reportsManager = new ReportsManager();

// Expose export function to window
window.exportToXLSX = () => reportsManager.exportToXLSX();
