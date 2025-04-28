import React, { useState } from "react";
import styles from "./CountrySelector.module.css";
import { updateCountry } from "../../services/user";
import { toast } from "react-toastify";

type CountryOption = {
  code: string;
  name: string;
};

const countries: CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
];

const CountrySelector: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<string>(localStorage.getItem("country") || "US");

  const handleLanguageChange = async (country: string) => {
    localStorage.setItem("country", country);
    setCurrentCountry(country);
    try {
      await updateCountry(country);
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
