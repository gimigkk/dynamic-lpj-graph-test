"use client";
import React, { useEffect, useRef, useState, useId } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { RadarItem } from "@/data/sample";
import { r2, polar } from "@/lib/geom";
import styles from "./RadarImpact.module.css";

export interface RadarImpactProps {
  data: RadarItem[];
  avgScore?: number;
}

const VIEW_W = 540;
const VIEW_H = 400;

export function RadarImpact({ data, avgScore = 3.29 }: RadarImpactProps) {
  const { lang, fmt, t } = useLang();
  const gradId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  const cx = 270;
  const cy = 195;
  const R = 150;
  const levels = [1, 2, 3, 4, 5];

  const axisAnglesDeg = [-60, 0, 60, 120, 180, 240];
  const axisAnglesRad = axisAnglesDeg.map((deg) => (deg * Math.PI) / 180);

  const axisData = axisAnglesDeg.map((_, index) => {
    return (
      data[index] || {
        subject: { id: `Axis ${index}`, en: `Axis ${index}` },
        score: 3.5,
        fullMark: 5,
      }
    );
  });

  // Identify biggest data point index and left axis score (180deg axis, index 4)
  const maxScoreIdx = axisData.reduce(
    (maxIdx, curr, i, arr) => (curr.score > arr[maxIdx].score ? i : maxIdx),
    0
  );
  const leftScore = axisData[4]?.score ?? 3.5;

  const [progressValues, setProgressValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [dotOpacities, setDotOpacities] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [fillOpacity, setFillOpacity] = useState<number>(0);
  // Full-polygon glitch flicker opacity + dash offset jitter
  const [avgOpacity, setAvgOpacity] = useState<number>(0);
  const [avgDashOffset, setAvgDashOffset] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setHoveredIdx((prev) => (prev === idx ? null : idx));
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      setProgressValues([1, 1, 1, 1, 1, 1]);
      setDotOpacities([1, 1, 1, 1, 1, 1]);
      setFillOpacity(1);
      setAvgOpacity(1);
      setAvgDashOffset(0);
      return;
    }
    if (isInView) {
      const controls: { stop: () => void }[] = [];

      let curProg = [0, 0, 0, 0, 0, 0];
      let curOpac = [0, 0, 0, 0, 0, 0];
      let curFill = 0;
      let curAvgOpac = 0;
      let curAvgDash = 0;

      let rafId: number | null = null;
      const scheduleFlush = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            setProgressValues([...curProg]);
            setDotOpacities([...curOpac]);
            setFillOpacity(curFill);
            setAvgOpacity(curAvgOpac);
            setAvgDashOffset(curAvgDash);
          });
        }
      };

      // Average polygon glitch-flicker: triggers after main polygon completes its outward expansion
      // Rapid staccato opacity sequence simulating power surging into the neon line
      const flickerSteps = [0, 0.85, 0.15, 1, 0.3, 0.95, 0.6, 1];
      controls.push(
        animate(0, 1, {
          duration: 0.55,
          delay: 0.85, // starts right as main data lines settle
          ease: "linear",
          onUpdate: (latest) => {
            const idx = Math.min(Math.floor(latest * (flickerSteps.length - 1)), flickerSteps.length - 1);
            curAvgOpac = flickerSteps[idx];
            scheduleFlush();
          },
        })
      );

      // Dash offset glitch jitter during the flicker window
      controls.push(
        animate(28, 0, {
          duration: 0.55,
          delay: 0.85,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (val) => {
            curAvgDash = val;
            scheduleFlush();
          },
        })
      );

      // Smooth fill opacity ramp
      controls.push(
        animate(0, 1, {
          duration: 0.7,
          ease: "easeOut",
          onUpdate: (latest) => {
            curFill = latest;
            scheduleFlush();
          },
        })
      );

      // Symmetrical propagation starting at maxScoreIdx:
      // Distance: dist 0 = peak, dist 1 = neighbors left & right, dist 2, dist 3 = opposite
      for (let i = 0; i < 6; i++) {
        const rawDiff = Math.abs(i - maxScoreIdx);
        const dist = Math.min(rawDiff, 6 - rawDiff); // 0, 1, 2, or 3
        const delay = dist * 0.12; // propagates symmetrically left and right

        // 1. Individual axis expansion
        controls.push(
          animate(0, 1, {
            duration: 0.8,
            delay,
            ease: [0.34, 1.56, 0.64, 1], // organic overshoot
            onUpdate: (val) => {
              curProg[i] = val;
              scheduleFlush();
            },
          })
        );

        // 2. Individual dot fade-in
        controls.push(
          animate(0, 1, {
            duration: 0.45,
            delay,
            ease: "easeOut",
            onUpdate: (val) => {
              curOpac[i] = val;
              scheduleFlush();
            },
          })
        );
      }

      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        controls.forEach((c) => c.stop());
      };
    }
  }, [isInView, shouldReduceMotion, maxScoreIdx]);

  const getPolygonPoints = (radiusGetter: (index: number) => number): string => {
    return axisAnglesRad
      .map((angle, i) => {
        const pt = polar(cx, cy, radiusGetter(i), angle);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");
  };

  const gridRings = levels.map((lvl) => {
    const levelR = r2((lvl / 5) * R);
    const points = getPolygonPoints(() => levelR);
    return { level: lvl, levelR, points };
  });

  const dataPointsCoords = axisData.map((item, i) => {
    const p = progressValues[i] ?? 0;
    const r = p * (item.score / 5) * R;
    const pt = polar(cx, cy, r, axisAnglesRad[i]);
    return { x: pt.x, y: pt.y, item, index: i };
  });
  const dataPolygonPoints = dataPointsCoords
    .map((pt) => `${pt.x},${pt.y}`)
    .join(" ");

  const avgR = r2((avgScore / 5) * R);
  const avgPolygonPoints = getPolygonPoints(() => avgR);

  // Gradient runs along the direction of the largest axis (Program Quality -> opposite)
  const maxAngle = axisAnglesRad[maxScoreIdx];
  const oppAngle = maxAngle + Math.PI;
  const gradStart = polar(cx, cy, R, maxAngle);
  const gradEnd = polar(cx, cy, R, oppAngle);

  const getLabelInfo = (index: number) => {
    const angle = axisAnglesRad[index];

    switch (index) {
      case 0:
        return {
          x: r2(cx + R * Math.cos(angle) + 14),
          y: r2(cy + R * Math.sin(angle) - 8),
          anchor: "start" as const,
          lines: lang === "id" ? ["Kualitas", "Program"] : ["Program", "Quality"],
        };
      case 1:
        return {
          x: r2(cx + R + 14),
          y: r2(cy + 16),
          anchor: "start" as const,
          lines:
            lang === "id"
              ? ["Kompetensi", "Pengurus"]
              : ["Competence of", "Administrators"],
        };
      case 2:
        return {
          x: r2(cx + R * Math.cos(angle) - 8),
          y: r2(cy + R * Math.sin(angle) + 24),
          anchor: "middle" as const,
          lines: [lang === "id" ? "Eksposur Publik" : "Public Exposure"],
        };
      case 3:
        return {
          x: r2(cx + R * Math.cos(angle)),
          y: r2(cy + R * Math.sin(angle) + 24),
          anchor: "middle" as const,
          lines: [lang === "id" ? "Efektivitas" : "Effectiveness"],
        };
      case 4:
        return {
          x: r2(cx - R - 22),
          y: r2(cy - 4),
          anchor: "end" as const,
          lines: lang === "id" ? ["SDM"] : ["Human", "Resources"],
        };
      case 5:
        return {
          x: r2(cx + R * Math.cos(angle) - 8),
          y: r2(cy + R * Math.sin(angle) - 10),
          anchor: "end" as const,
          lines: [lang === "id" ? "Jejaring" : "Network"],
        };
      default:
        return { x: cx, y: cy, anchor: "middle" as const, lines: [""] };
    }
  };

  return (
    <div ref={ref} className={styles.container}>
      {hoveredIdx !== null && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{axisData[hoveredIdx].subject[lang]}</div>
          <div className={styles.tooltipScore}>
            {fmt(axisData[hoveredIdx].score, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            / {fmt(5)}
          </div>
        </div>
      )}

      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg}>
          <defs>
            <linearGradient
              id={gradId}
              x1={gradStart.x}
              y1={gradStart.y}
              x2={gradEnd.x}
              y2={gradEnd.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="var(--c-primary)" stopOpacity={0.92} />
              <stop offset="50%" stopColor="var(--c-primary)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--c-primary)" stopOpacity={0.08} />
            </linearGradient>
          </defs>

          {/* 1. Background grid rings */}
          {gridRings.map(({ level, points }) => (
            <polygon key={`ring-${level}`} points={points} className={styles.gridRing} />
          ))}

          {/* 2. Radial spokes */}
          {axisAnglesRad.map((angle, i) => {
            const endPt = polar(cx, cy, R, angle);
            return (
              <line
                key={`spoke-${i}`}
                x1={cx}
                y1={cy}
                x2={endPt.x}
                y2={endPt.y}
                className={styles.spoke}
              />
            );
          })}

          {/* 4. Main data polygon fill & outline (staggered grow + smooth fade-in) */}
          <polygon
            points={dataPolygonPoints}
            fill={`url(#${gradId})`}
            opacity={fillOpacity}
            className={styles.dataPolygon}
          />

          {/* 5. Left axis tick numbers rendered ABOVE fill so inside numbers stay crisp & white */}
          {levels.map((lvl) => {
            const isInside = lvl <= Math.floor(leftScore);
            return (
              <text
                key={`axis-tick-${lvl}`}
                x={r2(cx - (lvl / 5) * R)}
                y={r2(cy + 12)}
                textAnchor="middle"
                className={isInside ? styles.axisNumberInside : styles.axisNumber}
              >
                {fmt(lvl)}
              </text>
            );
          })}

          {/* 6. Average benchmark line: stationary scale, glitch-flickering polygon with clean continuous corners */}
          <polygon
            points={avgPolygonPoints}
            opacity={avgOpacity}
            strokeDashoffset={avgDashOffset}
            className={styles.averagePolygon}
          />

          {/* 7. Vertex data dots (individually faded in) */}
          {dataPointsCoords.map(({ x, y, item, index }) => (
            <g key={`dot-g-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={20}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => handleToggle(index)}
              />
              <circle
                cx={x}
                cy={y}
                r={5.5}
                opacity={dotOpacities[index] ?? 0}
                className={styles.dataDot}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleToggle(index)}
              >
                <title>{`${item.subject[lang]}: ${fmt(item.score, { minimumFractionDigits: 2 })}`}</title>
              </circle>
            </g>
          ))}

          {/* 8. Axis labels */}
          {axisData.map((_, i) => {
            const { x, y, anchor, lines } = getLabelInfo(i);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor={anchor}
                className={styles.axisLabel}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleToggle(i)}
              >
                {lines.map((line, lineIdx) => (
                  <tspan key={`line-${lineIdx}`} x={x} dy={lineIdx === 0 ? 0 : "1.25em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span className={styles.legendPrimaryVisual}>
            <span className={styles.legendPrimaryLine} />
            <span className={styles.legendPrimaryDot} />
          </span>
          <span>{t("label_radar_score")}</span>
        </div>
        <div className={styles.legendRow}>
          <span className={styles.legendDashedLine} />
          <span>
            {t("label_radar_avg")}:{" "}
            {fmt(avgScore, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/
            {fmt(5, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
