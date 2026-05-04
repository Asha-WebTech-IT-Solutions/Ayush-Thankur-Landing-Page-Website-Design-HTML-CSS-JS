/* ================================================
   ATF FITNESS — SCRIPT.JS
   Vanilla JS: Navbar, Animations, Form, Meta Pixel
   ================================================ */

// ----------------------------------------
// CONFIGURATION
// ----------------------------------------
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwuU0PP9cLILYTKWqwJNBfpf12MA-6a2UVS_fWH09UCkNMBmupSx8jfYhBSvEP8391Kvw/exec';
const RAZORPAY_URL = 'https://rzp.io/rzp/giR3N1t';

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
// SCROLL TO TOP — REMOVED PER CLIENT REQUEST
// ----------------------------------------

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
        e.stopPropagation();

        // Get values
        const name = document.getElementById('fname')?.value.trim();
        const email = document.getElementById('femail')?.value.trim();
        const phone = document.getElementById('fphone')?.value.trim();

        // Basic validation
        if (!name || !email || !phone) {
            showFormMsg('Please fill in all required fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showFormMsg('Please enter a valid email address.', 'error');
            return;
        }
        if (!isValidPhone(phone)) {
            showFormMsg('Please enter a valid phone number.', 'error');
            return;
        }

        // Show loading state
        setLoading(true);

        const payload = {
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            name,
            email,
            phone,
            source: 'ATF Landing Page',
        };

        // Fire to Google Sheets, then redirect to Razorpay (success or fail)
        try {
            await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.warn('Sheet submission note:', err);
        } finally {
            handleFormSuccess();
        }
    });
}

function handleFormSuccess() {
    // Meta Pixel Lead + InitiateCheckout events
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'ATF ₹149 Consultation Lead',
            content_category: 'Fitness Coaching',
            value: 149,
            currency: 'INR',
        });
        fbq('track', 'InitiateCheckout', {
            content_name: 'ATF ₹149 Consultation',
            value: 149,
            currency: 'INR',
        });
    }

    showFormMsg('Redirecting to secure payment...', 'success');

    // Small delay so the user sees the success state, then redirect to Razorpay
    setTimeout(() => {
        window.location.href = RAZORPAY_URL;
    }, 600);
}

function setLoading(isLoading) {
    if (!submitBtn || !btnText || !btnLoader) return;
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline-flex';
    btnLoader.style.display = isLoading ? 'inline-flex' : 'none';
}

function showFormMsg(msg, type) {
    if (!formMsg) return;
    formMsg.textContent = msg;
    formMsg.className = `form-msg ${type}`;
    formMsg.style.display = 'block';
    if (type === 'error') {
        setTimeout(() => { formMsg.style.display = 'none'; }, 5000);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
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

// ----------------------------------------
// META PIXEL: TRACK SECTION VIEWS
// ----------------------------------------
(function setupPixelTracking() {
    const pixelTargets = [
        { id: 'services',         event: 'ViewContent', params: { content_name: 'Programs Section' } },
        { id: 'transformations',  event: 'ViewContent', params: { content_name: 'Transformations Section' } },
        { id: 'lead-form',        event: 'Contact',     params: { content_name: 'Lead Form Viewed' } },
        { id: 'offer',            event: 'ViewContent', params: { content_name: 'Offer Section' } },
    ];
    const firedEvents = new Set();
    const pixelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !firedEvents.has(entry.target.id)) {
                firedEvents.add(entry.target.id);
                const target = pixelTargets.find(t => t.id === entry.target.id);
                if (target && typeof fbq !== 'undefined') {
                    fbq('track', target.event, target.params);
                }
            }
        });
    }, { threshold: 0.3 });
    pixelTargets.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) pixelObserver.observe(el);
    });

    // Track form field interaction (Lead Intent)
    const firstInput = document.getElementById('fname');
    let formStartTracked = false;
    if (firstInput) {
        firstInput.addEventListener('focus', () => {
            if (!formStartTracked && typeof fbq !== 'undefined') {
                formStartTracked = true;
                fbq('track', 'Lead', { content_name: 'Form Started', status: 'started' });
            }
        });
    }
})();


