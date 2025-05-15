import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children || <Outlet />}
      <Footer />
    </>
  );
};

export default PublicLayout;
