"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "bn";

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "insprjtn-language",
  ...props
}: {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
  [key: string]: any;
}) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem(storageKey) as Language;
    if (savedLang === "en" || savedLang === "bn") {
      Promise.resolve().then(() => setLanguage(savedLang));
    }
    Promise.resolve().then(() => setMounted(true));
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(storageKey, language);
  }, [language, storageKey, mounted]);

  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
    },
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
