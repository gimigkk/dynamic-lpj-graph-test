import React from "react";
import { RIBBON_START_X, RIBBON_END_X } from "../SankeyAllocation.constants";
import { RibbonFlow } from "../SankeyAllocation.types";
import { createRibbonPath, getBézierCenterY } from "../sankeyMath";
import styles from "../SankeyAllocation.module.css";

interface SankeyRibbonsProps {
  flows: RibbonFlow[];
  activeDestId: string | null;
  onHoverDest: (destId: string | null) => void;
}

export function SankeyRibbons({ flows, activeDestId, onHoverDest }: SankeyRibbonsProps) {
  // Sort descending by height: biggest in background, smallest in foreground
  const sortedFlows = [...flows].sort((a, b) => b.h - a.h);

  return (
    <g className={styles.ribbonsGroup}>
      {sortedFlows.map((flow) => {
        const path = createRibbonPath(
          RIBBON_START_X,
          flow.startY,
          RIBBON_END_X,
          flow.endY,
          flow.h
        );

        const isDimmed = activeDestId !== null && flow.destId !== activeDestId;
        const isHighlighted = activeDestId === flow.destId;

        return (
          <path
            key={flow.id}
            d={path}
            clipPath={`url(#clip-wipe-${flow.destId})`}
            style={{ fill: flow.color }}
            className={`${styles.ribbon}${
              isDimmed
                ? ` ${styles.ribbonDimmed}`
                : isHighlighted
                ? ` ${styles.ribbonHighlighted}`
                : ""
            }`}
            onMouseEnter={() => onHoverDest(flow.destId)}
            onMouseLeave={() => onHoverDest(null)}
            onClick={() => onHoverDest(activeDestId === flow.destId ? null : flow.destId)}
          />
        );
      })}

      {/* Percentage labels inside thick ribbons (h >= 28px) */}
      {sortedFlows
        .filter((flow) => flow.h >= 28)
        .map((flow) => {
          const labelX = RIBBON_START_X + 20;
          const y1 = flow.startY + flow.h / 2;
          const y2 = flow.endY + flow.h / 2;
          const centerY = getBézierCenterY(labelX, RIBBON_START_X, y1, RIBBON_END_X, y2);

          const isLarge = flow.pct > 50;
          const isMedium = flow.pct > 10;
          const isDimmed = activeDestId !== null && flow.destId !== activeDestId;

          return (
            <text
              key={`lbl-${flow.id}`}
              x={labelX}
              y={Math.round(centerY)}
              dominantBaseline="central"
              clipPath={`url(#clip-wipe-${flow.destId})`}
              className={
                isLarge
                  ? styles.ribbonPctLarge
                  : isMedium
                  ? styles.ribbonPctMedium
                  : styles.ribbonPctSmall
              }
              style={{
                pointerEvents: "none",
                opacity: isDimmed ? 0.35 : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              {flow.pctFormatted}
            </text>
          );
        })}
    </g>
  );
}
