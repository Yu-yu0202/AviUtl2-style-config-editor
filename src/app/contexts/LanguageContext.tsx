"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.ja) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    // ローカルストレージから言語設定を読み込み
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    } else {
      // ブラウザの言語設定を確認
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
      } else {
        setLanguageState('ja');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    try {
      // ローカルストレージから言語設定を読み込み
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      } else {
        // ブラウザの言語設定を確認
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
          setLanguageState('en');
        } else {
          setLanguageState('ja');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Fallback to default language
      setLanguageState('ja');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error setting language in localStorage:', error);
    }
  };

  const t = (key: keyof typeof translations.ja): string => {
  };

  const t = (key: keyof typeof translations.ja): string => {
    return translations[language][key] || translations.ja[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