// ====================================================
// VSL FEATURES — TIMER, SOCIAL PROOF, VIEWER COUNT, STICKY CTA
// ====================================================

// ---------- COUNTDOWN TIMER (24-hour rolling, persisted via localStorage) ----------
(function initCountdownTimer() {
    const hoursEl = document.getElementById('t-hours');
    const minsEl  = document.getElementById('t-mins');
    const secsEl  = document.getElementById('t-secs');
    if (!hoursEl || !minsEl || !secsEl) return;

    const STORAGE_KEY = 'atf_offer_deadline';
    const DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    let deadline = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    const now = Date.now();
    if (!deadline || isNaN(deadline) || deadline <= now) {
        deadline = now + DURATION_MS;
        localStorage.setItem(STORAGE_KEY, String(deadline));
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tick() {
        const remaining = Math.max(0, deadline - Date.now());
        const totalSecs = Math.floor(remaining / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        hoursEl.textContent = pad(h);
        minsEl.textContent  = pad(m);
        secsEl.textContent  = pad(s);

        if (remaining <= 0) {
            deadline = Date.now() + DURATION_MS;
            localStorage.setItem(STORAGE_KEY, String(deadline));
        }
    }
    tick();
    setInterval(tick, 1000);
})();

// ---------- LIVE VIEWER COUNT (fluctuating) ----------
(function initViewerCount() {
    const el = document.getElementById('viewerCount');
    if (!el) return;
    let count = 110 + Math.floor(Math.random() * 40);
    el.textContent = count;
    setInterval(() => {
        const delta = Math.floor(Math.random() * 7) - 3;
        count = Math.max(95, Math.min(168, count + delta));
        el.textContent = count;
    }, 3500);
})();

// ---------- SOCIAL PROOF POPUP ROTATION ----------
(function initSocialProofPopup() {
    const popup = document.getElementById('spNotification');
    const textEl = document.getElementById('spText');
    if (!popup || !textEl) return;

    const messages = [
        '<strong>Priya from Mumbai</strong> just booked',
        '<strong>Rohit from Bangalore</strong> just booked',
        '<strong>Aakash from Pune</strong> just booked',
        '<strong>Sneha from Delhi</strong> just booked',
        '<strong>Karan from Hyderabad</strong> just booked',
        '<strong>Aditi from Chennai</strong> just booked',
        '<strong>Vikas from Lucknow</strong> just booked',
        '<strong>Neha from Jaipur</strong> just booked',
        '<strong>Manish from Kolkata</strong> just booked',
        '<strong>Pooja from Ahmedabad</strong> just booked',
        '<strong>Sumit from Indore</strong> just booked',
        '<strong>Riya from Chandigarh</strong> just booked',
    ];

    let idx = 0;
    function showNext() {
        textEl.innerHTML = messages[idx % messages.length];
        idx++;
        popup.style.display = 'flex';
        void popup.offsetWidth;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => { popup.style.display = 'none'; }, 400);
        }, 4500);
    }

    setTimeout(() => {
        showNext();
        setInterval(showNext, 14000);
    }, 6000);
})();

// ---------- STICKY BOTTOM BOOK BAR (visible after hero, hidden near form) ----------
(function initStickyBookBar() {
    const stickyBar = document.getElementById('stickyBar');
    const heroSection = document.getElementById('hero');
    const bookForm = document.getElementById('book-form');
    if (!stickyBar || !heroSection) return;

    function updateStickyVisibility() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Hide the sticky bar as soon as the book-form section enters the viewport
        const formTop = bookForm ? bookForm.offsetTop - window.innerHeight + 80 : Number.MAX_SAFE_INTEGER;
        const scrollY = window.scrollY;
        if (scrollY > heroBottom && scrollY < formTop) {
            stickyBar.classList.add('visible');
        } else {
            stickyBar.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', updateStickyVisibility, { passive: true });
    window.addEventListener('resize', updateStickyVisibility);
    updateStickyVisibility();
})();
