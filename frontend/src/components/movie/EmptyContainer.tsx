import React from "react";
import styles from "./EmptyContainer.module.css";
import { FaClapperboard } from "react-icons/fa6";

interface EmptyContainerProps {
  title: string;
  text: string;
}

const EmptyContainer: React.FC<EmptyContainerProps> = ({title, text}) => {

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIcon}>{<FaClapperboard />}</div>
      <h2 className={styles.emptyStateTitle}>{title}</h2>
      <p className={styles.emptyStateText}>{text}</p>
    </div>
  );
};

export default EmptyContainer;
