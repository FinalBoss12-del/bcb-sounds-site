// BCB Sounds V3 - Advanced Analytics & Tracking Module

// Google Analytics 4 initialization (placeholder - replace with your ID)
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Initialize GA4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

// Custom Analytics Module
const Analytics = {
    // Track custom events
    trackEvent: function(category, action, label = null, value = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
        
        // Also log to console in dev mode
        if (window.location.hostname === 'localhost') {
            console.log('📊 Analytics Event:', { category, action, label, value });
        }
        
        // Store in localStorage for offline tracking
        this.storeOfflineEvent({ category, action, label, value, timestamp: Date.now() });
    },
    
    // Store events when offline
    storeOfflineEvent: function(event) {
        const offlineEvents = JSON.parse(localStorage.getItem('bcb_offline_events') || '[]');
        offlineEvents.push(event);
        if (offlineEvents.length > 100) offlineEvents.shift(); // Keep max 100 events
        localStorage.setItem('bcb_offline_events', JSON.stringify(offlineEvents));
    },
    
    // Sync offline events when back online
    syncOfflineEvents: function() {
        const offlineEvents = JSON.parse(localStorage.getItem('bcb_offline_events') || '[]');
        if (offlineEvents.length > 0 && navigator.onLine) {
            offlineEvents.forEach(event => {
                this.trackEvent(event.category, event.action, event.label, event.value);
            });
            localStorage.removeItem('bcb_offline_events');
        }
    },
    
    // Track page views with custom dimensions
    trackPageView: function(pagePath, pageTitle) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: pagePath,
                page_title: pageTitle,
                user_type: this.getUserType(),
                session_duration: this.getSessionDuration()
            });
        }
    },
    
    // Get user type (new, returning, customer)
    getUserType: function() {
        const lastVisit = localStorage.getItem('bcb_last_visit');
        const isPurchaser = localStorage.getItem('bcb_customer') === 'true';
        
        if (isPurchaser) return 'customer';
        if (!lastVisit) return 'new';
        return 'returning';
    },
    
    // Track session duration
    getSessionDuration: function() {
        const sessionStart = sessionStorage.getItem('bcb_session_start');
        if (!sessionStart) return 0;
        return Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
    }
};

// Click Tracking Module
const ClickTracker = {
    init: function() {
        // Track all clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .trackable');
            if (!target) return;
            
            // Get tracking attributes
            const trackingData = {
                element: target.tagName.toLowerCase(),
                text: target.textContent.trim().substring(0, 50),
                href: target.href || null,
                id: target.id || null,
                classes: target.className || null,
                position: this.getElementPosition(target)
            };
            
            // Special tracking for key elements
            if (target.classList.contains('btn-primary')) {
                Analytics.trackEvent('CTA', 'click', trackingData.text, 1);
            } else if (target.classList.contains('btn-secondary')) {
                Analytics.trackEvent('Secondary_CTA', 'click', trackingData.text, 1);
            } else if (target.closest('.pricing-calculator')) {
                Analytics.trackEvent('Pricing', 'interact', trackingData.text, 1);
            } else if (target.closest('.chat-widget')) {
                Analytics.trackEvent('Chat', 'interact', trackingData.text, 1);
            }
            
            // Heatmap data collection
            this.recordClick(e.clientX, e.clientY, trackingData);
        });
    },
    
    getElementPosition: function(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: Math.round(rect.top + window.scrollY),
            left: Math.round(rect.left + window.scrollX)
        };
    },
    
    recordClick: function(x, y, data) {
        const clicks = JSON.parse(sessionStorage.getItem('bcb_clicks') || '[]');
        clicks.push({
            x: x,
            y: y,
            data: data,
            timestamp: Date.now(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
        
        if (clicks.length > 50) clicks.shift(); // Keep last 50 clicks
        sessionStorage.setItem('bcb_clicks', JSON.stringify(clicks));
    }
};

// A/B Testing Framework
const ABTest = {
    tests: {
        // Test 1: Hero CTA text
        heroCTA: {
            name: 'Hero CTA Text',
            variants: {
                A: { text: 'Try Free Demo', class: 'variant-a' },
                B: { text: 'Get Started Free', class: 'variant-b' }
            }
        },
        // Test 2: Pricing display
        pricingDisplay: {
            name: 'Pricing Display',
            variants: {
                A: { style: 'cards', class: 'pricing-cards' },
                B: { style: 'table', class: 'pricing-table' }
            }
        },
        // Test 3: Trust badges position
        trustBadges: {
            name: 'Trust Badges Position',
            variants: {
                A: { position: 'after-hero', class: 'trust-early' },
                B: { position: 'after-pricing', class: 'trust-late' }
            }
        }
    },
    
    // Initialize A/B tests
    init: function() {
        Object.keys(this.tests).forEach(testId => {
            const variant = this.getVariant(testId);
            this.applyVariant(testId, variant);
            
            // Track exposure
            Analytics.trackEvent('AB_Test', 'exposure', `${testId}_${variant}`, 1);
        });
    },
    
    // Get or assign variant
    getVariant: function(testId) {
        const stored = localStorage.getItem(`bcb_ab_${testId}`);
        if (stored) return stored;
        
        // Random assignment
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(`bcb_ab_${testId}`, variant);
        return variant;
    },
    
    // Apply variant changes
    applyVariant: function(testId, variant) {
        const test = this.tests[testId];
        const variantData = test.variants[variant];
        
        switch(testId) {
            case 'heroCTA':
                const ctaBtn = document.querySelector('.hero .btn-primary span');
                if (ctaBtn) {
                    ctaBtn.textContent = variantData.text;
                    ctaBtn.parentElement.classList.add(variantData.class);
                }
                break;
                
            case 'pricingDisplay':
                const pricingSection = document.querySelector('.pricing-calculator');
                if (pricingSection) {
                    pricingSection.classList.add(variantData.class);
                }
                break;
                
            case 'trustBadges':
                const trustSection = document.querySelector('.trust-section');
                if (trustSection && variantData.position === 'after-hero') {
                    const hero = document.querySelector('.hero');
                    hero.insertAdjacentElement('afterend', trustSection);
                }
                break;
        }
    },
    
    // Track conversion for a test
    trackConversion: function(testId, value = 1) {
        const variant = this.getVariant(testId);
        Analytics.trackEvent('AB_Test', 'conversion', `${testId}_${variant}`, value);
    }
};

// Scroll Tracking
const ScrollTracker = {
    milestones: [25, 50, 75, 90, 100],
    tracked: new Set(),
    
    init: function() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.checkMilestones(), 100);
        }, { passive: true });
    },
    
    checkMilestones: function() {
        const scrollPercent = this.getScrollPercent();
        
        this.milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !this.tracked.has(milestone)) {
                this.tracked.add(milestone);
                Analytics.trackEvent('Engagement', 'scroll_depth', `${milestone}%`, milestone);
            }
        });
    },
    
    getScrollPercent: function() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        return Math.min(100, Math.round((scrolled / docHeight) * 100));
    }
};

