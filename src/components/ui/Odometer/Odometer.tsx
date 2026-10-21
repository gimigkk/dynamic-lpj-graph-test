"use client";

import React, { useEffect, useState } from "react";
import styles from "./Odometer.module.css";

export interface OdometerProps {
  /** Formatted text string containing numbers, symbols, commas, percent (e.g. "88,3%" or "3,612") */
  value: string;
  /** Whether the reel starts rolling immediately or on trigger. Default true */
  active?: boolean;
  /** Animation duration string, e.g. "1.8s" or "2s". Default "2s" */
  duration?: string;
  /** Delay before reel spin begins in ms. Default 0 */
  delay?: number;
  /** Optional extra class name applied to container */
  className?: string;
}

// Proportional character width estimation for variable fonts (e.g. Fraunces) in em units
const DIGIT_WIDTH_EM: Record<number, string> = {
  0: "0.72em",
  1: "0.50em",
  2: "0.65em",
  3: "0.61em",
  4: "0.68em",
  5: "0.62em",
  6: "0.66em",
  7: "0.56em",
  8: "0.67em",
  9: "0.66em",
};

export function Odometer({
  value,
  active = true,
  duration = "2s",
  delay = 0,
  className,
}: OdometerProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsSpinning(false);
      return;
    }
    if (delay === 0) {
      setIsSpinning(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsSpinning(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, delay, value]);

  // Count total digits from right to left to configure gear-ratio revs
  let digitCount = 0;
  for (const char of value) {
    if (!Number.isNaN(parseInt(char, 10))) digitCount++;
  }

  let digitIdxFromRight = digitCount - 1;
  const items: Array<{
    char: string;
    isDigit: boolean;
    reel: number[];
    targetIdx: number;
  }> = [];

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    const digitVal = parseInt(char, 10);
    const isDigit = !Number.isNaN(digitVal);

    if (!isDigit) {
      items.push({ char, isDigit: false, reel: [], targetIdx: 0 });
    } else {
      // Gear ratio revs identical to DonutCallouts:
      // MSD (highest place) does 0 extra revs
      // Lower places add incremental rotations
      const fullRevs = Math.max(0, digitCount - 1 - digitIdxFromRight);
      const targetIdx = fullRevs * 10 + digitVal;

      const reel: number[] = [];
      for (let step = 0; step <= targetIdx; step++) {
        reel.push(step % 10);
      }

      items.push({ char, isDigit: true, reel, targetIdx });
      digitIdxFromRight--;
    }
  }

  return (
    <span
      className={`${styles.odometerRoot}${className ? ` ${className}` : ""}`}
      style={{ "--odometer-duration": duration } as React.CSSProperties}
      aria-label={value}
    >
      {items.map((item, idx) => {
        if (!item.isDigit) {
          return (
            <span key={`static-${idx}`} className={styles.odometerStatic}>
              {item.char}
            </span>
          );
        }

        const translateY = isSpinning
          ? -(item.targetIdx * 100) / item.reel.length
          : 0;

        const finalDigit = parseInt(item.char, 10);
        const colWidth = DIGIT_WIDTH_EM[finalDigit] || "0.65em";

        return (
          <span
            key={`digit-${idx}`}
            className={styles.odometerCol}
            style={{ width: colWidth }}
          >
            <span
              className={styles.odometerReel}
              style={{
                transform: `translateY(${translateY}%)`,
              }}
            >
              {item.reel.map((d, dIdx) => (
                <span key={`d-${dIdx}`} className={styles.odometerDigit}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
