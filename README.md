# Ormawa Statistics Visualization Components

Pure SVG & CSS Modules data visualization components for Next.js 15 App Router. Zero external charting dependencies (no D3, Chart.js, Recharts, or Tailwind).

---

## Why Pure SVG?

- **Zero Bundle Overhead**: Standard charting bundles (D3, Chart.js, Recharts) add 100KB–400KB of client JS. Native SVG compiles to plain React JSX elements with zero runtime cost.
- **Declarative DOM Integration**: Every slice, ribbon, and axis node lives directly in the browser DOM. Native CSS `:hover`, CSS transitions, CSS custom properties (`var(--c-primary)`), and ARIA attributes bind directly to elements without bridge layers or canvas pixel hit-testing.
- **Lossless Scaling**: Canvas renders fixed bitmaps that require manual device-pixel-ratio scaling to avoid blurring on Retina/high-DPI screens. SVG scales losslessly via the browser compositor.
- **Dynamic Theming Without Re-computation**: Color palettes update instantly through CSS variables without recalculating geometric coordinates or triggering JavaScript re-renders:
  ```css
  .slicePath {
    fill: var(--c-donut-1);
    transition: fill 0.25s ease, opacity 0.2s ease;
  }
  ```

---

## Components

### 1. DonutCallouts (`src/components/charts/DonutCallouts`)

Radial category breakdown pairing an inner SVG donut ring with HTML speech bubbles anchored to slice perimeters.

#### How It's Implemented

- **Hybrid SVG + HTML DOM**:
  The ring renders as vector paths inside `<svg>`, while speech bubbles render as absolute-positioned HTML `<div>` elements inside a shared coordinate container. This allows text inside callouts to wrap naturally and use standard flexbox styling without `<text>` wrapping hacks:
  ```tsx
  <div className={styles.stage} style={{ transform: `scale(${stageScale})` }}>
    <svg viewBox="0 0 600 540" className={styles.svgLayer}>
      {slices.map((slice, i) => (
        <path key={i} d={slice.pathData} fill={slice.color} />
      ))}
    </svg>

    {slices.map((slice, i) => (
      <SpeechBubble
        key={i}
        x={slice.calloutX}
        y={slice.calloutY}
        label={slice.label}
        value={slice.value}
      />
    ))}
  </div>
  ```

- **Stage Auto-Scaling (`--stage-scale`)**:
  Prevents layout shifts by decoupling container dimensions from SVG coordinate spaces. The outer wrapper enforces `aspect-ratio: 600 / 540`. A `ResizeObserver` measures container width and updates CSS transform scale uniformly:
  ```ts
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setStageScale(Math.min(1, width / 600));
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  ```

- **Two-Phase Entry Animation**:
  Avoids mask/clipping artifacts by separating outer group scaling from inner radius expansion:
  1. CSS keyframe scales the SVG container ($0 \to 1$).
  2. A `requestAnimationFrame` tween animates `innerR` from $0 \to 82\text{px}$, transitioning the solid disc into a donut ring smoothly.

---

### 2. RadarImpact (`src/components/charts/RadarImpact`)

6-axis evaluation polygon mapping organizational performance against a baseline benchmark.

#### How It's Implemented

- **Declarative Web & Spoke Layers**:
  Concentric polygonal grid tiers and radiating spokes render as lightweight static SVG paths with `vector-effect: non-scaling-stroke`:
  ```tsx
  <g className={styles.gridLayer}>
    {levels.map((levelRadius, idx) => (
      <polygon
        key={idx}
        points={getPolygonPoints(axes.length, levelRadius, CX, CY)}
        className={styles.gridPolygon}
      />
    ))}
    {axes.map((axis, idx) => (
      <line
        key={idx}
        x1={CX} y1={CY}
        x2={axis.x} y2={axis.y}
        className={styles.spokeLine}
      />
    ))}
  </g>
  ```

- **Frame-by-Frame Vertex Interpolation**:
  Uses `framer-motion`'s `animate()` engine on mount to tween normalized progress values (`[p0, p1, ..., p5]`) from $0 \to 1$ with radial stagger delays. The SVG `<polygon points="...">` string regenerates dynamically, creating an organic expansion effect:
  ```tsx
  const pointsString = currentRadii
    .map((r, i) => {
      const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
      return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
    })
    .join(" ");

  return <polygon points={pointsString} className={styles.scorePolygon} />;
  ```

---

### 3. SankeyAllocation (`src/components/charts/SankeyAllocation`)

Dual-source budget allocation diagram tracing capital flows into destination operational activities.

#### How It's Implemented

- **Continuous Bézier Ribbons**:
  Flow channels are continuous SVG paths combining a top cubic Bézier curve, vertical straight edge, bottom return Bézier curve, and start vertical edge. Placing control points at 45% horizontal span ensures horizontal tangents that connect perpendicular to vertical source/target bars without visual kinks:
  ```ts
  function getRibbonPath(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number): string {
    const dx = x2 - x1;
    const cx1 = x1 + 0.45 * dx;
    const cx2 = x2 - 0.45 * dx;

    return `M ${x1} ${y1} ` +
           `C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2} ` +
           `L ${x2} ${y2 + h2} ` +
           `C ${cx2} ${y2 + h2}, ${cx1} ${y1 + h1}, ${x1} ${y1 + h1} ` +
           `Z`;
  }
  ```

- **Micro-Flow Thickness Clamping**:
  When a dataset has extreme flow disparities (e.g. 71% vs 0.0002%), standard proportional height yields sub-pixel paths ($< 0.01\text{px}$) that vanish and break mouse hit-testing. The height calculation enforces a minimum clamped thickness:
  ```ts
  const MIN_H = 4; // Ensures visual visibility and hover targets
  const ribbonHeight = Math.max(MIN_H, Math.round(flowPercent * pixelsPerPercent));
  ```

- **HTML Embedding in SVG (`<foreignObject>`)**:
  Interactive odometer counters are embedded directly inside moving SVG ribbon flows. `pointer-events: none` on the foreignObject wrapper ensures pointer hover events pass straight through to the underlying SVG ribbon paths:
  ```tsx
  <foreignObject
    x={x}
    y={y}
    width={width}
    height={height}
    style={{ pointerEvents: "none" }}
  >
    <Odometer value={percentage} />
  </foreignObject>
  ```

- **Hover Micro-Debouncing**:
  Moving the mouse rapidly across touching SVG ribbon boundaries triggers flickering unhover/hover states. A 35ms enter debounce combined with a 140ms exit grace period stabilizes pointer transitions:
  ```ts
  const handleMouseEnter = (id: string) => {
    clearTimeout(exitTimer.current);
    enterTimer.current = setTimeout(() => setActiveFlowId(id), 35);
  };

  const handleMouseLeave = () => {
    clearTimeout(enterTimer.current);
    exitTimer.current = setTimeout(() => setActiveFlowId(null), 140);
  };
  ```
