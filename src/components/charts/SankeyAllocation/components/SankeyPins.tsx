import React from "react";
import {
  RIBBON_START_X,
  RIBBON_END_X,
  PIN_BASELINE_Y,
  PIN_CONFIGS,
  PIN_DELAYS,
} from "../SankeyAllocation.constants";
import { RibbonFlow } from "../SankeyAllocation.types";
import { getBézierCenterY } from "../sankeyMath";
import styles from "../SankeyAllocation.module.css";

interface SankeyPinsProps {
  flows: RibbonFlow[];
  activeDestId: string | null;
  onHoverDest: (destId: string | null) => void;
}

export function SankeyPins({ flows, activeDestId, onHoverDest }: SankeyPinsProps) {
  return (
    <g className={styles.pinsGroup}>
      {PIN_CONFIGS.map((pin) => {
        const flow = flows.find((f) => f.id === pin.flowId);
        if (!flow) return null;

        const y1 = flow.startY + flow.h / 2;
        const y2 = flow.endY + flow.h / 2;
        const dotY = getBézierCenterY(pin.x, RIBBON_START_X, y1, RIBBON_END_X, y2);

        const isPinDimmed = activeDestId !== null && pin.destId !== activeDestId;
        const isPinHighlighted = activeDestId === pin.destId;

        return (
          <g
            key={pin.flowId}
            className={`${styles.pinItem}${
              isPinDimmed
                ? ` ${styles.pinItemDimmed}`
                : isPinHighlighted
                ? ` ${styles.pinItemHighlighted}`
                : ""
            }`}
            style={{
              animationDelay: PIN_DELAYS[pin.flowId] || "1.0s",
            }}
            onMouseEnter={() => onHoverDest(pin.destId)}
            onMouseLeave={() => onHoverDest(null)}
            onClick={() => onHoverDest(activeDestId === pin.destId ? null : pin.destId)}
          >
            {/* Expanded Touch Target */}
            <circle
              cx={pin.x}
              cy={dotY}
              r="22"
              fill="transparent"
              style={{ cursor: "pointer" }}
            />
            {/* Guide Line */}
            <line
              x1={pin.x}
              y1={dotY}
              x2={pin.x}
              y2={PIN_BASELINE_Y - 26}
              style={{ stroke: flow.color }}
              className={styles.pinLine}
            />
            {/* Center Anchor Dot */}
            <circle
              cx={pin.x}
              cy={dotY}
              r="4"
              style={{ fill: flow.color }}
              className={styles.pinDot}
            />
            {/* Percentage Label */}
            <text x={pin.x} y={PIN_BASELINE_Y - 8} textAnchor="middle" className={styles.pinPct}>
              {pin.pctFormatted}
            </text>
            {/* Destination Name Label */}
            <text x={pin.x} y={PIN_BASELINE_Y + 12} textAnchor="middle" className={styles.pinLabel}>
              {pin.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
