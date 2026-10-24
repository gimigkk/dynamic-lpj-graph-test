"use client";
import React from "react";
import { useLang } from "@/i18n/LanguageProvider";
import styles from "./ThemeSwitcher.module.css";

export type ThemeName = "bab1" | "bab2" | "bab3";

interface ThemeSwitcherProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const { t } = useLang();

  const themes: { id: ThemeName; labelKey: "theme_bab1" | "theme_bab2" | "theme_bab3" }[] = [
    { id: "bab1", labelKey: "theme_bab1" },
    { id: "bab2", labelKey: "theme_bab2" },
    { id: "bab3", labelKey: "theme_bab3" },
  ];

  return (
    <div className={styles.container}>
      <span className={styles.label}>{t("theme_label")}</span>
      <div className={styles.buttonGroup}>
        {themes.map((th) => (
          <button
            key={th.id}
            type="button"
            className={`${styles.button} ${currentTheme === th.id ? styles.active : ""}`}
            onClick={() => onThemeChange(th.id)}
          >
            {t(th.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
