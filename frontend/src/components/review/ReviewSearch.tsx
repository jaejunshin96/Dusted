import React from "react";
import styles from "./ReviewSearch.module.css";
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";

interface ReviewSearchProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sorting: string;
  onSortingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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

      <select
        className={styles.sortDropdown}
        value={sorting}
        onChange={onSortingChange}
        aria-label="Sort reviews"
      >
        <option value="created_at">{t("by Created")}</option>
        <option value="rating">{t("by Rating")}</option>
        <option value="5">{t("5 Stars")}</option>
        <option value="4">{t("4 Stars")}</option>
        <option value="3">{t("3 Stars")}</option>
        <option value="2">{t("2 Stars")}</option>
        <option value="1">{t("1 Stars")}</option>
      </select>

      <div
        className={styles.sortIcon}
        onClick={onOrderChange}
        role="button"
        aria-label={order === "dsc" ? "Sort ascending" : "Sort descending"}
      >
        <FaArrowDownLong
          size={20}
          className={order === "dsc" ? styles.rotateDown : styles.rotateUp}
        />
      </div>
    </div>
  );
};

export default ReviewSearch;
