"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import id from "./dictionaries/id.json";
import en from "./dictionaries/en.json";

export type Lang = "id" | "en";
export type Dict = typeof id;

// Enforce that en matches the keys of id strictly
const _enCheck: Dict = en;
const dictionaries: Record<Lang, Dict> = { id, en: _enCheck };

export interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict, params?: Record<string, string | number>) => string;
  fmt: (n: number, opts?: Intl.NumberFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "id" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // localStorage may be disabled
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      // localStorage may be disabled
    }
  }, []);

  const t = useCallback(
    (key: keyof Dict, params?: Record<string, string | number>): string => {
      let str = dictionaries[lang][key] ?? (id[key] as string) ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return str;
    },
    [lang]
  );

  const fmt = useCallback(
    (n: number, opts?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", opts).format(n);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, fmt }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside LanguageProvider");
  }
  return ctx;
};
