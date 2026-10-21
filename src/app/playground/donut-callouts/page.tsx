"use client";
import React, { useState } from "react";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell/PlaygroundShell";
import { DonutCallouts } from "@/components/charts/DonutCallouts/DonutCallouts";
import { useLang } from "@/i18n/LanguageProvider";
import {
  orgTypologyData,
  activityScaleData,
  activityCategoriesData,
} from "@/data/sample";

export default function DonutCalloutsPlayground() {
  const { t } = useLang();
  const [selectedSet, setSelectedSet] = useState<"typology" | "categories" | "scale">("categories");

  // Interactive controls for center stats customization
  const [showNumber, setShowNumber] = useState(true);
  const [captionPosition, setCaptionPosition] = useState<"top" | "bottom">("top");
  const [showBadge, setShowBadge] = useState(true);
  const [customCaption, setCustomCaption] = useState("");
  const [customSubcaption, setCustomSubcaption] = useState("");

  const datasets = {
    typology: {
      title: t("label_org_typology"),
      data: orgTypologyData,
      caption: t("label_total_orgs"),
      isPercent: false,
    },
    categories: {
      title: t("label_activity_categories"),
      data: activityCategoriesData,
      caption: t("label_total_activities"),
      isPercent: false,
    },
    scale: {
      title: t("label_activity_scale"),
      data: activityScaleData,
      caption: t("label_percent"),
      isPercent: true,
    },
  };

  const current = datasets[selectedSet];

  const centerStatsConfig = {
    showNumber,
    captionPosition,
    caption: customCaption || current.caption,
    subcaption: customSubcaption || undefined,
    badgeText: showBadge ? undefined : false,
  };

  const propsDocumentation = `<DonutCallouts
  data={${selectedSet === "typology" ? "orgTypologyData" : selectedSet === "categories" ? "activityCategoriesData" : "activityScaleData"}}
  isPercentData={${current.isPercent}}
  centerStats={{
    showNumber: ${showNumber},
    captionPosition: "${captionPosition}",
    caption: "${centerStatsConfig.caption}",${customSubcaption ? `\n    subcaption: "${customSubcaption}",` : ""}${!showBadge ? `\n    badgeText: false,` : ""}
  }}
/>`;

  return (
    <PlaygroundShell
      title={t("pg_donut_title")}
      description={t("pg_donut_desc")}
      propsNote={propsDocumentation}
      initialTheme="bab2"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setSelectedSet("typology")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
              background: selectedSet === "typology" ? "var(--c-primary)" : "var(--bg-surface)",
              color: selectedSet === "typology" ? "var(--c-on-primary)" : "var(--text-base)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("label_org_typology")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSet("categories")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
              background: selectedSet === "categories" ? "var(--c-primary)" : "var(--bg-surface)",
              color: selectedSet === "categories" ? "var(--c-on-primary)" : "var(--text-base)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("label_activity_categories")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSet("scale")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
              background: selectedSet === "scale" ? "var(--c-primary)" : "var(--bg-surface)",
              color: selectedSet === "scale" ? "var(--c-on-primary)" : "var(--text-base)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("label_activity_scale")}
          </button>
        </div>

        {/* Center Stats Controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "10px 14px",
            background: "rgba(0, 0, 0, 0.03)",
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
            fontSize: "0.8125rem",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={showNumber}
              onChange={(e) => setShowNumber(e.target.checked)}
            />
            Show Number
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={showBadge}
              onChange={(e) => setShowBadge(e.target.checked)}
            />
            Show Badge
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
            Caption Pos:
            <select
              value={captionPosition}
              onChange={(e) => setCaptionPosition(e.target.value as "top" | "bottom")}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface)",
                fontSize: "0.8125rem",
              }}
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Subcaption:
            <input
              type="text"
              placeholder="(e.g. Types)"
              value={customSubcaption}
              onChange={(e) => setCustomSubcaption(e.target.value)}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface)",
                fontSize: "0.8125rem",
                width: "90px",
              }}
            />
          </label>
        </div>

        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--c-text)", textAlign: "center" }}>
          {current.title}
        </h3>

        <DonutCallouts
          key={`${selectedSet}-${showNumber}-${captionPosition}-${showBadge}`}
          data={current.data}
          centerStats={centerStatsConfig}
          isPercentData={current.isPercent}
        />
      </div>
    </PlaygroundShell>
  );
}
