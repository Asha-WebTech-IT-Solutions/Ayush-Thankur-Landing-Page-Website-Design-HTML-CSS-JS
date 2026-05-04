# Ayush Thakur Fitness — Landing Page PRD

## Original Problem Statement
A high-converting fitness coaching landing page for "Ayush Thakur Fitness" (ATF) built in PURE HTML, CSS, and vanilla JavaScript (NO React, NO Tailwind, NO frameworks).

## Tech Stack (Locked)
- Pure HTML5, hand-written CSS (no Tailwind), vanilla JS
- FastAPI backend serves the static folder at `/api/website/` (so the existing platform routing works)
- MongoDB present but unused (the form submits to Google Sheets directly from the browser)

## Folder Structure
```
/app/
├── backend/
│   └── server.py              # FastAPI: mounts /app/website at /api/website
├── website/
│   ├── index.html             # Main landing page
│   ├── thankyou.html          # Legacy thank-you page (kept; not in current flow)
│   ├── css/style.css
│   ├── js/script.js
│   └── images/                # logo, transformations, coach
└── memory/
    ├── PRD.md                 # this file
    └── test_credentials.md
```

## Page Sequence (Final, VSL Layout)
1. Urgency banner (top) — “Only 3 slots left this week — 500+ transformed”
2. Live viewer bar — “127 people are viewing this right now” (fluctuates)
3. Navbar (sticky) with “Book ₹149” pulsing CTA
4. **Hero** — H1 + sub + stats + price block (₹1,999 → ₹149) + main CTA  •  YouTube video iframe (`6zso3gDedpo`, autoplay+mute+loop+controls)
5. Marquee strip (Fat Loss, Muscle Gain, PCOS, etc.)
6. **Results** (Transformations) — horizontal scroll grid of client photos
7. CTA strip 1 (light)
8. **About / Introduction** — coach photo + cred items + press pills (Hindustan Bytes, Daily Beat, INC91)
9. CTA strip 2 (dark / quote)
10. **Services** — 3 cards (Core, Advanced Health, High-Touch)
11. **Philosophy** — Average Coaching vs The ATF Way + quote
12. **Timer Offer** — Dark section with 24-hour countdown + price + CTA
13. **Lead Form** — Name + Phone + Email → POST Google Sheets → redirect to Razorpay
14. Footer (dark)
15. Sticky bottom “Book Consultation ₹149” bar (visible after hero, hides when form is in view)
16. Floating social-proof popup “… just booked” (rotates every 14s)
17. Sticky WhatsApp + Email side buttons

## Integrations
- **Google Sheets** (lead capture): `https://script.google.com/macros/s/AKfycbwuU0PP9cLILYTKWqwJNBfpf12MA-6a2UVS_fWH09UCkNMBmupSx8jfYhBSvEP8391Kvw/exec`
  - Fire-and-forget POST with `mode: 'no-cors'`
- **Razorpay** (payment): redirect URL `https://rzp.io/rzp/giR3N1t`
- **Meta / Facebook Pixel**: ID `891206890606172`
  - Tracks: PageView, ViewContent (programs/transformations/offer), Contact (form viewed), Lead (form started + form submitted), InitiateCheckout (on submit)

## Form Flow (Final)
1. User fills Name + Phone + Email
2. JS validates (required + email regex + phone digits ≥10)
3. JS POSTs to Google Sheets (no-cors)
4. JS fires Meta Pixel `Lead` + `InitiateCheckout` (value 149 INR)
5. JS shows “Redirecting to secure payment…” success message
6. After 600ms, `window.location.href = RAZORPAY_URL`
7. Razorpay handles payment + post-payment redirect

## Changelog (this session — Feb 2026)
- VSL overhaul: replaced static hero image with YouTube video embed
- Added urgency banner + sticky bottom CTA + countdown timer + social-proof popup
- Replaced “Book Now” copy with “Book Consultation for ₹149” across all CTAs
- Added pulsing/animated CTA style (`btn-cta-pulse`)
- Reordered: Hero → Results → About (was: Hero → Problem → … → About)
- Lead form simplified to Name + Phone + Email (removed goal dropdown)
- Form now redirects to Razorpay instead of thankyou.html
- Updated Meta Pixel ID to `891206890606172`
- Added pricing display: ₹1,999 strikethrough → ₹149

### Mobile/UX polish (msg 199)
- Removed top “people viewing this right now” bar entirely
- Added “Home” link to nav + mobile menu
- Removed duplicate hero left-side price/CTA block (price+CTA only on the video card now)
- Reduced heading sizes ~7-10% (H1 max 4rem, H2 max 2.5rem, form-h2 max 2rem)
- YouTube embed hides controls/branding/keyboard/fullscreen (`controls=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&fs=0`)
- Mobile urgency banner: compact single-line, smaller font, hides flame icons on tiny screens
- Mobile hero-stats: 3 cards in a row (was vertical stack)
- Mobile CTAs: smaller padding/font (.btn-cta-pulse 0.78rem)
- Mobile Real Results: centered section + horizontal scroll-snap grid (12 cards in a single scrollable row, 220px each)

## Backlog / Future Ideas
- (P2) Replace press pill text with actual publication logo cutouts (user mentioned this in msg 197 — currently still text pills since no logo assets provided)
- (P2) Split CSS into modules (variables.css, layout.css, components.css, vsl.css) — file is ~1934 lines
- (P2) A/B test different hero video thumbnails
- (P2) Add testimonial video carousel below results
- (P3) Hindi/English language toggle

## Test Status
- Last test: `/app/test_reports/iteration_2.json` — 94% pass; sticky bar fix re-verified manually after applying patch
- All VSL flows verified: video embed, countdown, social proof popup, viewer count fluctuation, sticky bar visibility, form → Razorpay redirect, Meta Pixel init, mobile responsiveness
