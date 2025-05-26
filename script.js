// BCB Sounds - Enhanced JavaScript with 20 UX Improvements

// UX Improvement #1: Loading screen management
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hide');
    }, 1000);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Show toast notification
    showToast(`Switched to ${newTheme} mode`);
});

// Mobile Menu
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// UX Improvement #3: Progress bar indicator
const progressBar = document.getElementById('progress-bar');
const sections = document.querySelectorAll('section[id]');
const navLinksItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Update progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
    
    // Update active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
    
    // Show/hide back to top button
    const backToTop = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileToggle.textContent = '☰';
        }
    });
});

// UX Improvement #4: Animated counter
const counters = document.querySelectorAll('.counter');
const speed = 200;

const countUp = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// Trigger counter when in view
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp();
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelector('.social-proof')?.addEventListener('load', () => {
    counterObserver.observe(document.querySelector('.social-proof'));
});

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items with animation
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

// UX Improvement #8: Enhanced audio player
const playBtns = document.querySelectorAll('.play-btn');
let currentPlaying = null;

playBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const track = this.getAttribute('data-track');
        
        if (currentPlaying === this) {
            // Pause
            this.textContent = '▶';
            currentPlaying = null;
            showToast(`Paused: ${track}`);
        } else {
            // Stop all other tracks
            playBtns.forEach(b => b.textContent = '▶');
            
            // Play this track
            this.textContent = '⏸';
            currentPlaying = this;
            
            // Animate waveform
            const waveform = this.nextElementSibling;
            waveform.style.animation = 'wave 1.2s linear infinite';
            
            showToast(`Now playing: ${track}`);
        }
    });
});

// Pricing Calculator with visual feedback
const durationSlider = document.getElementById('duration');
const durationDisplay = document.getElementById('duration-display');
const styleRadios = document.querySelectorAll('input[name="style"]');
const deliverySelect = document.getElementById('delivery');
const priceDisplay = document.getElementById('calculated-price');

// UX Improvement #11: Price breakdown updates
const basePriceEl = document.getElementById('base-price');
const durationAdjEl = document.getElementById('duration-adjustment');
const styleAdjEl = document.getElementById('style-adjustment');
const deliveryAdjEl = document.getElementById('delivery-adjustment');

function calculatePrice() {
    let basePrice = 299;
    const duration = parseInt(durationSlider.value);
    
    // Update duration display
    durationDisplay.textContent = duration;
    
    // Duration pricing
    let durationAdj = 0;
    if (duration > 30) {
        durationAdj = (duration - 30) * 5;
    }
    basePriceEl.textContent = `$${basePrice}`;
    durationAdjEl.textContent = durationAdj > 0 ? `+$${durationAdj}` : '$0';
    
    basePrice += durationAdj;
    
    // Style multiplier
    const selectedStyle = document.querySelector('input[name="style"]:checked').value;
    const styleMultipliers = {
        'simple': 1,
        'standard': 1.5,
        'complex': 2
    };
    const styleMultiplier = styleMultipliers[selectedStyle];
    styleAdjEl.textContent = `×${styleMultiplier}`;
    basePrice *= styleMultiplier;
    
    // Delivery multiplier
    const deliveryMultipliers = {
        'standard': 1,
        'rush': 1.25,
        'urgent': 1.5
    };
    const deliveryMultiplier = deliveryMultipliers[deliverySelect.value];
    deliveryAdjEl.textContent = `×${deliveryMultiplier}`;
    basePrice *= deliveryMultiplier;
    
    // Animate price change
    const finalPrice = Math.round(basePrice);
    animateValue(priceDisplay, parseInt(priceDisplay.textContent), finalPrice, 500);
}

