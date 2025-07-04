'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingOverlay from '@/components/LoadingOverlay';
import axiosInstance from '@/utils/axiosInstance';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login?.();
    }
  }, [initialized, keycloak]);

  if (!initialized) {
    return <LoadingOverlay />;
  }

  if (!keycloak.authenticated) {
    // NOTE: while login redirecting, render nothing or splash
    return null;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default AccountLayout;
