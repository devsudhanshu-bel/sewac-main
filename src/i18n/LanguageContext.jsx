import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import en from "./translations/en";
import kn from "./translations/kn";
import hi from "./translations/hi";

const translations = {
  en,
  kn,
  hi,
};

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "sewac-language";

const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn("Unable to read saved language:", error);
  }

  return DEFAULT_LANGUAGE;
};

const getNestedValue = (object, path) => {
  return path.split(".").reduce((current, key) => {
    if (current === undefined || current === null) {
      return undefined;
    }

    return current[key];
  }, object);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(
    getInitialLanguage
  );

  const setLanguage = (newLanguage) => {
    if (!translations[newLanguage]) {
      console.warn(
        `Unsupported language: ${newLanguage}`
      );

      return;
    }

    setLanguageState(newLanguage);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        newLanguage
      );
    } catch (error) {
      console.warn(
        "Unable to save language:",
        error
      );
    }
  };

  const t = (key, fallback) => {
    const value = getNestedValue(
      translations[language],
      key
    );

    if (value !== undefined) {
      return value;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    return key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      translations: translations[language],

      availableLanguages: [
        {
          code: "en",
          name: "English",
        },
        {
          code: "kn",
          name: "Kannada",
        },
        {
          code: "hi",
          name: "Hindi",
        },
      ],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside a LanguageProvider"
    );
  }

  return context;
};

export default LanguageContext;