// Form Analytics
const FormTracker = {
    init: function() {
        // Track form interactions
        document.querySelectorAll('form').forEach(form => {
            const formName = form.id || 'unnamed-form';
            
            // Track form starts
            form.addEventListener('focusin', (e) => {
                if (!form.dataset.started) {
                    form.dataset.started = 'true';
                    Analytics.trackEvent('Form', 'start', formName, 1);
                }
            }, { once: true });
            
            // Track field interactions
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => {
                    const fieldName = field.name || field.id || 'unnamed-field';
                    Analytics.trackEvent('Form', 'field_complete', `${formName}_${fieldName}`, 1);
                });
            });
            
            // Track form submissions
            form.addEventListener('submit', (e) => {
                Analytics.trackEvent('Form', 'submit', formName, 1);
                
                // Track form data (anonymized)
                const formData = new FormData(form);
                const fields = Array.from(formData.keys());
                Analytics.trackEvent('Form', 'fields_submitted', fields.join(','), fields.length);
            });
        });
    },
    
    // Track form abandonment
    trackAbandonment: function(formName, lastField) {
        Analytics.trackEvent('Form', 'abandon', `${formName}_at_${lastField}`, 1);
    }
};

// Revenue Tracking
const RevenueTracker = {
    // Track pricing calculator interactions
    trackPricingInteraction: function(action, details) {
        Analytics.trackEvent('Revenue', action, details, 1);
    },
    
    // Track purchase intent
    trackPurchaseIntent: function(product, price) {
        Analytics.trackEvent('Revenue', 'purchase_intent', product, price);
        
        // Enhanced ecommerce tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'GBP',
                value: price,
                items: [{
                    item_id: product,
                    item_name: product,
                    price: price,
                    quantity: 1
                }]
            });
        }
    },
    
    // Track actual purchase (for thank you page)
    trackPurchase: function(orderId, total, items) {
        Analytics.trackEvent('Revenue', 'purchase', orderId, total);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: orderId,
                value: total,
                currency: 'GBP',
                items: items
            });
        }
        
        // Mark user as customer
        localStorage.setItem('bcb_customer', 'true');
    }
};

// User Behavior Tracking
const BehaviorTracker = {
    init: function() {
        // Track time on page
        this.startTime = Date.now();
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
                Analytics.trackEvent('Engagement', 'time_on_page', window.location.pathname, timeSpent);
            } else {
                this.startTime = Date.now();
            }
        });
        
        // Track rage clicks
        this.trackRageClicks();
        
        // Track copy events
        document.addEventListener('copy', () => {
            Analytics.trackEvent('Engagement', 'content_copied', window.getSelection().toString().substring(0, 50), 1);
        });
    },
    
    trackRageClicks: function() {
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 500) {
                clickCount++;
                if (clickCount >= 3) {
                    Analytics.trackEvent('UX', 'rage_click', e.target.tagName, clickCount);
                    clickCount = 0;
                }
            } else {
                clickCount = 1;
            }
            lastClickTime = now;
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set session start time
    if (!sessionStorage.getItem('bcb_session_start')) {
        sessionStorage.setItem('bcb_session_start', Date.now());
    }
    
    // Update last visit
    localStorage.setItem('bcb_last_visit', Date.now());
    
    // Initialize all modules
    ClickTracker.init();
    ScrollTracker.init();
    FormTracker.init();
    BehaviorTracker.init();
    ABTest.init();
    
    // Sync offline events if any
    Analytics.syncOfflineEvents();
    
    // Track initial page view
    Analytics.trackPageView(window.location.pathname, document.title);
    
    // Listen for online/offline events
    window.addEventListener('online', () => Analytics.syncOfflineEvents());
});

// Export for use in other scripts
window.BCBAnalytics = {
    Analytics,
    ABTest,
    RevenueTracker,
    FormTracker
};