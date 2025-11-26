// ===================================
// Dashboard JavaScript (Simplified)
// ===================================

// No Chart.js needed - removed from dependencies
// No sidebar collapse - fixed sidebar design

document.addEventListener('DOMContentLoaded', () => {
    console.log('LabTrack Dashboard Loaded');

    // Notification button click handler
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            alert('Notifications feature coming soon!');
        });
    }

    // Add button click handler
    const addBtns = document.querySelectorAll('.add-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Add new loan feature coming soon!');
        });
    });

    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mock data refresh (placeholder for future API integration)
    function refreshDashboardData() {
        console.log('Dashboard data refreshed');
        // This would fetch real data from an API
    }

    // Auto-refresh every 30 seconds (optional)
    // setInterval(refreshDashboardData, 30000);
});

// ===================================
// Future Enhancements
// ===================================

// Add these functions when backend is ready:
// - fetchInventoryStats()
// - fetchLowStockAlerts()
// - fetchRecentActivity()
// - fetchEquipmentLoans()
// - createNewLoan()
// - updateLoanStatus()
