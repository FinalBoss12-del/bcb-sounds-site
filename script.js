// BCB Sounds V3 - Clean JavaScript (Popups Removed)

// Loading screen management
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hide');
        }
    }, 800);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Menu
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
}

// Progress bar (if on index.html)
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Smooth scrolling for anchor links (single page only)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Chat Widget
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            const chatInput = chatWindow.querySelector('.chat-input');
            if (chatInput) chatInput.focus();
        }
    }
}

function handleChat(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const message = input.value.trim();
        
        if (message) {
            addChatMessage('user', message);
            input.value = '';
            
            // Simple bot response
            setTimeout(() => {
                let response = 'Thanks for your message! ';
                
                if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                    response += 'Our services start at £20. Check our pricing page for details!';
                } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('long')) {
                    response += 'We deliver most projects within 24-48 hours.';
                } else if (message.toLowerCase().includes('rights') || message.toLowerCase().includes('license')) {
                    response += 'You get full commercial rights with every purchase!';
                } else {
                    response += 'For immediate assistance, please email hello@bcbsounds.com or use our contact form.';
                }
                
                addChatMessage('bot', response);
            }, 1000);
        }
    }
}

function addChatMessage(sender, message) {
    const messagesDiv = document.querySelector('.chat-messages');
    if (messagesDiv) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        messageEl.textContent = message;
        messagesDiv.appendChild(messageEl);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Portfolio Filter (if on page with portfolio)
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

// Enhanced audio player
const playBtns = document.querySelectorAll('.play-btn');
let currentPlaying = null;

playBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const track = this.getAttribute('data-track');
        
        if (currentPlaying === this) {
            this.textContent = '▶';
            currentPlaying = null;
        } else {
            playBtns.forEach(b => b.textContent = '▶');
            this.textContent = '⏸';
            currentPlaying = this;
            
            const waveform = this.nextElementSibling;
            if (waveform) {
                waveform.style.animation = 'wave 1.2s linear infinite';
            }
        }
    });
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simple animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            const delay = entry.target.getAttribute('data-aos-delay');
            if (delay) {
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(element => {
    animateOnScroll.observe(element);
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // Mark active navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', isMobile);
    }, 250);
});

// Export functions for global use
window.toggleChat = toggleChat;
window.handleChat = handleChat;