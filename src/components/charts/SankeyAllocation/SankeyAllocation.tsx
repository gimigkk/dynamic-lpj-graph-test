"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SVG_W, SVG_H } from "./SankeyAllocation.constants";
import { SankeyAllocationProps } from "./SankeyAllocation.types";
import { computeSankeyLayout } from "./sankeyMath";
import {
  SankeyDefs,
  SankeyRibbons,
  SankeySources,
  SankeyDestinations,
  SankeyPins,
} from "./components";
import styles from "./SankeyAllocation.module.css";

export function SankeyAllocation({}: SankeyAllocationProps = {}) {
  const [activeDestId, setActiveDestId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverDest = useCallback((destId: string | null) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (destId === null) {
      // Grace period before clearing focus so crossing seams/borders doesn't trigger flash
      timerRef.current = setTimeout(() => {
        setActiveDestId(null);
      }, 140);
    } else {
      // 35ms micro-debounce: instantaneous feel, but ignores high-velocity boundary crossings
      timerRef.current = setTimeout(() => {
        setActiveDestId(destId);
      }, 35);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Layout math is purely static data; memoize to prevent recomputing on hover state changes
  const {
    bpptnH,
    nonBpptnH,
    bpptnY,
    nonBpptnY,
    destinationLayouts,
    bpptnFlows,
    nonBpptnFlows,
    allFlows,
  } = React.useMemo(() => {
    const layout = computeSankeyLayout();
    return {
      ...layout,
      allFlows: [...layout.nonBpptnFlows, ...layout.bpptnFlows],
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={styles.stageSvg}
        aria-label="True Sankey Budget Allocation Diagram"
      >
        <SankeyDefs />

        <SankeyRibbons
          flows={allFlows}
          activeDestId={activeDestId}
          onHoverDest={handleHoverDest}
        />

        <SankeySources
          bpptnY={bpptnY}
          bpptnH={bpptnH}
          nonBpptnY={nonBpptnY}
          nonBpptnH={nonBpptnH}
          activeDestId={activeDestId}
        />

        <SankeyPins
          flows={nonBpptnFlows}
          activeDestId={activeDestId}
          onHoverDest={handleHoverDest}
        />

        <SankeyDestinations
          destinations={destinationLayouts}
          activeDestId={activeDestId}
          onHoverDest={handleHoverDest}
        />
      </svg>
    </div>
  );
}

export * from "./SankeyAllocation.types";
export * from "./SankeyAllocation.constants";
