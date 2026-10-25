"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { r2, polar } from "@/lib/geom";
import { SpeechBubble, BubbleHook } from "./SpeechBubble";
import { Odometer } from "@/components/ui/Odometer";
import styles from "./DonutCallouts.module.css";

export interface I18nLabel {
  id: string;
  en: string;
  [key: string]: string;
}

export interface DonutItem {
  id: string;
  label: I18nLabel;
  value: number;
  delta?: number;
  pctDisplay?: string;
  color?: string;
  dx?: number;
  dy?: number;
}

export interface CalloutPositionConfig {
  left: number;
  top: number;
  hook: BubbleHook;
  trend?: "up" | "down";
}

export interface CenterStatsConfig {
  /** Main caption text above or below the number */
  caption?: string;
  /** Subtitle / secondary line for caption (e.g., "Student Organization" + "Types") */
  subcaption?: string;
  /** Position of caption relative to the number: "top" (default) or "bottom" */
  captionPosition?: "top" | "bottom";
  /** Override the big number value (defaults to sum of data values) */
  value?: number | string;
  /** Whether to show the big number at all */
  showNumber?: boolean;
  /** Badge text below (e.g. "+41.9% vs 2024"). If false or empty string, badge is hidden */
  badgeText?: string | boolean;
}

export interface DonutCalloutsProps {
  data: DonutItem[];
  /** Legacy shorthand for center caption */
  centerCaption?: string;
  /** Legacy shorthand for center badge */
  centerBadgeText?: string;
  /** Comprehensive center stats configuration */
  centerStats?: CenterStatsConfig;
  isPercentData?: boolean;
  /** Custom callout positions per item id */
  positions?: Record<string, CalloutPositionConfig>;
  /** Custom slice palette start and end colors (falls back to theme CSS vars) */
  paletteRange?: [string, string];
}

