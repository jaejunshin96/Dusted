import React, { useState, useRef, useEffect } from "react";
import styles from "./ReviewSearch.module.css";
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";
import { RiArrowDownSFill } from "react-icons/ri";

interface ReviewSearchProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sorting: string;
  onSortingChange: (newSorting: string) => void;
  order: string;
  onOrderChange: () => void;
}

const ReviewSearch: React.FC<ReviewSearchProps> = ({
  inputValue,
  onInputChange,
  sorting,
  onSortingChange,
  order,
  onOrderChange,
}) => {
  const { t } = useTranslation();
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortOptionClick = (sortValue: string) => {
    onSortingChange(sortValue);
    setShowSortOptions(false);
  };

  return (
    <div className={styles.searchSection}>
      <input
        type="search"
        value={inputValue}
        onChange={onInputChange}
        placeholder={t("Search for reviews...")}
        className={styles.searchInput}
        aria-label="Search reviews"
      />

      <div
        className={styles.sortIcon}
        onClick={() => setShowSortOptions(!showSortOptions)}
        role="button"
        aria-label="Sort reviews"
        ref={dropdownRef}
      >
        <RiArrowDownSFill />

        {showSortOptions && (
          <div className={styles.sortOptionsDropdown}>
            <button
              onClick={() => handleSortOptionClick("created_at")}
              className={`${sorting === "created_at" ? styles.activeOption : ""}`}
            >
              {t("by Created")}
              {sorting === "created_at" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("rating")}
              className={`${sorting === "rating" ? styles.activeOption : ""}`}
            >
              {t("by Rating")}
              {sorting === "rating" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("5")}
              className={`${sorting === "5" ? styles.activeOption : ""}`}
            >
              {t("5 Stars")}
              {sorting === "5" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("4")}
              className={`${sorting === "4" ? styles.activeOption : ""}`}
            >
              {t("4 Stars")}
              {sorting === "4" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("3")}
              className={`${sorting === "3" ? styles.activeOption : ""}`}
            >
              {t("3 Stars")}
              {sorting === "3" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("2")}
              className={`${sorting === "2" ? styles.activeOption : ""}`}
            >
              {t("2 Stars")}
              {sorting === "2" && <div className={styles.activeIndicator}></div>}
            </button>

            <button
              onClick={() => handleSortOptionClick("1")}
              className={`${sorting === "1" ? styles.activeOption : ""}`}
            >
              {t("1 Stars")}
              {sorting === "1" && <div className={styles.activeIndicator}></div>}
            </button>
          </div>
        )}
      </div>

      <div
        className={styles.sortIcon}
        onClick={onOrderChange}
        role="button"
        aria-label={order === "dsc" ? "Sort ascending" : "Sort descending"}
      >
        <FaArrowDownLong
          className={order === "dsc" ? styles.rotateDown : styles.rotateUp}
        />
      </div>
    </div>
  );
};

export default ReviewSearch;
