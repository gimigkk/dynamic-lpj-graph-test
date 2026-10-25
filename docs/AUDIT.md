# Audit: Desktop & Mobile Rendering Issues

Comprehensive findings from source code audit. Status updated with latest fixes.

---

## 🔴 Critical (Broken on Mobile)

### [x] C1. DonutCallouts: Phantom Blank Gap on Mobile
- **Files**: `DonutCallouts.module.css:186-194`
- **Fix Applied**: Added `.stageScaler { display: none; }` inside `@media (max-width: 768px)`.

---

### [x] C2. SankeyAllocation: Unreadable on Mobile (1000px canvas → 375px)
- **Files**: `SankeyAllocation.module.css:1-25`
- **Fix Applied**: Added `overflow-x: auto; -webkit-overflow-scrolling: touch;` to `.wrapper` and `min-width: 720px;` to `.stageSvg`.

---

### [x] C3. SankeyAllocation: `<foreignObject>` + `clipPath` — WebKit Safari Bug
- **Files**: `SankeyRibbons.tsx:50-80`
- **Fix Applied**: Replaced `<foreignObject>` + `<Odometer>` with native SVG `<text>` elements with `dominantBaseline="central"`.

---

### [x] C4. Touch Interactions: Hover-Only on All Charts
- **Files**: `DonutCallouts.tsx`, `SpeechBubble.tsx`, `RadarImpact.tsx`, `SankeyRibbons.tsx`, `SankeyDestinations.tsx`, `SankeyPins.tsx`
- **Fix Applied**: Added `onClick` toggle handler across all slices, bubbles, radar points, ribbons, destinations, and pins.

---

## 🟠 Major (Visual Bugs / Poor UX)

### [x] M1. DonutCallouts Mobile: Donut Center Misaligned
- **Files**: `DonutCallouts.tsx:496`
- **Fix Applied**: Mobile SVG `viewBox` adjusted from `0 0 860 540` to `150 120 300 300` (centered around `CX=300, CY=270`).

---

### [ ] M2. SankeyAllocation: `transform-box: fill-box` WebKit Bugs
- **Files**: `SankeyAllocation.module.css:31,38,55,224`
- **Problem**: `.sourceRectBpptn`, `.sourceRectNonBpptn`, `.staggerItem`, `.targetBar` use `transform-box: fill-box`.
- **Status**: Open.

---

### [x] M3. SpeechBubble: Hook Beaks Overflow on Mobile
- **Files**: `SpeechBubble.module.css:228-237`
- **Fix Applied**: `.hookBeak { display: none; }` inside `@media (max-width: 768px)`.

---

### [x] M4. SpeechBubble: Negative Margin Overlap
- **Files**: `SpeechBubble.module.css:235`
- **Fix Applied**: `.statTile { margin-bottom: 0; }` inside `@media (max-width: 768px)`.

---

### [ ] M5. RadarImpact: Axis Label Overflow
- **Files**: `RadarImpact.module.css:22`
- **Problem**: Long axis labels can spill outside viewport when `overflow: visible`.
- **Status**: Open.

---

### [x] M6. RadarImpact: 15 Concurrent Framer Motion → setState per Frame
- **Files**: `RadarImpact.tsx:65-150`
- **Fix Applied**: Batched all 15 animation streams using `requestAnimationFrame`, limiting React re-renders to at most once per frame.

---

### [x] M7. SankeyAllocation: Pin Hit Targets Too Small on Mobile
- **Files**: `SankeyPins.tsx:45-56`
- **Fix Applied**: Added transparent `r="22"` `<circle>` hit area on every pin.

---

### [x] M8. Sankey Destination Text Clipping
- **Files**: `SankeyAllocation.module.css:1-25`
- **Fix Applied**: Resolved by horizontal scroll container (C2).

---

## 🟡 Minor (Polish / Best Practice)

### [x] m1. Dead Dependency: `recharts`
- **Files**: `package.json`, `package-lock.json`
- **Fix Applied**: `npm uninstall recharts` removed package.

---

### [ ] m2. Odometer: Screen Reader Noise
- **Files**: `Odometer.tsx:96-137`
- **Problem**: Reels announce 0-9 digits to assistive tech. Needs `role="text"` on root and `aria-hidden="true"` on reels.
- **Status**: Open.

---

### [ ] m3. Desktop SVG: `aria-hidden="true"` Without Fallback
- **Files**: `DonutCallouts.tsx:421`
- **Problem**: Missing `<table className="sr-only">` or accessible description.
- **Status**: Open.

---

### [ ] m4. DonutCallouts: ResizeObserver Runs on Mobile
- **Files**: `DonutCallouts.tsx:177-179`
- **Problem**: Wasted calculation when desktop stage is hidden.
- **Status**: Open.

---

### [ ] m5. `DonutCallouts innerR` Animation Ignores Reduced Motion
- **Files**: `DonutCallouts.tsx:184-218`
- **Problem**: `innerR` RAF loop runs even when `prefers-reduced-motion` is active.
- **Status**: Open.

---

### [x] m6. Spacebar Replay: Mobile Limitation
- **Files**: `page.tsx`
- **Status**: Documented behavior (mobile uses header button).

---

### [ ] m7. SankeyDefs: Wipe Animation Uses `width` Property
- **Files**: `SankeyDefs.tsx:32-43`, `SankeyAllocation.module.css:148-156`
- **Problem**: Animates `width` instead of `transform: scaleX()`.
- **Status**: Open.

---

## Progress Overview

| Severity | Total | Fixed | Open |
|:---|:---:|:---:|:---:|
| 🔴 **Critical** | 4 | **4** | 0 |
| 🟠 **Major** | 8 | **6** | 2 (M2, M5) |
| 🟡 **Minor** | 7 | **2** | 5 (m2, m3, m4, m5, m7) |
