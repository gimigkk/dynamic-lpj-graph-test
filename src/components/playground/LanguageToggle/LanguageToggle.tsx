"use client";
import React from "react";
import { useLang } from "@/i18n/LanguageProvider";
import styles from "./LanguageToggle.module.css";

export function LanguageToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div className={styles.container}>
      <span className={styles.label}>{t("lang_label")}</span>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${lang === "id" ? styles.active : ""}`}
          onClick={() => setLang("id")}
          aria-label="Bahasa Indonesia"
        >
          ID
        </button>
        <button
          type="button"
          className={`${styles.button} ${lang === "en" ? styles.active : ""}`}
          onClick={() => setLang("en")}
          aria-label="English"
        >
          EN
        </button>
      </div>
    </div>
  );
}
