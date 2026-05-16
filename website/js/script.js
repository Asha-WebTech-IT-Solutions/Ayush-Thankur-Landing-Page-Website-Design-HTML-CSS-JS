/* ================================================
   ATF FITNESS — SCRIPT.JS
   Vanilla JS: Navbar, Animations, Form, Meta Pixel
   ================================================ */

// ----------------------------------------
// CONFIGURATION
// ----------------------------------------
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwuU0PP9cLILYTKWqwJNBfpf12MA-6a2UVS_fWH09UCkNMBmupSx8jfYhBSvEP8391Kvw/exec';
const RAZORPAY_URL = 'https://pages.razorpay.com/pl_ShGye4YSFY4899/view';

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
// VIDEO AUTOPLAY — Try unmuted, fallback to muted then unmute on interaction
// ----------------------------------------
(function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    if (!video) return;

    // First try unmuted autoplay (works on some browsers/when site has permission)
    video.muted = false;
    video.play().catch(() => {
        // Browser blocked unmuted autoplay — start muted, then unmute on first user tap/click
        video.muted = true;
        video.play().catch(() => {/* silent */});

        // Show a small tap-to-unmute hint and unmute on any interaction
        const unmuteOnce = () => {
            video.muted = false;
            document.removeEventListener('click', unmuteOnce, true);
            document.removeEventListener('touchend', unmuteOnce, true);
        };
        document.addEventListener('click', unmuteOnce, { once: true, capture: true });
        document.addEventListener('touchend', unmuteOnce, { once: true, capture: true });
    });
})();


// ----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        let href = this.getAttribute('href');
        // On mobile, Book Now buttons should scroll to form card directly (not section header)
        if (href === '#book-form' && window.innerWidth < 1024) {
            href = '#leadForm';
        }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 72;
            // Extra offset on mobile to account for sticky bars
            const extra = (href === '#leadForm' && window.innerWidth < 1024) ? 20 : 12;
            const top = target.getBoundingClientRect().top + window.scrollY - navH - extra;
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
            handleFormSuccess(name, email, phone);
        }
    });
}

