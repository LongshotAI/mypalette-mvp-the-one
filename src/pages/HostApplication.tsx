
import React from 'react';
import Layout from '@/components/layout/Layout';
import HostApplicationForm from '@/components/host/HostApplicationForm';

const HostApplication = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HostApplicationForm />
      </div>
    </Layout>
  );
};

export default HostApplication;
