import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
import "../styles/Layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="main1-content">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
