import React from "react";
import styles from "./SpeechBubble.module.css";

export type BubbleHook =
  | "top-left"
  | "top-right"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";

export interface SpeechBubbleProps {
  label: string;
  value: string | number;
  delta?: number | string;
  pct?: string;
  trend?: "up" | "down";
  hook?: BubbleHook;
  isActive?: boolean;
  isDimmed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
  animationDelay?: string;
}

export function SpeechBubble({
  label,
  value,
  delta,
  pct,
  trend = "up",
  hook = "left-top",
  isActive = false,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  style,
  animationDelay,
}: SpeechBubbleProps) {
  const hookClass = styles[`hook_${hook.replace("-", "_")}`] || "";

  const bubbleStyle: React.CSSProperties = {
    ...style,
    ...(animationDelay ? { animationDelay } : {}),
  };

  return (
    <div
      className={`${styles.bubble} ${styles.bubbleAnimated} ${hookClass} ${
        isActive ? styles.bubbleActive : ""
      } ${isDimmed ? styles.bubbleDimmed : ""}`}
      style={bubbleStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Corner Triangle Hook */}
      <span className={styles.hookBeak} aria-hidden="true" />

      {/* Top vertical block: Title / Category label */}
      <div className={styles.titleRow}>{label}</div>

      {/* Bottom horizontal block: [Secondary Box Slot] + [Trend & Stat Slot] */}
      <div className={styles.bottomRow}>
        {/* Left: Slot holding secondary box that protrudes downward */}
        <div className={styles.statSlot}>
          <div className={styles.statTile}>
            <span className={styles.valueDisplay}>{value}</span>
            {delta !== undefined && (
              <span className={styles.deltaDisplay}>+{delta}</span>
            )}
          </div>
        </div>

        {/* Right: Trend Arrow + Percentage Stat */}
        {pct && (
          <div className={styles.trendSlot}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={trend === "down" ? styles.trendSvgDown : styles.trendSvgUp}
              aria-hidden="true"
            >
              {trend === "down" ? (
                // Crisp diagonal arrow pointing bottom-right
                <path
                  d="M2.5 2.5L9.5 9.5M9.5 9.5H4.5M9.5 9.5V4.5"
                  stroke="var(--c-accent, #ea580c)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                // Crisp diagonal arrow pointing top-right
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                  stroke="var(--c-primary, #047857)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span className={styles.pctText}>{pct}</span>
          </div>
        )}
      </div>
    </div>
  );
}