// UX Improvement #11: Smooth number animation
function animateValue(element, start, end, duration) {
    const range = end - start;
    let current = start;
    const increment = range / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Add event listeners
durationSlider.addEventListener('input', calculatePrice);
styleRadios.forEach(radio => radio.addEventListener('change', calculatePrice));
deliverySelect.addEventListener('change', calculatePrice);

// Initialize price
calculatePrice();

// UX Improvement #15: Form validation with real-time feedback
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const projectTypeSelect = document.getElementById('project-type');
const messageTextarea = document.getElementById('message');
const budgetCheckbox = document.getElementById('budget-confirm');
const formStatus = document.getElementById('form-status');

// UX Improvement #16: Character counter
const charCounter = document.querySelector('.char-counter');
messageTextarea.addEventListener('input', () => {
    const length = messageTextarea.value.length;
    charCounter.textContent = `${length} / 500`;
    if (length > 500) {
        charCounter.style.color = '#f44336';
    } else {
        charCounter.style.color = 'var(--text-secondary)';
    }
});

// Real-time validation
function validateField(field) {
    const errorMsg = field.nextElementSibling;
    let isValid = true;
    
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            errorMsg.textContent = 'Please enter a valid email';
            errorMsg.classList.add('show');
            field.classList.add('error');
            isValid = false;
        } else {
            errorMsg.classList.remove('show');
            field.classList.remove('error');
        }
    } else if (field.value.trim() === '') {
        errorMsg.textContent = 'This field is required';
        errorMsg.classList.add('show');
        field.classList.add('error');
        isValid = false;
    } else {
        errorMsg.classList.remove('show');
        field.classList.remove('error');
    }
    
    return isValid;
}

nameInput.addEventListener('blur', () => validateField(nameInput));
emailInput.addEventListener('blur', () => validateField(emailInput));
projectTypeSelect.addEventListener('change', () => validateField(projectTypeSelect));
messageTextarea.addEventListener('blur', () => validateField(messageTextarea));

// UX Improvement #17: Form submission with loading state
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isProjectValid = validateField(projectTypeSelect);
    const isMessageValid = validateField(messageTextarea);
    
    if (!isNameValid || !isEmailValid || !isProjectValid || !isMessageValid) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Check budget confirmation
    if (!budgetCheckbox.checked) {
        showToast('Please confirm you understand our pricing', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success
    submitBtn.classList.remove('loading');
    formStatus.textContent = 'Thank you! We\'ll be in touch within 2 hours.';
    formStatus.className = 'form-status success';
    formStatus.style.display = 'block';
    
    // Save to session storage
    sessionStorage.setItem('lastSubmission', JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        projectType: projectTypeSelect.value,
        message: messageTextarea.value,
        timestamp: new Date().toISOString()
    }));
    
    // Reset form
    contactForm.reset();
    charCounter.textContent = '0 / 500';
    
    // Show success toast
    showToast('Form submitted successfully! Check your email.');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
});

// Simple Chat Widget with enhanced UX
let chatMessages = [];

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
    
    // Focus input when opened
    if (chatWindow.classList.contains('active')) {
        chatWindow.querySelector('.chat-input').focus();
        
        // UX Improvement: Time-based greeting
        const hour = new Date().getHours();
        let greeting = 'Hi';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        else greeting = 'Good evening';
        
        if (chatMessages.length === 0) {
            addChatMessage('bot', `${greeting}! How can I help you with your music project today?`);
        }
    }
}

function addChatMessage(sender, message) {
    const messagesDiv = document.querySelector('.chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.textContent = message;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatMessages.push({ sender, message, timestamp: new Date() });
}

function handleChat(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const message = input.value.trim();
        
        if (message) {
            addChatMessage('user', message);
            input.value = '';
            
            // Simulate typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'message bot typing';
            typingMsg.textContent = '...';
            document.querySelector('.chat-messages').appendChild(typingMsg);
            
            setTimeout(() => {
                typingMsg.remove();
                
                // Smart responses based on keywords
                let response = '';
                if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
                    response = 'Our services start at $499 for custom jingles. Use our pricing calculator above for an instant quote!';
                } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('long')) {
                    response = 'Standard delivery is 7 days, but we offer rush options. What timeline works for your project?';
                } else if (message.toLowerCase().includes('revisions')) {
                    response = 'All packages include 2-3 revisions. We work until you\'re 100% satisfied!';
                } else {
                    response = 'Thanks for your message! Our team will respond within 1 hour. For immediate assistance, call 1-800-MUSIC.';
                }
                
                addChatMessage('bot', response);
            }, 1500);
        }
    }
}

