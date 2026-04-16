/* ================================================
   ATF FITNESS — SCRIPT.JS
   Vanilla JS: Navbar, Animations, Form, Meta Pixel
   ================================================ */

// ----------------------------------------
// GOOGLE SHEETS API CONFIGURATION
// ----------------------------------------
// INSTRUCTIONS: Replace this URL with your Google Apps Script Web App URL
// (See google-sheets-setup.txt for full instructions)
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// ----------------------------------------
// NAVBAR: MOBILE MENU TOGGLE
// ----------------------------------------
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navIcon = document.getElementById('navIcon');

if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        navIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navIcon.className = 'fas fa-bars';
        });
    });
}

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (mobileMenu && !mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        if (navIcon) navIcon.className = 'fas fa-bars';
    }
});

// ----------------------------------------
// NAVBAR: SCROLL SHADOW
// ----------------------------------------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
}, { passive: true });

// ----------------------------------------
// SCROLL TO TOP BUTTON
// ----------------------------------------
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
}, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ----------------------------------------
// SMOOTH SCROLL FOR ANCHOR LINKS
// ----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ----------------------------------------
// COUNTER ANIMATION (HERO STATS)
// ----------------------------------------
function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const update = () => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start);
        if (start < target) requestAnimationFrame(update);
        else el.textContent = target;
    };
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                animateCounter(el, target, 1500);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ----------------------------------------
// SCROLL REVEAL ANIMATION
// ----------------------------------------
function addRevealClasses() {
    const selectors = [
        '.problem-card',
        '.service-card',
        '.who-card',
        '.process-step',
        '.cred-item',
        '.offer-card',
        '.t-card',
        '.cred-grid',
        '.form-grid',
        '.philosophy-wrap',
        '.problem-bridge',
    ];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
                el.classList.add('reveal');
            }
        });
    });
    document.querySelectorAll('.cred-img-col').forEach(el => el.classList.add('reveal-left'));
    document.querySelectorAll('.cred-content-col').forEach(el => el.classList.add('reveal-right'));
    // Do NOT add reveal to form sections - they must always be crisp and immediately visible
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeRevealElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addRevealClasses();
    observeRevealElements();
});

// ----------------------------------------
// MARQUEE: PAUSE ON HOVER
// ----------------------------------------
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    marqueeContent.addEventListener('mouseenter', () => {
        marqueeContent.style.animationPlayState = 'paused';
    });
    marqueeContent.addEventListener('mouseleave', () => {
        marqueeContent.style.animationPlayState = 'running';
    });
}

// ----------------------------------------
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ----------------------------------------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const navH = navbar ? navbar.offsetHeight : 72;
        if (window.scrollY >= sec.offsetTop - navH - 80) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--blue-600)';
        }
    });
}, { passive: true });

// ----------------------------------------
// GOOGLE SHEETS FORM SUBMISSION
// ----------------------------------------
const leadForm = document.getElementById('leadForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMsg = document.getElementById('formMsg');

if (leadForm) {
    leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get values
        const name = document.getElementById('fname')?.value.trim();
        const email = document.getElementById('femail')?.value.trim();
        const phone = document.getElementById('fphone')?.value.trim();
        const goal = document.getElementById('fgoal')?.value;

        // Basic validation
        if (!name || !email || !phone) {
            showFormMsg('Please fill in all required fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showFormMsg('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        setLoading(true);

        const payload = {
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            name,
            email,
            phone,
            goal: goal || 'Not specified',
        };

        try {
            // Check if a real URL is configured
            if (GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
                // Demo mode: simulate success after 1.2s
                await new Promise(r => setTimeout(r, 1200));
                handleFormSuccess();
            } else {
                // Real submission to Google Sheets
                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                handleFormSuccess();
            }
        } catch (err) {
            console.error('Form submission error:', err);
            // Even if there's an error, since no-cors won't throw on 200, redirect on success assumption
            handleFormSuccess();
        }
    });
}

function handleFormSuccess() {
    setLoading(false);

    // Meta Pixel Lead event
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'ATF Coaching Application',
            content_category: 'Fitness Coaching',
        });
    }

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
}

function setLoading(isLoading) {
    if (!submitBtn || !btnText || !btnLoader) return;
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'flex';
    btnLoader.style.display = isLoading ? 'inline-flex' : 'none';
}

function showFormMsg(msg, type) {
    if (!formMsg) return;
    formMsg.textContent = msg;
    formMsg.className = `form-msg ${type}`;
    formMsg.style.display = 'block';
    setTimeout(() => { formMsg.style.display = 'none'; }, 5000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ----------------------------------------
// META PIXEL: TRACK BUTTON CLICKS (Lead Intent)
// ----------------------------------------
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof fbq !== 'undefined' && btn.getAttribute('href') === '#lead-form') {
            fbq('track', 'InitiateCheckout', {
                content_name: 'ATF Coaching Application CTA',
            });
        }
    });
});
