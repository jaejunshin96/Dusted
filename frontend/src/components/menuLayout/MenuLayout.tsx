import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileHeader from "./MobileHeader";
import Footer from "../footer/Footer";
import styles from "./MenuLayout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const MenuLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <DesktopSidebar />
      <MobileHeader />
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MenuLayout;
