import React, { useState } from "react";
import styles from "./CountrySelector.module.css";
import { updateCountry } from "../../services/user";
import { toast } from "react-toastify";
import { countries } from "../../constants/localization";

const CountrySelector: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<string>(localStorage.getItem("country") || "US");

  const handleLanguageChange = async (countryCode: string) => {
    localStorage.setItem("country", countryCode);
    setCurrentCountry(countryCode);
    try {
      await updateCountry(countryCode);
      //window.location.reload();
    } catch (error) {
      toast.error("Failed to update country. Please try again.");
    }
  };

  return (
    <div className={styles.countrySubmenu}>
      {countries.map((country) => (
        <button
          key={country.code}
          className={currentCountry === country.code ? styles.activeCountry : ""}
          onClick={() => handleLanguageChange(country.code)}
        >
          {country.name}
        </button>
      ))}
    </div>
  );
};

export default CountrySelector;