// Linear color step interpolation for custom paletteRange override
function interpolateHex(hexA: string, hexB: string, factor: number): string {
  const parse = (h: string) => {
    const clean = h.replace("#", "");
    return [
      parseInt(clean.substring(0, 2), 16),
      parseInt(clean.substring(2, 4), 16),
      parseInt(clean.substring(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Auto-compute radial callout position for any dynamic dataset
function computeRadialCallout(
  midAngleDeg: number,
  CX: number,
  CY: number
): CalloutPositionConfig {
  const rad = (midAngleDeg * Math.PI) / 180;
  const isRight = Math.cos(rad) >= 0;
  const isBottom = Math.sin(rad) >= 0;

  const R_ORBIT = 220;
  const targetX = CX + Math.cos(rad) * R_ORBIT;
  const targetY = CY + Math.sin(rad) * R_ORBIT;

  let hook: BubbleHook;
  let left: number;
  let top: number;

  if (isRight) {
    left = Math.round(targetX);
    if (isBottom) {
      hook = Math.sin(rad) > 0.8 ? "top-left" : "left-top";
      top = Math.round(targetY - 12);
    } else {
      hook = "left-bottom";
      top = Math.round(targetY - 24);
    }
  } else {
    left = Math.round(targetX - 120);
    if (isBottom) {
      hook = Math.sin(rad) > 0.8 ? "top-right" : "right-top";
      top = Math.round(targetY - 12);
    } else {
      hook = "right-bottom";
      top = Math.round(targetY - 24);
    }
  }

  return { left, top, hook, trend: "up" };
}

export function DonutCallouts({
  data,
  centerCaption,
  centerBadgeText,
  centerStats,
  isPercentData = false,
  positions,
  paletteRange,
}: DonutCalloutsProps) {
  const { lang, fmt, t } = useLang();
  const shouldReduceMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
      hoverTimeoutRef.current = null;
    }, 120);
  }, []);

  const handleToggle = useCallback((id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const [stageScale, setStageScale] = useState(1);
  const scalerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scalerRef.current) return;
    const el = scalerRef.current;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setStageScale(Math.min(1, w / 600));
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [innerR, setInnerR] = useState(0);

  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;
    // Overlapping timing: starts at 150ms as pie expands
    const delay = 150;
    const duration = 850;
    const targetR = 82;

    // Matches cubic-bezier(0.08, 0.95, 0.2, 1): snappy pop with a long, elegant trailing deceleration
    const easeOutExpoDecel = (t: number) => {
      return 1 - Math.pow(1 - t, 5);
    };

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      if (elapsed < delay) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(1, (elapsed - delay) / duration);
      setInnerR(targetR * easeOutExpoDecel(progress));

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setInnerR(targetR);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Exact Donut Geometry (centered in 860 x 540 stage)
  const CX = 300;
  const CY = 270;
  const INNER_R = 82;
  const BASE_OUTER_R = 144;

  // Stepped palette ordered by descending value size
  const sortedValues = [...data].sort((a, b) => b.value - a.value);
  const rankMap = new Map(sortedValues.map((item, i) => [item.id, i]));

  // Formatted string representation of target total (e.g. "3.612" or "328")
  const rawValue = centerStats?.value !== undefined ? centerStats.value : total;
  const targetFormatted =
    typeof rawValue === "number"
      ? fmt(rawValue, { maximumFractionDigits: isPercentData ? 1 : 0 }) +
        (isPercentData ? "%" : "")
      : String(rawValue);

  // Resolved center stats config
  const showNumber = centerStats?.showNumber ?? true;
  const captionPos = centerStats?.captionPosition ?? "top";
  const displayCaption =
    centerStats?.caption ?? centerCaption ?? t("label_total_activities");
  const displaySubcaption = centerStats?.subcaption;

  const resolvedBadgeText =
    centerStats?.badgeText !== undefined
      ? (typeof centerStats.badgeText === "string" ? centerStats.badgeText : (centerStats.badgeText ? t("label_vs_year", { diff: "+41.9%", year: 2024 }) : null))
      : centerBadgeText !== undefined
      ? centerBadgeText
      : t("label_vs_year", { diff: "+41.9%", year: 2024 });

  // Helper to render proportional gear-ratio odometer
  const renderOdometer = () => {
    if (!showNumber) return null;

    return (
      <Odometer
        value={targetFormatted}
        duration="2s"
        className={styles.hubTotal}
      />
    );
  };

  // Helper to render entire central content block with customizable layout
  const renderCenterContent = () => {
    const captionEl = (
      <>
        {displayCaption && (
          <span className={styles.hubCaption}>{displayCaption}</span>
        )}
        {displaySubcaption && (
          <span className={styles.hubSubcaption}>{displaySubcaption}</span>
        )}
      </>
    );

    return (
      <>
        {captionPos === "top" && captionEl}
        {renderOdometer()}
        {captionPos === "bottom" && captionEl}
        {resolvedBadgeText && (
          <span className={styles.hubDeltaBadge}>{resolvedBadgeText}</span>
        )}
      </>
    );
  };

  // Pixel-exact default layout for report reference
  const defaultManualCardConfig: Record<string, CalloutPositionConfig> = {
    leadership: {
      left: 65,
      top: 145,
      hook: "right-bottom",
      trend: "up",
    },
    entrepreneurship: {
      left: 35,
      top: 320,
      hook: "right-top",
      trend: "up",
    },
    community_services: {
      left: 150,
      top: 395,
      hook: "top-right",
      trend: "up",
    },
    competence: {
      left: 405,
      top: 145,
      hook: "left-bottom",
      trend: "up",
    },
    interest_talents: {
      left: 415,
      top: 270,
      hook: "left-bottom",
      trend: "up",
    },
    competition: {
      left: 370,
      top: 380,
      hook: "top-left",
      trend: "down",
    },
  };

  const activePositions = { ...defaultManualCardConfig, ...positions };

  // Generate SVG wedges
  let cumulativeAngle = -90; // Start at 12 o'clock (-90 deg)
  const slices = data.map((item, index) => {
    const fraction = total > 0 ? item.value / total : 0;
    const angleSpan = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angleSpan;
    const midAngle = startAngle + angleSpan / 2;
    cumulativeAngle = endAngle;

    const outerR = BASE_OUTER_R;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angleSpan > 180 ? 1 : 0;

    const p1 = polar(CX, CY, outerR, startRad);
    const p2 = polar(CX, CY, outerR, endRad);
    const p3 = polar(CX, CY, innerR, endRad);
    const p4 = polar(CX, CY, innerR, startRad);

    const pathData =
      innerR <= 0.5
        ? [
            `M ${r2(p1.x)} ${r2(p1.y)}`,
            `A ${outerR} ${outerR} 0 ${largeArc} 1 ${r2(p2.x)} ${r2(p2.y)}`,
            `L ${CX} ${CY}`,
            "Z",
          ].join(" ")
        : [
            `M ${r2(p1.x)} ${r2(p1.y)}`,
            `A ${outerR} ${outerR} 0 ${largeArc} 1 ${r2(p2.x)} ${r2(p2.y)}`,
            `L ${r2(p3.x)} ${r2(p3.y)}`,
            `A ${r2(innerR)} ${r2(innerR)} 0 ${largeArc} 0 ${r2(p4.x)} ${r2(p4.y)}`,
            "Z",
          ].join(" ");

    const cfg =
      activePositions[item.id] ||
      computeRadialCallout(midAngle, CX, CY);

    const rank = rankMap.get(item.id) ?? 0;
    const pctStart =
      sortedValues.length <= 1
        ? 100
        : Math.round((1 - rank / (sortedValues.length - 1)) * 100);

    const sliceFill =
      item.color ||
      (paletteRange
        ? interpolateHex(
            paletteRange[0],
            paletteRange[1],
            rank / Math.max(1, sortedValues.length - 1)
          )
        : `var(--c-donut-${rank + 1}, color-mix(in srgb, var(--c-donut-start) ${pctStart}%, var(--c-donut-end)))`);

    return {
      ...item,
      fraction,
      startAngle,
      endAngle,
      midAngle,
      outerR,
      pathData,
      color: sliceFill,
      cfg,
    };
  });

  return (
    <div className={styles.container}>
      <div
        ref={scalerRef}
        className={styles.stageScaler}
      >
        <div
          className={styles.desktopStage}
          style={{ "--stage-scale": stageScale } as React.CSSProperties}
        >
          {/* Donut SVG & Center Hub */}
        <div className={styles.svgWrap}>
          {/* Central Hub Typography: Static, positioned underneath the donut */}
          <div className={styles.centerHub}>
            {renderCenterContent()}
          </div>

          <svg viewBox="0 0 600 540" className={styles.donutSvg} aria-hidden="true">
            {/* Slices group: grows as solid pie from 0 to 1, then inner radius expands from 0 to 82 */}
            <g className={styles.pieGroup}>
              {slices.map((slice) => {
                const isHovered = hoveredId === slice.id;
                const isAnyHovered = hoveredId !== null;
                const sliceOpacity = isAnyHovered ? (isHovered ? 1 : 0.35) : 1;

                return (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    stroke={slice.color}
                    strokeWidth="0.75"
                    strokeLinejoin="round"
                    opacity={sliceOpacity}
                    className={styles.slicePath}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => handleMouseEnter(slice.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleToggle(slice.id)}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* 6 Manually Positioned Speech Bubbles */}
        {slices.map((slice) => {
          const isHovered = hoveredId === slice.id;
          const isAnyHovered = hoveredId !== null;

          // Radial stagger based on clockwise angle around center (0° top to 360°)
          // Slices start entry at 450ms (pie already solid and expanding hole), staggering over 350ms
          const radialDelayMs = shouldReduceMotion
            ? 0
            : 450 + Math.round((slice.midAngle / 360) * 350);

          return (
            <div
              key={slice.id}
              className={styles.cardWrapper}
              style={{
                left: `${(slice.cfg.left / 600) * 100}%`,
                top: `${(slice.cfg.top / 540) * 100}%`,
              }}
            >
              <SpeechBubble
                label={slice.label[lang]}
                value={fmt(slice.value, {
                  maximumFractionDigits: isPercentData ? 1 : 0,
                })}
                delta={slice.delta}
                pct={slice.pctDisplay || `${fmt(slice.fraction * 100, { maximumFractionDigits: 1 })}%`}
                trend={slice.cfg.trend}
                hook={slice.cfg.hook}
                isActive={isHovered}
                isDimmed={isAnyHovered && !isHovered}
                animationDelay={shouldReduceMotion ? undefined : `${radialDelayMs}ms`}
                onMouseEnter={() => handleMouseEnter(slice.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleToggle(slice.id)}
              />
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
