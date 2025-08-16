/*
EDIT GUIDE:
- Form handling: Update email and Formspree URL in submitForm function
- Smooth scroll: Modify scroll behavior in setupSmoothScroll function  
- Animations: Edit intersection observer thresholds and classes
- Contact form: Switch between mailto and Formspree by editing CONTACT_METHOD
*/

// Configuration - Edit these values
const CONFIG = {
    CONTACT_METHOD: 'mailto', // 'mailto' or 'formspree'
    FORMSPREE_URL: 'https://formspree.io/f/your-form-id', // Replace with your Formspree URL
    EMAIL: 'garethbowers@hotmail.com',
    TOAST_DURATION: 5000
};

// DOM Elements
const navbar = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
    setupNavbarScroll();
    setupFAQAccordion();
    setupPricingHover();
    setupFormValidation();
    setupLazyLoading();
    logPageView();
});

// Smooth scroll for navigation links
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add shadow when scrolled
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// FAQ Accordion functionality
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Pricing card hover effects
function setupPricingHover() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('pricing-featured')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Form validation and submission
function setupFormValidation() {
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Display error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearError(field);
    }
    
    return isValid;
}

// Full form validation
function validateForm() {
    const inputs = contactForm.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        field.style.borderColor = '#ef4444';
    }
}

// Clear field error
function clearError(field) {
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        field.style.borderColor = '';
    }
}

// Get field label for error messages
function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'business': 'Business',
        'need': 'What you need',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

// Submit form
async function submitForm() {
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        if (CONFIG.CONTACT_METHOD === 'formspree') {
            // Formspree submission
            const response = await fetch(CONFIG.FORMSPREE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } else {
            // Mailto fallback
            const subject = encodeURIComponent(`SmartFlow Systems Inquiry from ${data.name}`);
            const body = encodeURIComponent(
                `Name: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Business: ${data.business}\n` +
                `Need: ${data.need}\n\n` +
                `Message:\n${data.message || 'No additional message provided.'}`
            );
            
            window.location.href = `mailto:${CONFIG.EMAIL}?subject=${subject}&body=${body}`;
            showToast('Opening your email client...', 'success');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('Failed to send message. Please try again or contact me directly.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Trigger reflow to ensure transition works
    toast.offsetHeight;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, CONFIG.TOAST_DURATION);
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Simple analytics tracking
function logPageView() {
    // Replace with Google Analytics or your preferred analytics
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Console log for development
    console.log('SmartFlow Systems - Page viewed:', {
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
}

// Track button clicks for analytics
function trackButtonClick(buttonText, section) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            event_category: 'Button',
            event_label: buttonText,
            event_section: section
        });
    }
    
    console.log('Button clicked:', { buttonText, section });
}

// Add click tracking to all CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const section = this.closest('section')?.id || 'unknown';
            trackButtonClick(buttonText, section);
        });
    });
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Focus management for better accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // Escape key to close FAQ items
    if (e.key === 'Escape') {
        const activeFAQ = document.querySelector('.faq-item.active');
        if (activeFAQ) {
            activeFAQ.classList.remove('active');
            activeFAQ.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            activeFAQ.querySelector('.faq-question').focus();
        }
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Smooth reveal animations on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.system-card, .pricing-card, .metric');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations after DOM load
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.error('SmartFlow Systems - JavaScript Error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`SmartFlow Systems - Page loaded in ${Math.round(loadTime)}ms`);
    
    // Check for performance issues
    if (loadTime > 3000) {
        console.warn('SmartFlow Systems - Slow page load detected');
    }
});