// Service selection with session storage
function selectService(service, price) {
    sessionStorage.setItem('selectedService', service);
    sessionStorage.setItem('selectedPrice', price);
    
    // Update project type in form
    document.getElementById('project-type').value = service;
    
    // Smooth scroll to contact
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    showToast(`Selected: ${service} package ($${price})`);
}

// Start project from calculator
function startProject() {
    const price = document.getElementById('calculated-price').textContent;
    sessionStorage.setItem('calculatedPrice', price);
    
    // Pre-fill message
    const message = document.getElementById('message');
    const duration = document.getElementById('duration').value;
    const style = document.querySelector('input[name="style"]:checked').value;
    const delivery = document.getElementById('delivery').value;
    
    message.value = `I'm interested in a ${duration}-second ${style} music track with ${delivery} delivery. Estimated price: $${price}`;
    
    // Update character counter
    const charCounter = document.querySelector('.char-counter');
    charCounter.textContent = `${message.value.length} / 500`;
    
    // Scroll to contact
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    showToast('Project details transferred to contact form');
}

// UX Improvement #5: Service finder helper
function showServiceHelper() {
    const questions = [
        'What type of content are you creating?',
        'How long should the music be?',
        'What\'s your budget range?'
    ];
    
    // Simple implementation - in production, this would be a modal
    showToast('Service finder coming soon! For now, check our packages below.');
}

// UX Improvement #7: Testimonial carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

// Auto-play testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// UX Improvement #9: Load more functionality
const loadMoreBtn = document.getElementById('load-more');
let portfolioPage = 1;

loadMoreBtn?.addEventListener('click', () => {
    // Simulate loading more items
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        // In production, this would fetch from API
        showToast('No more projects to load');
        loadMoreBtn.textContent = 'No More Projects';
    }, 1000);
});

// UI Improvement #9: Back to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// UI Improvement #10: Toast notification system
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.borderColor = '#f44336';
    }
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Intersection Observer for animations
const observerOptionsAOS = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Add delay based on data-aos-delay
            const delay = entry.target.getAttribute('data-aos-delay');
            if (delay) {
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        }
    });
}, observerOptionsAOS);

// Observe all elements with data-aos
document.querySelectorAll('[data-aos]').forEach(element => {
    animateOnScroll.observe(element);
});

// UX Improvement: Remember user preferences
const preferences = {
    theme: localStorage.getItem('theme') || 'dark',
    lastVisit: localStorage.getItem('lastVisit'),
    visitCount: parseInt(localStorage.getItem('visitCount') || '0') + 1
};

// Update visit info
localStorage.setItem('lastVisit', new Date().toISOString());
localStorage.setItem('visitCount', preferences.visitCount);

// Show returning visitor message
if (preferences.visitCount > 1) {
    setTimeout(() => {
        showToast('Welcome back! Check out our new projects.');
    }, 2000);
}

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('.waveform').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.waveform').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close chat
    if (e.key === 'Escape') {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow.classList.contains('active')) {
            toggleChat();
        }
    }
    
    // Arrow keys for testimonials
    if (e.key === 'ArrowLeft') {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    } else if (e.key === 'ArrowRight') {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
});

// Initialize counters when in view
const socialProof = document.querySelector('.social-proof');
if (socialProof) {
    counterObserver.observe(socialProof);
}

// Performance optimization: Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

// Observe all images with data-src
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});