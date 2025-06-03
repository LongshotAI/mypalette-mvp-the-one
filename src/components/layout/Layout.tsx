
import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNotifications?: boolean;
}

const Layout = ({ children, showNotifications = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showNotifications={showNotifications} />
      
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Layout;
