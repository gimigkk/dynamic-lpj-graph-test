import React from "react";
import { SOURCE_W, RIBBON_START_X, SVG_H, DESTINATIONS, DEST_TIMINGS } from "../SankeyAllocation.constants";
import styles from "../SankeyAllocation.module.css";

export const SankeyDefs = React.memo(function SankeyDefs() {
  return (
    <defs>
      {/* BPPTN Text Row Clip Paths */}
      <clipPath id="clip-bpptn-row1">
        <rect x="0" y="8" width={SOURCE_W} height="22" />
      </clipPath>
      <clipPath id="clip-bpptn-row2">
        <rect x="0" y="28" width={SOURCE_W} height="25" />
      </clipPath>

      {/* Non-BPPTN Text Line Clip Paths (Vertically centered) */}
      <clipPath id="clip-nonbpptn-line1">
        <rect x="0" y="121" width={SOURCE_W} height="44" />
      </clipPath>
      <clipPath id="clip-nonbpptn-line2">
        <rect x="0" y="172" width={SOURCE_W} height="28" />
      </clipPath>
      <clipPath id="clip-nonbpptn-line3">
        <rect x="0" y="210" width={SOURCE_W} height="52" />
      </clipPath>
      <clipPath id="clip-nonbpptn-line4">
        <rect x="0" y="278" width={SOURCE_W} height="65" />
      </clipPath>

      {/* Destination-Staggered Ribbon Wipe Masks */}
      {DESTINATIONS.map((dest) => (
        <clipPath key={`clip-wipe-${dest.id}`} id={`clip-wipe-${dest.id}`}>
          <rect
            x={RIBBON_START_X}
            y="0"
            width="0"
            height={SVG_H}
            className={styles.ribbonWipeRect}
            style={{
              animationDelay: DEST_TIMINGS[dest.id]?.wipeDelay || "0.4s",
            }}
          />
        </clipPath>
      ))}
    </defs>
  );
});
