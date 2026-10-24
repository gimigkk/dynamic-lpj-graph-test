"use client";
import React, { useState, useEffect } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { ThemeSwitcher, ThemeName } from "@/components/playground/ThemeSwitcher/ThemeSwitcher";
import { LanguageToggle } from "@/components/playground/LanguageToggle/LanguageToggle";
import { DonutCallouts } from "@/components/charts/DonutCallouts/DonutCallouts";
import { RadarImpact } from "@/components/charts/RadarImpact/RadarImpact";
import { SankeyAllocation } from "@/components/charts/SankeyAllocation/SankeyAllocation";
import {
  activityCategoriesData,
  radarImpactData,
  radarBenchmarkAverage,
} from "@/data/sample";
import styles from "./page.module.css";

export default function BentoPlaygroundPage() {
  const [theme, setTheme] = useState<ThemeName>("bab1");
  const [replayKey, setReplayKey] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input / textarea / contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.code === "Space" && !isInput) {
        e.preventDefault();
        setReplayKey((k) => k + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.page} data-theme={theme}>
      <main className={styles.container}>
        {/* Top Controls */}
        <header className={styles.topBar}>
          <div>
            <h1 className={styles.title}>{t("nav_home")}</h1>
            <p className={styles.subtitle}>
              Annual accountability report chart modules.
            </p>
          </div>
          <div className={styles.controls}>
            <div className={styles.replayGroup}>
              <span className={styles.replayLabel}>Replay:</span>
              <button
                type="button"
                className={styles.replayBtn}
                onClick={() => setReplayKey((k) => k + 1)}
                title="Restart animations (Space)"
                aria-label="Restart animations"
              >
                <svg
                  className={styles.replayIcon}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
                </svg>
              </button>
            </div>
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
            <LanguageToggle />
          </div>
        </header>

        {/* Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Half Tile 1: Donut Distribution */}
          <section className={`${styles.bentoCard} ${styles.colHalf}`}>
            <h2 className={styles.cardTitle}>{t("pg_donut_title")}</h2>
            <DonutCallouts
              key={replayKey}
              data={activityCategoriesData}
              centerStats={{
                value: "186",
                caption: t("label_total_activities"),
                badgeText: "+18% vs 2024",
              }}
            />
          </section>

          {/* Half Tile 2: Radar Impact Assessment */}
          <section className={`${styles.bentoCard} ${styles.colHalf}`}>
            <h2 className={styles.cardTitle}>{t("pg_radar_title")}</h2>
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
              <RadarImpact key={replayKey} data={radarImpactData} avgScore={radarBenchmarkAverage} />
            </div>
          </section>

          {/* Full Tile: Bespoke Sankey Budget Allocation */}
          <section className={`${styles.bentoCard} ${styles.colFull}`}>
            <h2 className={styles.cardTitle}>{t("pg_sankey_title")}</h2>
            <SankeyAllocation key={replayKey} />
          </section>
        </div>
      </main>
    </div>
  );
}
