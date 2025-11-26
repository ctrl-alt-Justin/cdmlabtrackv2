// ===================================
// DOM Elements
// ===================================
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

// ===================================
// Event Handlers - Sign In Modal
// ===================================

// Sign In Button - Opens Modal  
if (signInBtn) {
    signInBtn.addEventListener('click', () => {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close Modal Button
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Back to Home Link
const backToHomeBtn = document.getElementById('backToHome');
if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close modal when clicking outside
const signInModal = document.getElementById('signInModal');
if (signInModal) {
    signInModal.addEventListener('click', (e) => {
        if (e.target === signInModal) {
            signInModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Handle Sign In Form Submission
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Sign In attempted with:', { email, password: '***' });
        alert('Sign In functionality - Connect to your authentication system');
    });
}

// Google Sign In Button
const googleSignInBtn = document.getElementById('googleSignInBtn');
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
        console.log('Google Sign In clicked');
        alert('Google Sign In --  OAuth integration to be added');
    });
}

// ===================================
// Event Handlers - Sign Up Modal
// ===================================

// Sign Up / Get Started Button - Opens Sign Up Modal
if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
        console.log('Get Started clicked');
        const signUpModal = document.getElementById('signUpModal');
        if (signUpModal) {
            signUpModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close Sign Up Modal Button
const closeSignUpModalBtn = document.getElementById('closeSignUpModal');
if (closeSignUpModalBtn) {
    closeSignUpModalBtn.addEventListener('click', () => {
        const signUpModal = document.getElementById('signUpModal');
        if (signUpModal) {
            signUpModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Back to Home from Sign Up
const backToHomeFromSignUp = document.getElementById('backToHomeFromSignUp');
if (backToHomeFromSignUp) {
    backToHomeFromSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        const signUpModal = document.getElementById('signUpModal');
        if (signUpModal) {
            signUpModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Sign In Link from Sign Up Modal - Switches Modals
const signInLinkFromSignUp = document.getElementById('signInLinkFromSignUp');
if (signInLinkFromSignUp) {
    signInLinkFromSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        const signUpModal = document.getElementById('signUpModal');
        const signInModal = document.getElementById('signInModal');

        if (signUpModal && signInModal) {
            signUpModal.classList.remove('active');
            setTimeout(() => {
                signInModal.classList.add('active');
            }, 200);
        }
    });
}

// Sign Up Link from Sign In Modal - Switches Modals
const signUpLink = document.getElementById('signUpLink');
if (signUpLink) {
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        const signInModal = document.getElementById('signInModal');
        const signUpModal = document.getElementById('signUpModal');

        if (signInModal && signUpModal) {
            signInModal.classList.remove('active');
            setTimeout(() => {
                signUpModal.classList.add('active');
            }, 200);
        }
    });
}

// Close sign-up modal when clicking outside
const signUpModal = document.getElementById('signUpModal');
if (signUpModal) {
    signUpModal.addEventListener('click', (e) => {
        if (e.target === signUpModal) {
            signUpModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Handle Sign Up Form Submission
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const roleKey = document.getElementById('signup-role-key').value;

        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Sign Up attempted with:', { username, email, password: '***', roleKey });
        alert('Sign Up functionality - Connect to your registration system\n\nRole Key: ' + roleKey);
    });
}

// Google Sign Up Button
const googleSignUpBtn = document.getElementById('googleSignUpBtn');
if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', () => {
        console.log('Google Sign Up clicked');
        alert('Google Sign Up - OAuth integration to be added');
    });
}

// Debug Login Button
const debugLoginBtn = document.getElementById('debugLoginBtn');
if (debugLoginBtn) {
    debugLoginBtn.addEventListener('click', () => {
        console.log('Debug Login clicked - Skipping authentication');
        alert('Debug Login - Bypassing authentication\n\nThis would normally redirect to the dashboard');
    });
}

// ===================================
// Other Interactions
// ===================================

// Learn More Button
if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
        console.log('Learn More clicked');
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ===================================
// Navigation Link Smooth Scrolling
// ===================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Only handle internal links (starting with #)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Add scroll effect to navbar
// ===================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===================================
// Parallax effect for orbs
// ===================================
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        const x = (mouseX - 0.5) * 50 * speed;
        const y = (mouseY - 0.5) * 50 * speed;

        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===================================
// Feature cards intersection observer
// ===================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===================================
// Console welcome message
// ===================================
console.log('%cLabTrack 🧪', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cLaboratory Inventory Management System', 'font-size: 14px; color: #a0a0a0;');
console.log('Built with ❤️ for efficient lab management');
