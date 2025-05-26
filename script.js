// BCB Sounds - Enhanced JavaScript (Chatbot Removed)

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    
    init() {
        document.body.setAttribute('data-theme', this.theme);
        this.setupToggle();
    }
    
    setupToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
    }
    
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Animate theme change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        this.setupProgressBar();
    }
    
    setupMobileMenu() {
        if (this.mobileToggle && this.navLinks) {
            this.mobileToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
                this.mobileToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container')) {
                    this.navLinks.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            });
            
            // Close mobile menu when clicking on a link
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    this.navLinks.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            });
        }
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });
    }
    
    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + '%';
            });
        }
    }
}

// Form Validation and Management
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => this.setupForm(form));
    }
    
    setupForm(form) {
        // Real-time validation
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    }
    
    validateField(field) {
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearError(field);
        
        // Required field check
        if (field.required && !field.value.trim()) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    async handleSubmit(e, form) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = form.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showToast('Please correct the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        this.setButtonLoading(submitBtn, true);
        
        try {
            // Simulate form submission
            await this.simulateSubmission();
            
            // Success
            showToast('Form submitted successfully!', 'success');
            form.reset();
            
        } catch (error) {
            showToast('Failed to submit form. Please try again.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false, originalText);
        }
    }
    
    setButtonLoading(button, loading, originalText = '') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="btn-loader">
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                </span>
                <span>Processing...</span>
            `;
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }
    
    async simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
}

// Toast Notification System
function showToast(message, type = 'info', duration = 4000) {
    const container = getToastContainer();
    const toast = createToastElement(message, type);
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => removeToast(toast));
}

function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    return toast;
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function removeToast(toast) {
    toast.style.animation = 'toast-slide-out 0.3s ease forwards';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Audio Player Management
class AudioPlayerManager {
    constructor() {
        this.currentlyPlaying = null;
        this.init();
    }
    
    init() {
        this.setupPlayButtons();
    }
    
    setupPlayButtons() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlay(e));
        });
    }
    
    async handlePlay(e) {
        const button = e.currentTarget;
        const audioContainer = button.closest('.audio-player-enhanced') || button.closest('.mini-player');
        const audio = audioContainer.querySelector('audio');
        
        if (!audio) {
            showToast('Audio not available', 'error');
            return;
        }
        
        // Stop currently playing audio
        if (this.currentlyPlaying && this.currentlyPlaying !== audio) {
            this.stopAudio(this.currentlyPlaying);
        }
        
        if (audio.paused) {
            try {
                await audio.play();
                this.startAudio(audio, button);
            } catch (error) {
                showToast('Unable to play audio', 'error');
            }
        } else {
            this.stopAudio(audio);
        }
    }
    
    startAudio(audio, button) {
        this.currentlyPlaying = audio;
        this.updateButtonState(button, true);
        this.startWaveformAnimation(button);
        
        audio.addEventListener('ended', () => {
            this.stopAudio(audio);
        }, { once: true });
    }
    
    stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
        
        const container = audio.closest('.audio-player-enhanced') || audio.closest('.mini-player');
        const button = container.querySelector('.play-btn');
        
        this.updateButtonState(button, false);
        this.stopWaveformAnimation(button);
        
        if (this.currentlyPlaying === audio) {
            this.currentlyPlaying = null;
        }
    }
    
    updateButtonState(button, playing) {
        const playIcon = button.querySelector('.play-icon');
        const pauseIcon = button.querySelector('.pause-icon');
        
        if (playIcon && pauseIcon) {
            playIcon.style.display = playing ? 'none' : 'inline';
            pauseIcon.style.display = playing ? 'inline' : 'none';
        } else {
            button.textContent = playing ? '⏸' : '▶';
        }
    }
    
    startWaveformAnimation(button) {
        const container = button.closest('.audio-player-enhanced') || button.closest('.mini-player');
        const waveformBars = container.querySelectorAll('.waveform-bar, .waveform span');
        
        waveformBars.forEach((bar, index) => {
            bar.style.animation = `waveform 1.5s ease-in-out infinite`;
            bar.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    stopWaveformAnimation(button) {
        const container = button.closest('.audio-player-enhanced') || button.closest('.mini-player');
        const waveformBars = container.querySelectorAll('.waveform-bar, .waveform span');
        
        waveformBars.forEach(bar => {
            bar.style.animation = '';
        });
    }
}

// FAQ Management
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current FAQ
    faqItem.classList.toggle('active');
    
    // Track analytics
    if (window.BCBAnalytics) {
        const question = button.textContent.trim();
        window.BCBAnalytics.Analytics.trackEvent('FAQ', isActive ? 'close' : 'open', question, 1);
    }
}

// Loading Screen Management
class LoadingManager {
    constructor() {
        this.loader = document.getElementById('loader');
        this.init();
    }
    
    init() {
        if (!this.loader) return;
        
        // Hide loader when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });
        
        // Fallback: hide after 3 seconds
        setTimeout(() => this.hide(), 3000);
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('hide');
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 500);
        }
    }
}

// Scroll Management
class ScrollManager {
    constructor() {
        this.backToTopButton = document.getElementById('back-to-top');
        this.init();
    }
    
    init() {
        this.setupBackToTop();
        this.setupScrollAnimations();
    }
    
    setupBackToTop() {
        if (!this.backToTopButton) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopButton.classList.add('show');
            } else {
                this.backToTopButton.classList.remove('show');
            }
        });
        
        this.backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[data-aos]').forEach(element => {
            observer.observe(element);
        });
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function selectService(service, price) {
    sessionStorage.setItem('selectedService', service);
    sessionStorage.setItem('selectedPrice', price);
    
    // Redirect to contact page with service pre-selected
    window.location.href = `contact.html?service=${service}&price=${price}`;
}

// Portfolio Filter Management
class PortfolioManager {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item, .sample-card');
        this.init();
    }
    
    init() {
        if (this.filterBtns.length === 0) return;
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }
    
    handleFilter(e) {
        const button = e.target;
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter items
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Track analytics
        if (window.BCBAnalytics) {
            window.BCBAnalytics.Analytics.trackEvent('Portfolio', 'filter', filter, 1);
        }
    }
}

// Service Selection
function handleServiceSelection(service, element) {
    // Visual feedback
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
    
    // Store selection
    sessionStorage.setItem('selectedService', service);
    
    // Show confirmation
    showToast(`${service} package selected!`, 'success');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = `contact.html?package=${service}`;
    }, 1000);
}

// Pricing Calculator Enhancement
function calculatePrice() {
    const packageInputs = document.querySelectorAll('input[name="package"]');
    const addonInputs = document.querySelectorAll('input[name="addon"]');
    
    let basePrice = 0;
    let addonsPrice = 0;
    let isRushDelivery = false;
    
    // Get base package price
    packageInputs.forEach(input => {
        if (input.checked) {
            basePrice = parseFloat(input.dataset.price || 0);
        }
    });
    
    // Calculate add-ons
    if (addonInputs.length > 0) {
        addonInputs.forEach(input => {
            if (input.checked) {
                if (input.dataset.price) {
                    addonsPrice += parseFloat(input.dataset.price);
                }
                if (input.dataset.multiplier) {
                    isRushDelivery = true;
                }
            }
        });
    }
    
    // Apply rush delivery multiplier
    let subtotal = basePrice + addonsPrice;
    if (isRushDelivery) {
        subtotal = subtotal * 1.5;
    }
    
    // Update display
    const priceDisplay = document.getElementById('calculated-price');
    if (priceDisplay) {
        priceDisplay.textContent = Math.round(subtotal);
    }
    
    return subtotal;
}

// Enhanced Modal System
function showModal(content, className = '') {
    const modalHtml = `
        <div class="modal ${className}" id="temp-modal" style="display: flex;">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('temp-modal')" aria-label="Close modal">×</button>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal('temp-modal');
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
    
    // Close on backdrop click
    const modal = document.getElementById('temp-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('temp-modal');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Session Management
class SessionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateLastVisit();
        this.setSessionStart();
        this.trackUserType();
    }
    
    updateLastVisit() {
        localStorage.setItem('bcb_last_visit', Date.now());
    }
    
    setSessionStart() {
        if (!sessionStorage.getItem('bcb_session_start')) {
            sessionStorage.setItem('bcb_session_start', Date.now());
        }
    }
    
    trackUserType() {
        const lastVisit = localStorage.getItem('bcb_last_visit');
        const userType = lastVisit ? 'returning' : 'new';
        sessionStorage.setItem('bcb_user_type', userType);
    }
    
    getSessionDuration() {
        const sessionStart = sessionStorage.getItem('bcb_session_start');
        if (!sessionStart) return 0;
        return Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core managers
    new ThemeManager();
    new NavigationManager();
    new FormManager();
    new LoadingManager();
    new ScrollManager();
    new SessionManager();
    new AudioPlayerManager();
    new PortfolioManager();
    
    // Initialize pricing calculator if present
    const priceInputs = document.querySelectorAll('input[name="package"], input[name="addon"]');
    if (priceInputs.length > 0) {
        priceInputs.forEach(input => {
            input.addEventListener('change', calculatePrice);
        });
        calculatePrice(); // Initial calculation
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes waveform {
            0%, 100% { height: 8px; }
            25% { height: 16px; }
            50% { height: 24px; }
            75% { height: 12px; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes toast-slide-out {
            to { 
                transform: translateX(100%); 
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Track page view
    if (window.BCBAnalytics) {
        window.BCBAnalytics.Analytics.trackPageView(window.location.pathname, document.title);
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', isMobile);
    }, 250);
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any playing audio
        const audioManager = window.audioManager;
        if (audioManager && audioManager.currentlyPlaying) {
            audioManager.stopAudio(audioManager.currentlyPlaying);
        }
    }
});

// Export utility functions for global use
window.showToast = showToast;
window.showModal = showModal;
window.closeModal = closeModal;
window.toggleFAQ = toggleFAQ;
window.scrollToTop = scrollToTop;
window.scrollToSection = scrollToSection;
window.selectService = selectService;
window.calculatePrice = calculatePrice;