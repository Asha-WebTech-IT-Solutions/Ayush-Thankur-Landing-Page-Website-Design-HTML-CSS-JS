# ATF Fitness Landing Page — PRD

## Project Overview
**Business**: Ayush Thakur Fitness (ATF)
**Goal**: High-converting fitness coaching lead generation page
**Completed**: April 2025

---

## Architecture
- **Type**: Pure HTML/CSS/Vanilla JS (static website)
- **Served via**: FastAPI StaticFiles mount at `/api/website/`
- **Website Folder**: `/app/website/`
- **Backend**: `/app/backend/server.py` (FastAPI with StaticFiles mount)

---

## What's Been Implemented

### Pages
- `index.html` — Main landing page (all sections)
- `thankyou.html` — Post-form-submission thank you page

### Sections ORDER (index.html)
1. **Navbar** — Sticky, responsive with mobile hamburger menu
2. **Hero** — 2-col layout, headline, new taekwondo coach image, floating stat cards, animated counters
3. **Marquee Ticker** — Infinite CSS animation with fitness topics
4. **Problem Section** — 4 pain point cards (Why People Fail)
5. **Transformations** — 12 client photos in scrollable grid (MOVED UP - now 3rd section after problem)
6. **Services/USP** — 3-column cards (Core, Advanced Health, Coaching)
7. **Who It's For** — 5 audience segment cards
8. **Process** — 3-step numbered journey on blue gradient background
9. **Credibility/About** — New taekwondo coach photo, "Former International Champion" badge, press mentions
10. **Philosophy** — Side-by-side comparison (Old Way vs ATF Way)
11. **Offer Section** — 4 offer cards with big CTA
12. **Lead Form** — Name, Email, Phone, Goal + Google Sheets API + Meta Pixel
13. **Footer** — Dark, logo, social links, quick links, developer credits

### Features
- ✅ Meta Pixel (placeholder `YOUR_PIXEL_ID`) — PageView + Lead events
- ✅ Google Sheets form integration (placeholder URL, demo mode works)
- ✅ Form validation + submission → redirect to thankyou.html
- ✅ Mobile-first responsive design
- ✅ Scroll reveal animations (IntersectionObserver)
- ✅ Counter animations (hero stats)
- ✅ Smooth scroll navigation
- ✅ Scroll-to-top button
- ✅ Mobile hamburger menu
- ✅ All real client transformation images
- ✅ All real coach photos
- ✅ ATF logo in navbar, form card, footer

### Images Used
- **Coach Hero**: `images/coach/IMG-20251203-WA0150.jpg`
- **Coach About**: `images/coach/1.jpg`
- **Transformations**: 12 photos (Aditya, Ajay, Amrita, Aniket, Ketan, Omkar, Sagar, Sayali, Sristi, Rekha, Ashutosh, Sumeet)
- **Logo**: `images/logo.png` (ATF circular monogram)

---

## Setup Required by Client

### 1. Meta Pixel
- Find `YOUR_PIXEL_ID` in `index.html` (2 places) and `thankyou.html` (1 place)
- Replace with actual Pixel ID

### 2. Google Sheets API
- Follow instructions in `google-sheets-setup.txt`
- Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` in `js/script.js` line 10

### 3. Upload to Hosting
- Upload entire `/app/website/` folder contents to `public_html` or `www`
- All relative paths are configured correctly

---

## URLs (Current Preview)
- Landing Page: `https://coaching-ecosystem-1.preview.emergentagent.com/api/website/`
- Thank You Page: `https://coaching-ecosystem-1.preview.emergentagent.com/api/website/thankyou.html`

---

## Color Theme
- Primary Blue: `#2563EB`
- Dark Blue: `#1E3A8A`
- Light Blue: `#60A5FA`
- Background: `#FFFFFF`
- Surface: `#EFF6FF`
- Text: `#0F172A`

## Fonts
- Headings: Poppins (400–900)
- Body: Inter (400–600)

---

## Prioritized Backlog

### P0 (Must Do Before Launch)
- [ ] Replace `YOUR_PIXEL_ID` with actual Meta Pixel ID
- [ ] Set up Google Apps Script and replace `YOUR_GOOGLE_APPS_SCRIPT_URL`
- [ ] Add HEIC coach photos (currently only JPG/WebP processed)

### P1 (Soon After Launch)
- [ ] Add VSL (Video Sales Letter) section when video is ready
- [ ] Add WhatsApp click-to-chat button (floating)
- [ ] Add more testimonials section with stars/reviews

### P2 (Nice to Have)
- [ ] Google Analytics integration
- [ ] A/B test hero headline variations
- [ ] Add FAQ section
- [ ] Blog/content section for SEO
