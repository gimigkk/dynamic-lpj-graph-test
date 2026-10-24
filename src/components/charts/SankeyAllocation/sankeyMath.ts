import {
  DESTINATIONS,
  BPPTN_FLOW_DEFS,
  NON_BPPTN_FLOW_DEFS,
  PX_PER_PCT,
  SOURCE_TOP,
  DESTINATION_TOP,
  GAP_SOURCE,
} from "./SankeyAllocation.constants";
import { DestinationLayout, RibbonFlow } from "./SankeyAllocation.types";

/**
 * Creates uniform-thickness cubic Bézier ribbon path.
 */
export function createRibbonPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  h: number
): string {
  const dx = x2 - x1;
  const cx1 = x1 + dx * 0.52;
  const cx2 = x2 - dx * 0.48;

  return [
    `M ${x1} ${y1}`,
    `C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`,
    `L ${x2} ${y2 + h}`,
    `C ${cx2} ${y2 + h}, ${cx1} ${y1 + h}, ${x1} ${y1 + h}`,
    "Z",
  ].join(" ");
}

/**
 * Binary search to evaluate exact Y coordinate along the Bézier curve centerline for a target X.
 */
export function getBézierCenterY(
  targetX: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const cx1 = x1 + dx * 0.52;
  const cx2 = x2 - dx * 0.48;

  const evalX = (t: number) => {
    const mt = 1 - t;
    return (
      mt * mt * mt * x1 +
      3 * mt * mt * t * cx1 +
      3 * mt * t * t * cx2 +
      t * t * t * x2
    );
  };

  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (evalX(mid) < targetX) {
      low = mid;
    } else {
      high = mid;
    }
  }
  const t = (low + high) / 2;

  const mt = 1 - t;
  return (
    mt * mt * mt * y1 +
    3 * mt * mt * t * y1 +
    3 * mt * t * t * y2 +
    t * t * t * y2
  );
}

/**
 * Computes all layout coordinates and ribbon geometries.
 */
export function computeSankeyLayout() {
  const MIN_H = 4;
  const bpptnHeights = BPPTN_FLOW_DEFS.map((f) => Math.max(2, Math.round(f.pct * PX_PER_PCT)));
  const nonBpptnHeights = NON_BPPTN_FLOW_DEFS.map((f) => Math.max(MIN_H, Math.round(f.pct * PX_PER_PCT)));

  const bpptnH = bpptnHeights.reduce((a, b) => a + b, 0);
  const nonBpptnH = nonBpptnHeights.reduce((a, b) => a + b, 0);

  const bpptnY = SOURCE_TOP;
  const nonBpptnY = bpptnY + bpptnH + GAP_SOURCE;

  const bpptnFlowMap = new Map(BPPTN_FLOW_DEFS.map((f, i) => [f.destId, bpptnHeights[i]]));
  const nonBpptnFlowMap = new Map(NON_BPPTN_FLOW_DEFS.map((f, i) => [f.destId, nonBpptnHeights[i]]));

  let destCurY = DESTINATION_TOP;
  const destinationLayouts: DestinationLayout[] = DESTINATIONS.map((dest) => {
    const bpptnFlowH = bpptnFlowMap.get(dest.id) || 0;
    const nonBpptnFlowH = nonBpptnFlowMap.get(dest.id) || 0;
    const totalH = bpptnFlowH + nonBpptnFlowH;
    const y = destCurY;

    const lineCount = (dest.bpptnAmount ? 1 : 0) + (dest.nonBpptnAmount ? 1 : 0);
    const textHeight = 16 + lineCount * 14;

    const minStep = Math.max(totalH + 16, textHeight + 12);
    destCurY += minStep;

    return {
      ...dest,
      y,
      totalH,
      bpptnFlowH,
      nonBpptnFlowH,
      textHeight,
    };
  });

  const destMap = new Map(destinationLayouts.map((d) => [d.id, d]));

  const bpptnSorted = [...BPPTN_FLOW_DEFS].sort((a, b) => b.pct - a.pct);
  const bpptnRankMap = new Map(bpptnSorted.map((f, i) => [f.destId, i]));

  const nonBpptnSorted = [...NON_BPPTN_FLOW_DEFS].sort((a, b) => b.pct - a.pct);
  const nonBpptnRankMap = new Map(nonBpptnSorted.map((f, i) => [f.destId, i]));

  let bpptnOutY = bpptnY;
  const bpptnFlows: RibbonFlow[] = BPPTN_FLOW_DEFS.map((flow, i) => {
    const dest = destMap.get(flow.destId)!;
    const h = bpptnHeights[i];
    const startY = bpptnOutY;
    bpptnOutY += h;

    const endY = dest.y;
    const rank = bpptnRankMap.get(flow.destId) ?? 0;
    const pctStart = Math.round((1 - rank / (bpptnSorted.length - 1)) * 100);
    const color = `color-mix(in srgb, var(--c-tile-start, #0f766e) ${pctStart}%, var(--c-bubble-bg-end, #5eead4))`;

    return {
      id: `bpptn-to-${flow.destId}`,
      source: "bpptn",
      destId: flow.destId,
      pct: flow.pct,
      pctFormatted: `${flow.pct.toString().replace(".", ",")}%`,
      startY,
      endY,
      h,
      color,
    };
  });

  let nonBpptnOutY = nonBpptnY;
  const nonBpptnFlows: RibbonFlow[] = NON_BPPTN_FLOW_DEFS.map((flow, i) => {
    const dest = destMap.get(flow.destId)!;
    const h = nonBpptnHeights[i];
    const startY = nonBpptnOutY;
    nonBpptnOutY += h;

    const endY = dest.y + dest.bpptnFlowH;
    const rank = nonBpptnRankMap.get(flow.destId) ?? 0;
    const pctStart = Math.round((1 - rank / (nonBpptnSorted.length - 1)) * 100);
    const color = `color-mix(in srgb, var(--c-donut-start, #073e2e) ${pctStart}%, var(--c-donut-end, #26b88c))`;

    return {
      id: `non-bpptn-to-${flow.destId}`,
      source: "non_bpptn",
      destId: flow.destId,
      pct: flow.pct,
      pctFormatted: `${flow.pct.toString().replace(".", ",")}%`,
      startY,
      endY,
      h,
      color,
    };
  });

  return {
    bpptnH,
    nonBpptnH,
    bpptnY,
    nonBpptnY,
    destinationLayouts,
    bpptnFlows,
    nonBpptnFlows,
  };
}
