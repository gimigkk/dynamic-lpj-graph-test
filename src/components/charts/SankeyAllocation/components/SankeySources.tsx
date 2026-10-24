import React from "react";
import { SOURCE_X, SOURCE_W, BPPTN_FLOW_DEFS } from "../SankeyAllocation.constants";
import styles from "../SankeyAllocation.module.css";

interface SankeySourcesProps {
  bpptnY: number;
  bpptnH: number;
  nonBpptnY: number;
  nonBpptnH: number;
  activeDestId: string | null;
}

export function SankeySources({
  bpptnY,
  bpptnH,
  nonBpptnY,
  nonBpptnH,
  activeDestId,
}: SankeySourcesProps) {
  const isBpptnDimmed =
    activeDestId !== null && !BPPTN_FLOW_DEFS.some((f) => f.destId === activeDestId);

  return (
    <g className={styles.sourceCol}>
      {/* BPPTN Source Card */}
      <g
        transform={`translate(${SOURCE_X}, ${bpptnY})`}
        className={`${styles.sourceBlock}${isBpptnDimmed ? ` ${styles.sourceBlockDimmed}` : ""}`}
      >
        <path
          d={`M 6 0 L ${SOURCE_W} 0 L ${SOURCE_W} ${bpptnH} L 6 ${bpptnH} Q 0 ${bpptnH} 0 ${bpptnH - 6} L 0 6 Q 0 0 6 0 Z`}
          className={styles.sourceRectBpptn}
        />
        {/* Row 1: Title and Percentage */}
        <g clipPath="url(#clip-bpptn-row1)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.12s" }}>
            <text x="14" y="24" className={styles.sourceTitle}>
              BPPTN Fund
            </text>
            <text x={SOURCE_W - 14} y="24" textAnchor="end" className={styles.sourcePctSmall}>
              11,7%
            </text>
          </g>
        </g>

        {/* Row 2: Category and Amount */}
        <g clipPath="url(#clip-bpptn-row2)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.20s" }}>
            <text x="14" y="44" className={styles.sourceCategory}>
              Student Org Budget
            </text>
            <text x={SOURCE_W - 14} y="44" textAnchor="end" className={styles.sourceAmountSmall}>
              Rp 1.4M
            </text>
          </g>
        </g>
      </g>

      {/* Non-BPPTN Source Card */}
      <g transform={`translate(${SOURCE_X}, ${nonBpptnY})`} className={styles.sourceBlock}>
        <path
          d={`M 6 0 L ${SOURCE_W} 0 L ${SOURCE_W} ${nonBpptnH} L 6 ${nonBpptnH} Q 0 ${nonBpptnH} 0 ${nonBpptnH - 6} L 0 6 Q 0 0 6 0 Z`}
          className={styles.sourceRectNonBpptn}
        />
        {/* Line 1: Category Header */}
        <g clipPath="url(#clip-nonbpptn-line1)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.28s" }}>
            <text x="24" y="138" className={styles.sourceCategoryLarge}>
              Total Student
            </text>
            <text x="24" y="157" className={styles.sourceCategoryLarge}>
              Organization Budget
            </text>
          </g>
        </g>

        {/* Line 2: Title */}
        <g clipPath="url(#clip-nonbpptn-line2)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.44s" }}>
            <text x="24" y="193" className={styles.sourceTitleLarge}>
              Non-BPPTN Fund
            </text>
          </g>
        </g>

        {/* Line 3: Amount Badge */}
        <g clipPath="url(#clip-nonbpptn-line3)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.60s" }}>
            <rect
              x="24"
              y="212"
              width="164"
              height="48"
              rx="3"
              className={styles.badgeHighlight}
            />
            <text x="32" y="246" className={styles.sourceAmountHighlight}>
              Rp 10.6M
            </text>
          </g>
        </g>

        {/* Line 4: Big Percentage */}
        <g clipPath="url(#clip-nonbpptn-line4)">
          <g className={styles.staggerItem} style={{ animationDelay: "0.76s" }}>
            <text x="24" y="325" className={styles.sourcePctBig}>
              88,3%
            </text>
          </g>
        </g>
      </g>
    </g>
  );
}