function handleFormSuccess(name, email, phone) {
    // Meta Pixel InitiateCheckout event (form submit is pre-payment step)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_name: 'ATF ₹149 Consultation',
            value: 149,
            currency: 'INR',
        });
    }

    showFormMsg('Redirecting to secure payment...', 'success');

    // Normalize phone: strip non-digits, remove leading 91 (country code) or 0
    let digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
        digits = digits.slice(2);      // 917024315567 → 7024315567
    } else if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1);      // 07024315567 → 7024315567
    }

    // Razorpay Payment Page prefill — correct parameter names:
    //   full_name (NOT name), phone (NOT contact), email (unchanged)
    const params = new URLSearchParams({
        full_name : name,
        email     : email,
        phone     : digits,
    });
    const razorpayUrl = RAZORPAY_URL + '?' + params.toString();

    console.log('[ATF] Redirecting to:', razorpayUrl);

    // Small delay so the user sees the success state, then redirect to Razorpay
    setTimeout(() => {
        window.location.href = razorpayUrl;
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
    const avatarEl = document.getElementById('spAvatar');
    if (!popup || !textEl) return;

    const entries = [
        { name: 'Priya', city: 'Mumbai' },
        { name: 'Rohit', city: 'Bangalore' },
        { name: 'Aakash', city: 'Pune' },
        { name: 'Sneha', city: 'Delhi' },
        { name: 'Karan', city: 'Hyderabad' },
        { name: 'Aditi', city: 'Chennai' },
        { name: 'Vikas', city: 'Lucknow' },
        { name: 'Neha', city: 'Jaipur' },
        { name: 'Manish', city: 'Kolkata' },
        { name: 'Pooja', city: 'Ahmedabad' },
        { name: 'Sumit', city: 'Indore' },
        { name: 'Riya', city: 'Chandigarh' },
        { name: 'Rahul', city: 'Surat' },
        { name: 'Anjali', city: 'Nagpur' },
        { name: 'Deepak', city: 'Bhopal' },
        { name: 'Kavita', city: 'Nashik' },
        { name: 'Arjun', city: 'Coimbatore' },
        { name: 'Sonia', city: 'Patna' },
        { name: 'Gaurav', city: 'Rajkot' },
        { name: 'Pallavi', city: 'Vadodara' },
        { name: 'Nitin', city: 'Amritsar' },
        { name: 'Swati', city: 'Ludhiana' },
        { name: 'Vikram', city: 'Jodhpur' },
        { name: 'Geeta', city: 'Agra' },
        { name: 'Santosh', city: 'Mysuru' },
        { name: 'Ananya', city: 'Kochi' },
        { name: 'Ajit', city: 'Kolhapur' },
        { name: 'Leena', city: 'Thane' },
        { name: 'Suresh', city: 'Visakhapatnam' },
        { name: 'Poonam', city: 'Faridabad' },
        { name: 'Ritesh', city: 'Navi Mumbai' },
        { name: 'Divya', city: 'Gurgaon' },
        { name: 'Mohit', city: 'Noida' },
        { name: 'Shreya', city: 'Vapi' },
        { name: 'Arun', city: 'Madurai' },
        { name: 'Nandini', city: 'Mysore' },
        { name: 'Harish', city: 'Mangalore' },
        { name: 'Meera', city: 'Trivandrum' },
        { name: 'Tarun', city: 'Guwahati' },
        { name: 'Preeti', city: 'Raipur' },
    ];

    // Avatar colours cycle
    const avatarColors = [
        '#2563EB','#DC2626','#16A34A','#D97706','#7C3AED','#0891B2','#BE185D'
    ];
    let colorIdx = 0;

    let idx = 0;
    function showNext() {
        // Don't show popup when user is on the booking form
        if (popup.getAttribute('data-form-visible') === 'true') return;

        const entry = entries[idx % entries.length];
        idx++;
        const initial = entry.name.charAt(0).toUpperCase();
        if (avatarEl) {
            avatarEl.textContent = initial;
            avatarEl.style.background = avatarColors[colorIdx % avatarColors.length];
            colorIdx++;
        }
        textEl.innerHTML = '<strong>' + entry.name + ' from ' + entry.city + '</strong> just booked a slot!';
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

// ---------- HIDE SOCIAL PROOF POPUP WHEN ON FORM SECTION ----------
(function initPopupFormHide() {
    const bookFormSection = document.getElementById('book-form');
    if (!bookFormSection) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const popup = document.getElementById('spNotification');
            if (!popup) return;
            if (entry.isIntersecting) {
                // Form section visible — hide popup and prevent showing
                popup.classList.remove('show');
                setTimeout(() => { popup.style.display = 'none'; }, 400);
                popup.setAttribute('data-form-visible', 'true');
            } else {
                popup.removeAttribute('data-form-visible');
            }
        });
    }, { threshold: 0.1 });
    observer.observe(bookFormSection);
})();

// ---------- DRAG-TO-SCROLL FOR TRANSFORMATION GRID ----------
(function initDragScroll() {
    const grid = document.getElementById('transformGrid');
    if (!grid) return;
    const wrapper = grid.parentElement; // .transform-scroll-wrapper has overflow-x: auto
    if (!wrapper) return;
    let isDown = false, startX, scrollLeft;
    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        grid.classList.add('dragging');
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });
    wrapper.addEventListener('mouseleave', () => { isDown = false; grid.classList.remove('dragging'); });
    wrapper.addEventListener('mouseup', () => { isDown = false; grid.classList.remove('dragging'); });
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        wrapper.scrollLeft = scrollLeft - walk;
    });
})();

// ---------- TRANSFORMATION PHOTO LIGHTBOX ----------
(function initLightbox() {
    const overlay = document.getElementById('lightboxOverlay');
    const img     = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const closeBtn= document.getElementById('lightboxClose');
    if (!overlay) return;

    // Open on t-card click — but only if not dragging
    let dragDistance = 0;
    const grid = document.getElementById('transformGrid');
    const wrapper = grid ? grid.parentElement : null;
    if (wrapper) {
        wrapper.addEventListener('mousedown', () => { dragDistance = 0; });
        wrapper.addEventListener('mousemove', () => { dragDistance++; });
    }

    document.querySelectorAll('.t-card[data-lb-img]').forEach(card => {
        // Support both click (desktop) and touchend (mobile)
        const openLightbox = (e) => {
            if (dragDistance > 5) return; // was a drag, not a tap/click
            e.preventDefault();
            const src  = card.getAttribute('data-lb-img');
            const name = card.getAttribute('data-lb-name') || '';
            img.src = src;
            img.alt = name + ' Transformation';
            caption.textContent = name + ' — Transformation Result';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        card.addEventListener('click', openLightbox);
        card.addEventListener('touchend', (e) => {
            dragDistance = 0; // reset drag counter on touch end — touch scroll handled by browser
            openLightbox(e);
        });
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { img.src = ''; }, 300);
    }
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();
