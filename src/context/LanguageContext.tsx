
import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
  formatDate: (date: Date | string) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

// Sample translations (in a real app, these would be loaded from separate files)
const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    employees: 'Employees',
    settings: 'Settings',
    adminPanel: 'Admin Panel',
  },
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    dashboard: 'Panel',
    tasks: 'Tareas',
    employees: 'Empleados',
    settings: 'Configuración',
    adminPanel: 'Panel de administración',
  },
  fr: {
    welcome: 'Bienvenue',
    login: 'Connexion',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    tasks: 'Tâches',
    employees: 'Employés',
    settings: 'Paramètres',
    adminPanel: "Panneau d'administration",
  },
  de: {
    welcome: 'Willkommen',
    login: 'Anmelden',
    logout: 'Abmelden',
    dashboard: 'Dashboard',
    tasks: 'Aufgaben',
    employees: 'Mitarbeiter',
    settings: 'Einstellungen',
    adminPanel: 'Admin-Panel',
  },
  zh: {
    welcome: '欢迎',
    login: '登录',
    logout: '登出',
    dashboard: '仪表板',
    tasks: '任务',
    employees: '员工',
    settings: '设置',
    adminPanel: '管理面板',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'es', 'fr', 'de', 'zh'].includes(savedLanguage)) {
      setLanguageState(savedLanguage as Language);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'es', 'fr', 'de', 'zh'].includes(browserLang)) {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  // Set language and save preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update document language attribute for accessibility
    document.documentElement.lang = lang;
  };

  // Translate a key
  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  // Format date according to current language
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    try {
      return new Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      return new Intl.DateTimeFormat('en').format(dateObj);
    }
  };

  // Format number according to current language
  const formatNumber = (num: number): string => {
    try {
      return new Intl.NumberFormat(language).format(num);
    } catch (error) {
      return new Intl.NumberFormat('en').format(num);
    }
  };

  // Format currency according to current language
  const formatCurrency = (amount: number, currency = 'USD'): string => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch (error) {
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
      }).format(amount);
    }
  };

  const value = {
    language,
    setLanguage,
    translate,
    formatDate,
    formatNumber,
    formatCurrency,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
