import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.css";

type LanguageOption = {
  code: string;
  label: string;
};

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" }
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className={styles.languageSubmenu}>
      {languages.map((language) => (
        <button
          key={language.code}
          className={i18n.language === language.code ? styles.activeLanguage : ""}
          onClick={() => handleLanguageChange(language.code)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
