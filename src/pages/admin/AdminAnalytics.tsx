
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into MyPalette platform performance
            </p>
          </div>

          <AnalyticsDashboard />
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;
