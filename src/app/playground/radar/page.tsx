"use client";
import React from "react";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell/PlaygroundShell";
import { RadarImpact } from "@/components/charts/RadarImpact/RadarImpact";
import { useLang } from "@/i18n/LanguageProvider";
import { radarImpactData, radarBenchmarkAverage } from "@/data/sample";

export default function RadarPlayground() {
  const { t } = useLang();

  const propsDocumentation = `<RadarImpact
  data={radarImpactData} // 6 axes: [{ subject: { id: "Jejaring", en: "Networking" }, score: 3.6, fullMark: 5 }, ...]
  avgScore={${radarBenchmarkAverage}}
/>`;

  return (
    <PlaygroundShell
      title={t("pg_radar_title")}
      description={t("pg_radar_desc")}
      propsNote={propsDocumentation}
      initialTheme="bab3"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", textAlign: "center" }}>
          {t("label_radar_impact")}
        </h3>
        <RadarImpact data={radarImpactData} avgScore={radarBenchmarkAverage} />
      </div>
    </PlaygroundShell>
  );
}
