import React from "react";
import { TARGET_START_X, TARGET_BAR_W, DEST_TIMINGS } from "../SankeyAllocation.constants";
import { DestinationLayout } from "../SankeyAllocation.types";
import styles from "../SankeyAllocation.module.css";

interface SankeyDestinationsProps {
  destinations: DestinationLayout[];
  activeDestId: string | null;
  onHoverDest: (destId: string | null) => void;
}

export function SankeyDestinations({
  destinations,
  activeDestId,
  onHoverDest,
}: SankeyDestinationsProps) {
  return (
    <g className={styles.destinationsCol}>
      {destinations.map((dest) => {
        const labelOffsetY = Math.max(12, Math.round(dest.totalH / 2) - 6);
        const arriveDelay = DEST_TIMINGS[dest.id]?.arriveDelay || "1.0s";
        const isDimmed = activeDestId !== null && dest.id !== activeDestId;
        const isHighlighted = activeDestId === dest.id;

        return (
          <g
            key={`dest-${dest.id}`}
            transform={`translate(${TARGET_START_X}, ${dest.y})`}
            className={`${styles.destRow}${
              isDimmed
                ? ` ${styles.destRowDimmed}`
                : isHighlighted
                ? ` ${styles.destRowHighlighted}`
                : ""
            }`}
            onMouseEnter={() => onHoverDest(dest.id)}
            onMouseLeave={() => onHoverDest(null)}
            onClick={() => onHoverDest(activeDestId === dest.id ? null : dest.id)}
          >
            {/* Flat seam on left facing ribbons, rounded on outer right */}
            <path
              d={`M 0 0 L ${TARGET_BAR_W - 3} 0 Q ${TARGET_BAR_W} 0 ${TARGET_BAR_W} 3 L ${TARGET_BAR_W} ${dest.totalH - 3} Q ${TARGET_BAR_W} ${dest.totalH} ${TARGET_BAR_W - 3} ${dest.totalH} L 0 ${dest.totalH} Z`}
              className={styles.targetBar}
              style={{ animationDelay: arriveDelay }}
            />

            {/* Multiline Category & Amount Breakdown */}
            <g className={styles.destTextGroup} style={{ animationDelay: arriveDelay }}>
              <text x={TARGET_BAR_W + 12} y={labelOffsetY} className={styles.targetTitle}>
                {dest.name}
              </text>

              {dest.bpptnAmount && (
                <text x={TARGET_BAR_W + 12} y={labelOffsetY + 16} className={styles.targetLine}>
                  {dest.bpptnAmount}
                </text>
              )}
              {dest.nonBpptnAmount && (
                <text
                  x={TARGET_BAR_W + 12}
                  y={labelOffsetY + (dest.bpptnAmount ? 29 : 16)}
                  className={styles.targetLine}
                >
                  {dest.nonBpptnAmount}
                </text>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}
