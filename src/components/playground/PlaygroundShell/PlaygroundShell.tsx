"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { ThemeSwitcher, ThemeName } from "../ThemeSwitcher/ThemeSwitcher";
import { LanguageToggle } from "../LanguageToggle/LanguageToggle";
import styles from "./PlaygroundShell.module.css";

interface PlaygroundShellProps {
  title: string;
  description: string;
  propsNote: string;
  initialTheme?: ThemeName;
  children: React.ReactNode;
}

export function PlaygroundShell({
  title,
  description,
  propsNote,
  initialTheme = "bab1",
  children,
}: PlaygroundShellProps) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);
  const { t } = useLang();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            {t("nav_back")}
          </Link>
          <div className={styles.controls}>
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
            <LanguageToggle />
          </div>
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </header>

        {/* Theme wrapper applying data-theme attribute */}
        <section className={styles.card} data-theme={theme}>
          {children}
        </section>

        <section className={styles.propsNote}>
          <h2 className={styles.propsHeading}>{t("props_title")}</h2>
          <div className={styles.propsBody}>{propsNote}</div>
        </section>
      </div>
    </div>
  );
}
