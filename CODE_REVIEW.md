# Code Review: Daniel Petrov Portfolio

## 🔴 Critical Issues

### 1. **GSAP Duplicate Loading** (Performance & Bundle Size)
**Location:** `index.html` lines 434-436, `animated-titles.js` line 1-2, `expertise.js` line 4

**Problem:** GSAP is loaded twice:
- Via CDN in HTML (`<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js">`)
- Via npm import in JavaScript (`import gsap from "gsap"`)

**Impact:** 
- Larger bundle size
- Potential version conflicts
- Slower page load

**Fix:** Remove CDN scripts and use only npm imports. GSAP is already in `package.json`.

```javascript
// Remove from index.html:
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

// Add to main.js or create a gsap setup file:
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Make GSAP available globally if needed (not recommended, but if you must):
window.gsap = gsap;
```

### 2. **Missing GSAP Imports in expertise.js**
**Location:** `src/scripts/modules/expertise.js` line 4

**Problem:** Uses `gsap` and `ScrollTrigger` without importing them.

**Fix:** Add imports at the top:
```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
```

### 3. **Empty Alt Attributes** (Accessibility)
**Location:** All `<img>` tags in `index.html`

**Problem:** All images have `alt=""` (empty). This hurts accessibility and SEO.

**Fix:** Add descriptive alt text:
```html
<!-- Bad -->
<img src="/src/assets/images/arkhyz-case-img.webp" alt="">

<!-- Good -->
<img src="/src/assets/images/arkhyz-case-img.webp" alt="Лендинг отеля Архыз - скриншот интерфейса">
```

### 4. **Video Preload Strategy** (Performance)
**Location:** All `<video>` tags have `preload="auto"`

**Problem:** `preload="auto"` forces browsers to download entire videos on page load, significantly slowing initial load.

**Fix:** Use `preload="metadata"` or `preload="none"`:
```html
<!-- Better for performance -->
<video preload="metadata" ...>
<!-- Or for below-the-fold videos -->
<video preload="none" ...>
```

### 5. **Console.log in Production** (Code Quality)
**Location:** `src/scripts/main.js` line 20

**Problem:** `console.log('App initialized!')` should not be in production code.

**Fix:** Remove or use conditional logging:
```javascript
if (import.meta.env.DEV) {
    console.log('App initialized!');
}
```

---

## 🟡 Important Improvements

### 6. **Mobile Detection Logic** (Reliability)
**Location:** `src/scripts/main.js` line 10

**Problem:** `window.innerWidth <= 1024` is checked only once on page load. Window resize doesn't update behavior.

**Fix:** Use a proper media query or resize listener:
```javascript
const isMobile = () => window.innerWidth <= 1024;

// Or use matchMedia:
const mobileMediaQuery = window.matchMedia('(max-width: 1024px)');
const isMobile = mobileMediaQuery.matches;
```

### 7. **Missing Error Handling**
**Location:** Multiple modules

**Problem:** No error handling for:
- Missing DOM elements
- GSAP initialization failures
- Swiper initialization failures

**Fix:** Add try-catch blocks and null checks:
```javascript
export function initReviewsSlider() {
    try {
        const el = document.querySelector('.swiper');
        if (!el) {
            console.warn('Swiper element not found');
            return;
        }
        // ... rest of code
    } catch (error) {
        console.error('Failed to initialize reviews slider:', error);
    }
}
```

### 8. **Memory Leaks - Event Listeners**
**Location:** `src/scripts/modules/case-card.js` lines 51, 57

**Problem:** Global event listeners (`mousemove`, `scroll`) are never removed. If module is re-initialized, multiple listeners accumulate.

**Fix:** Store references and clean up:
```javascript
let mousemoveHandler, scrollHandler;

function init() {
    mousemoveHandler = (e) => { /* ... */ };
    scrollHandler = () => { /* ... */ };
    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('scroll', scrollHandler);
}

function destroy() {
    if (mousemoveHandler) window.removeEventListener('mousemove', mousemoveHandler);
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
}
```

### 9. **Magic Numbers** (Code Maintainability)
**Location:** Multiple files

**Problem:** Hardcoded values scattered throughout:
- `expertise.js`: `scale: 1 - progress * 0.25`, `rotation: (index % 2 === 0 ? 5 : -5)`
- `animated-titles.js`: `charInitialY: i % 2 === 0 ? -150 : 150`
- `case-card.js`: `duration: 0.3`, `zIndex: 9999`

