import React from "react";
import styles from "./EmptyContainer.module.css";

interface EmptyContainerProps {
  icon: string;
  title: string;
  text: string;
}

const EmptyContainer: React.FC<EmptyContainerProps> = ({icon, title, text}) => {

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <h2 className={styles.emptyStateTitle}>{title}</h2>
      <p className={styles.emptyStateText}>{text}</p>
    </div>
  );
};

export default EmptyContainer;
