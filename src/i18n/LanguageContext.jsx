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
import te from "./translations/te";
import ta from "./translations/ta";
import ma from "./translations/ma";

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  en,
  kn,
  hi,
  te,
  ta,
  ma,
};

/* =========================================================
   LANGUAGE OPTIONS
   ========================================================= */

const AVAILABLE_LANGUAGES = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "kn",
    name: "ಕನ್ನಡ",
  },
  {
    code: "hi",
    name: "हिंदी",
  },
  {
    code: "te",
    name: "తెలుగు",
  },
  {
    code: "ta",
    name: "தமிழ்",
  },
  {
    code: "ma",
    name: "മലയാളം",
  },
];

/* =========================================================
   LANGUAGE CONTEXT
   ========================================================= */

const LanguageContext = createContext(null);

/* =========================================================
   DEFAULT LANGUAGE
   ========================================================= */

const DEFAULT_LANGUAGE = "en";

/* =========================================================
   LOCAL STORAGE KEY
   ========================================================= */

const STORAGE_KEY = "sewac-language";

/* =========================================================
   GET INITIAL LANGUAGE
   ========================================================= */

const getInitialLanguage = () => {
  try {
    const savedLanguage =
      localStorage.getItem(STORAGE_KEY);

    if (
      savedLanguage &&
      Object.prototype.hasOwnProperty.call(
        translations,
        savedLanguage
      )
    ) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn(
      "Unable to read saved language:",
      error
    );
  }

  return DEFAULT_LANGUAGE;
};

/* =========================================================
   GET NESTED TRANSLATION VALUE
   ========================================================= */

const getNestedValue = (
  object,
  path
) => {
  if (
    !object ||
    !path ||
    typeof path !== "string"
  ) {
    return undefined;
  }

  return path
    .split(".")
    .reduce(
      (current, key) => {
        if (
          current === undefined ||
          current === null
        ) {
          return undefined;
        }

        return current[key];
      },
      object
    );
};

/* =========================================================
   LANGUAGE PROVIDER
   ========================================================= */

export const LanguageProvider = ({
  children,
}) => {
  const [
    language,
    setLanguageState,
  ] = useState(getInitialLanguage);

  /* =======================================================
     CHANGE LANGUAGE
  ======================================================= */

  const setLanguage = (
    newLanguage
  ) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        translations,
        newLanguage
      )
    ) {
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

  /* =======================================================
     TRANSLATION FUNCTION
  ======================================================= */

  const t = (
    key,
    fallback
  ) => {
    const currentTranslations =
      translations[language];

    /* -----------------------------------------------------
       Selected language
    ----------------------------------------------------- */

    const value =
      getNestedValue(
        currentTranslations,
        key
      );

    if (
      value !== undefined &&
      value !== null
    ) {
      return value;
    }

    /* -----------------------------------------------------
       English fallback
    ----------------------------------------------------- */

    const englishValue =
      getNestedValue(
        translations.en,
        key
      );

    if (
      englishValue !== undefined &&
      englishValue !== null
    ) {
      return englishValue;
    }

    /* -----------------------------------------------------
       Explicit fallback
    ----------------------------------------------------- */

    if (
      fallback !== undefined &&
      fallback !== null
    ) {
      return fallback;
    }

    /* -----------------------------------------------------
       Final fallback
    ----------------------------------------------------- */

    return key;
  };

  /* =======================================================
     UPDATE HTML LANGUAGE
  ======================================================= */

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      language,

      setLanguage,

      t,

      translations:
        translations[language],

      availableLanguages:
        AVAILABLE_LANGUAGES,
    }),
    [language]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/* =========================================================
   USE LANGUAGE HOOK
   ========================================================= */

export const useLanguage = () => {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside a LanguageProvider"
    );
  }

  return context;
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default LanguageContext;