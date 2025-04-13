import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileHeader from "./MobileHeader";
import styles from "./MenuLayout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const MenuLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <DesktopSidebar />
      <MobileHeader />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default MenuLayout;
