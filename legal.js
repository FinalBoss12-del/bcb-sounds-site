// BCB Sounds V3 - Legal Compliance & GDPR Module

const LegalCompliance = {
    // Configuration
    config: {
        cookieExpiry: 365, // days
        consentVersion: '1.0',
        requiredCookies: ['bcb_session', 'bcb_csrf'],
        analyticalCookies: ['_ga', '_gid', 'bcb_analytics'],
        marketingCookies: ['bcb_referral', 'bcb_campaign', 'fb_pixel'],
        privacyPolicyUrl: '/privacy',
        termsUrl: '/terms'
    },
    
    // Initialize legal compliance
    init: function() {
        this.checkCompliance();
        this.injectConsentBanner();
        this.setupEventListeners();
        this.handleDataRequests();
    },
    
    // Check current consent status
    checkCompliance: function() {
        const consent = this.getConsent();
        
        if (!consent || consent.version !== this.config.consentVersion) {
            this.showConsentBanner();
        } else {
            this.applyConsentSettings(consent);
        }
    },
    
    // Get stored consent
    getConsent: function() {
        const stored = localStorage.getItem('bcb_consent');
        return stored ? JSON.parse(stored) : null;
    },
    
    // Save consent choices
    saveConsent: function(choices) {
        const consent = {
            version: this.config.consentVersion,
            timestamp: Date.now(),
            choices: choices,
            ip: 'anonymized', // In production, anonymize IP
            userAgent: navigator.userAgent
        };
        
        localStorage.setItem('bcb_consent', JSON.stringify(consent));
        this.applyConsentSettings(consent);
        
        // Track consent given
        if (window.BCBAnalytics) {
            window.BCBAnalytics.Analytics.trackEvent('Legal', 'consent_given', JSON.stringify(choices), 1);
        }
    },
    
    // Apply consent settings
    applyConsentSettings: function(consent) {
        // Block/allow cookies based on consent
        if (!consent.choices.analytical) {
            this.blockAnalyticalCookies();
        }
        
        if (!consent.choices.marketing) {
            this.blockMarketingCookies();
        }
        
        // Update data attributes for CSS-based blocking
        document.documentElement.dataset.analyticsConsent = consent.choices.analytical;
        document.documentElement.dataset.marketingConsent = consent.choices.marketing;
    },
    
    // Inject consent banner HTML
    injectConsentBanner: function() {
        const bannerHTML = `
            <div id="gdpr-banner" class="gdpr-banner" style="display: none;">
                <div class="gdpr-content">
                    <div class="gdpr-main">
                        <h3>🍪 Cookie Consent</h3>
                        <p>We use cookies to enhance your experience, analyze traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.</p>
                        
                        <div class="gdpr-details" id="gdpr-details" style="display: none;">
                            <div class="cookie-category">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="essential-cookies" checked disabled>
                                    <span class="slider"></span>
                                    <span class="label">Essential Cookies</span>
                                </label>
                                <p class="cookie-desc">Required for the website to function properly. Cannot be disabled.</p>
                            </div>
                            
                            <div class="cookie-category">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="analytical-cookies" checked>
                                    <span class="slider"></span>
                                    <span class="label">Analytical Cookies</span>
                                </label>
                                <p class="cookie-desc">Help us understand how visitors interact with our website.</p>
                            </div>
                            
                            <div class="cookie-category">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="marketing-cookies" checked>
                                    <span class="slider"></span>
                                    <span class="label">Marketing Cookies</span>
                                </label>
                                <p class="cookie-desc">Used to track visitors across websites for marketing purposes.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="gdpr-actions">
                        <button class="gdpr-btn gdpr-settings" onclick="LegalCompliance.toggleDetails()">
                            Cookie Settings
                        </button>
                        <button class="gdpr-btn gdpr-reject" onclick="LegalCompliance.rejectAll()">
                            Reject All
                        </button>
                        <button class="gdpr-btn gdpr-accept" onclick="LegalCompliance.acceptAll()">
                            Accept All
                        </button>
                    </div>
                    
                    <div class="gdpr-links">
                        <a href="/privacy" target="_blank">Privacy Policy</a>
                        <span>•</span>
                        <a href="/terms" target="_blank">Terms of Service</a>
                    </div>
                </div>
            </div>
            
            <style>
                .gdpr-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: var(--card-bg);
                    border-top: 2px solid var(--primary-accent);
                    padding: 1.5rem;
                    z-index: 9999;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
                    animation: slideUp 0.5s ease-out;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                
                .gdpr-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .gdpr-main h3 {
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }
                
                .gdpr-main p {
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }
                
                .gdpr-details {
                    margin: 1rem 0;
                    padding: 1rem;
                    background: var(--primary-dark);
                    border-radius: 8px;
                }
                
                .cookie-category {
                    margin-bottom: 1rem;
                }
                
                .cookie-category:last-child {
                    margin-bottom: 0;
                }
                
                .cookie-switch {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-bottom: 0.25rem;
                }
                
                .cookie-switch input {
                    display: none;
                }
                
                .cookie-switch .slider {
                    width: 40px;
                    height: 20px;
                    background: var(--border-color);
                    border-radius: 20px;
                    margin-right: 0.75rem;
                    position: relative;
                    transition: background 0.3s;
                }
                
                .cookie-switch .slider::after {
                    content: '';
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.3s;
                }
                
                .cookie-switch input:checked + .slider {
                    background: var(--primary-accent);
                }
                
                .cookie-switch input:checked + .slider::after {
                    transform: translateX(20px);
                }
                
                .cookie-switch input:disabled + .slider {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .cookie-switch .label {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .cookie-desc {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-left: 3.5rem;
                }
                
                .gdpr-actions {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }
                
                .gdpr-btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                    min-width: 120px;
                }
                
                .gdpr-settings {
                    background: transparent;
                    border: 2px solid var(--border-color);
                    color: var(--text-primary);
                }
                
                .gdpr-reject {
                    background: transparent;
                    border: 2px solid var(--primary-accent);
                    color: var(--primary-accent);
                }
                
                .gdpr-accept {
                    background: var(--primary-accent);
                    color: white;
                }
                
                .gdpr-links {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-align: center;
                }
                
                .gdpr-links a {
                    color: var(--text-secondary);
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .gdpr-banner {
                        padding: 1rem;
                    }
                    
                    .gdpr-actions {
                        flex-direction: column;
                    }
                    
                    .gdpr-btn {
                        width: 100%;
                    }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
    },
    
    // Show consent banner
    showConsentBanner: function() {
        const banner = document.getElementById('gdpr-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    },
    
    // Hide consent banner
    hideConsentBanner: function() {
        const banner = document.getElementById('gdpr-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.5s ease-out';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 500);
        }
    },
    
    // Toggle details view
    toggleDetails: function() {
        const details = document.getElementById('gdpr-details');
        if (details) {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    // Accept all cookies
    acceptAll: function() {
        this.saveConsent({
            essential: true,
            analytical: true,
            marketing: true
        });
        this.hideConsentBanner();
    },
    
    // Reject non-essential cookies
    rejectAll: function() {
        this.saveConsent({
            essential: true,
            analytical: false,
            marketing: false
        });
        this.hideConsentBanner();
        this.deleteNonEssentialCookies();
    },
    
    // Accept selected cookies
    acceptSelected: function() {
        const analytical = document.getElementById('analytical-cookies').checked;
        const marketing = document.getElementById('marketing-cookies').checked;
        
        this.saveConsent({
            essential: true,
            analytical: analytical,
            marketing: marketing
        });
        this.hideConsentBanner();
    },
    
    // Delete non-essential cookies
    deleteNonEssentialCookies: function() {
        const allCookies = document.cookie.split(';');
        
        allCookies.forEach(cookie => {
            const [name] = cookie.split('=').map(c => c.trim());
            
            if (!this.config.requiredCookies.includes(name)) {
                // Delete cookie
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            }
        });
    },
    
    // Block analytical cookies
    blockAnalyticalCookies: function() {
        // Remove GA cookies
        this.config.analyticalCookies.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        // Disable GA
        window['ga-disable-' + (window.GA_MEASUREMENT_ID || '')] = true;
    },
    
    // Block marketing cookies
    blockMarketingCookies: function() {
        this.config.marketingCookies.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Listen for custom consent events
        document.addEventListener('bcb:requestConsent', () => {
            this.showConsentBanner();
        });
        
        document.addEventListener('bcb:updateConsent', (e) => {
            this.saveConsent(e.detail);
        });
    },
    
    // Handle GDPR data requests
    handleDataRequests: function() {
        // Data export functionality
        window.BCBDataExport = {
            exportUserData: function() {
                const userData = {
                    consent: LegalCompliance.getConsent(),
                    localStorage: { ...localStorage },
                    sessionStorage: { ...sessionStorage },
                    cookies: document.cookie,
                    timestamp: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bcb-sounds-data-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                if (window.BCBAnalytics) {
                    window.BCBAnalytics.Analytics.trackEvent('Legal', 'data_exported', 'user_request', 1);
                }
            },
            
            deleteUserData: function() {
                if (confirm('This will delete all your data from this website. This action cannot be undone. Continue?')) {
                    // Clear all storage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Clear all cookies
                    document.cookie.split(';').forEach(cookie => {
                        const [name] = cookie.split('=').map(c => c.trim());
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    });
                    
                    alert('Your data has been deleted. The page will now reload.');
                    window.location.reload();
                }
            }
        };
    }
};

// Privacy Shield for forms
const PrivacyShield = {
    // Anonymize IP addresses
    anonymizeIP: function(ip) {
        const parts = ip.split('.');
        if (parts.length === 4) {
            parts[3] = '0';
            return parts.join('.');
        }
        return 'anonymous';
    },
    
    // Encrypt sensitive data
    encryptData: function(data) {
        // Simple obfuscation for demo - use proper encryption in production
        return btoa(encodeURIComponent(JSON.stringify(data)));
    },
    
    // Decrypt data
    decryptData: function(encrypted) {
        try {
            return JSON.parse(decodeURIComponent(atob(encrypted)));
        } catch (e) {
            return null;
        }
    },
    
    // Secure form submission
    secureFormSubmit: function(formData) {
        const consent = LegalCompliance.getConsent();
        
        if (!consent || !consent.choices.essential) {
            alert('Cookie consent is required to submit forms.');
            return false;
        }
        
        // Add consent info to form data
        formData.append('consent_version', consent.version);
        formData.append('consent_timestamp', consent.timestamp);
        
        return true;
    }
};

// Terms of Service Acceptance
const TermsManager = {
    currentVersion: '2.0',
    
    checkAcceptance: function() {
        const accepted = localStorage.getItem('bcb_terms_accepted');
        const acceptedVersion = localStorage.getItem('bcb_terms_version');
        
        if (!accepted || acceptedVersion !== this.currentVersion) {
            this.showTermsPrompt();
        }
    },
    
    showTermsPrompt: function() {
        const promptHTML = `
            <div id="terms-prompt" class="terms-prompt">
                <div class="terms-content">
                    <h3>Updated Terms of Service</h3>
                    <p>We've updated our Terms of Service and Privacy Policy. Please review and accept to continue.</p>
                    <div class="terms-actions">
                        <a href="/terms" target="_blank" class="terms-link">Read Terms</a>
                        <a href="/privacy" target="_blank" class="terms-link">Read Privacy Policy</a>
                        <button onclick="TermsManager.acceptTerms()" class="terms-accept">Accept & Continue</button>
                    </div>
                </div>
            </div>
            
            <style>
                .terms-prompt {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .terms-content {
                    background: var(--card-bg);
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 500px;
                    text-align: center;
                }
                
                .terms-content h3 {
                    margin-bottom: 1rem;
                }
                
                .terms-actions {
                    margin-top: 1.5rem;
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .terms-link {
                    color: var(--primary-accent);
                    text-decoration: underline;
                }
                
                .terms-accept {
                    background: var(--primary-accent);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', promptHTML);
    },
    
    acceptTerms: function() {
        localStorage.setItem('bcb_terms_accepted', 'true');
        localStorage.setItem('bcb_terms_version', this.currentVersion);
        
        const prompt = document.getElementById('terms-prompt');
        if (prompt) prompt.remove();
        
        if (window.BCBAnalytics) {
            window.BCBAnalytics.Analytics.trackEvent('Legal', 'terms_accepted', this.currentVersion, 1);
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    LegalCompliance.init();
    
    // Check terms after a delay to not overwhelm users
    setTimeout(() => {
        TermsManager.checkAcceptance();
    }, 2000);
});

// Export for global use
window.LegalCompliance = LegalCompliance;
window.PrivacyShield = PrivacyShield;
window.TermsManager = TermsManager;