**Fix:** Extract to constants:
```javascript
// constants.js
export const ANIMATION_CONFIG = {
    CARD_SCALE_FACTOR: 0.25,
    CARD_ROTATION_DEGREES: 5,
    OVERLAY_Z_INDEX: 9999,
    ANIMATION_DURATION: 0.3,
};
```

### 10. **SCSS Typo**
**Location:** `src/styles/01_base/_03_globals.scss` line 5

**Problem:** `font-style: 16px;` should be `font-size: 16px;`

**Fix:**
```scss
html {
    font-size: 16px; // was font-style
}
```

### 11. **Inefficient DOM Queries**
**Location:** `src/scripts/modules/hover-split-text.js` line 4

**Problem:** `querySelectorAll` is called once, but could be optimized with caching.

**Fix:** Already acceptable, but consider:
```javascript
const elements = document.querySelectorAll(".hover-split-text");
if (elements.length === 0) return; // Early exit
```

### 12. **Missing rel="noopener" on External Links**
**Location:** `index.html` multiple links

**Problem:** Some external links have `target="_blank"` without `rel="noopener noreferrer"` (security risk).

**Fix:** Already present on most links, but verify all:
```html
<a href="..." target="_blank" rel="noopener noreferrer">
```

### 13. **Lenis Instance Not Exported/Reused**
**Location:** `src/scripts/modules/animated-titles.js` line 9

**Problem:** Lenis instance is created but not accessible elsewhere. If you need to control smooth scroll from other modules, it's not available.

**Fix:** Export or create a shared instance:
```javascript
export const lenisInstance = new Lenis({ duration: 0.8 });
```

### 14. **Commented Code**
**Location:** Multiple files

**Problem:** Commented-out code should be removed:
- `index.html` line 179-183 (animated titles section)
- `index.html` line 431 (duplicate overlay)
- `case-card.js` line 30 (commented onStart)
- `_03_globals.scss` line 16, 48, 107-110

**Fix:** Remove commented code or document why it's kept.

---

## 🟢 Nice-to-Have Improvements

### 15. **TypeScript Migration**
Consider migrating to TypeScript for better type safety and IDE support.

### 16. **ESLint & Prettier**
Add linting and formatting tools for consistent code style.

### 17. **Performance Monitoring**
Add performance tracking (e.g., Web Vitals):
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
```

### 18. **Lazy Loading Images**
Use native lazy loading:
```html
<img src="..." alt="..." loading="lazy">
```

### 19. **Video Poster Images**
Add poster images to videos for better UX:
```html
<video poster="/src/assets/video/toksovo-poster.jpg" ...>
```

### 20. **Semantic HTML**
Some sections could use better semantic tags:
- Use `<main>` for main content
- Use `<article>` for case studies
- Use `<nav>` for navigation if added

### 21. **CSS Custom Properties Usage**
You have CSS variables defined but could use them more consistently throughout components.

### 22. **Build Optimization**
Consider adding:
- Image optimization plugin for Vite
- Bundle analyzer
- Tree-shaking verification

### 23. **Environment Variables**
Use `.env` files for configuration:
```javascript
// vite.config.js
export default defineConfig({
  base: import.meta.env.VITE_BASE_URL || '/',
});
```

### 24. **Error Boundaries**
Consider adding error boundaries for graceful degradation.

### 25. **Accessibility Improvements**
- Add skip-to-content link
- Ensure keyboard navigation works
- Add ARIA labels where needed
- Test with screen readers

---

## 📊 Code Quality Summary

### Strengths ✅
- Clean SCSS architecture (7-1 pattern)
- Good separation of concerns (modular JS)
- Proper use of BEM methodology
- Responsive design considerations
- Modern build setup (Vite)

### Areas for Improvement ⚠️
- Remove duplicate GSAP loading (critical)
- Add proper error handling
- Fix accessibility issues (alt text)
- Optimize video loading strategy
- Clean up commented code
- Fix SCSS typo

### Priority Actions
1. **High Priority:** Fix GSAP duplicate loading (#1)
2. **High Priority:** Add GSAP imports to expertise.js (#2)
3. **High Priority:** Add alt text to images (#3)
4. **Medium Priority:** Optimize video preload (#4)
5. **Medium Priority:** Fix mobile detection (#6)
6. **Low Priority:** Clean up commented code (#14)

---

## 🎯 Recommended Next Steps

1. Fix critical issues (#1-5)
2. Implement important improvements (#6-14)
3. Add testing (unit tests for modules)
4. Set up CI/CD with linting
5. Performance audit with Lighthouse
6. Accessibility audit with axe DevTools

