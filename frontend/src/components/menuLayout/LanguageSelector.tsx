import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.css";
import { updateLanguage } from "../../services/user";
import { toast } from "react-toastify";

type LanguageOption = {
  code: string;
  name: string;
};

const languages: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    try {
      await updateLanguage(lang);
    } catch (error) {
      toast.error("Failed to update language. Please try again.");
    }
  };

  return (
    <div className={styles.languageSubmenu}>
      {languages.map((language) => (
        <button
          key={language.code}
          className={i18n.language === language.code ? styles.activeLanguage : ""}
          onClick={() => handleLanguageChange(language.code)}
        >
          {language.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
