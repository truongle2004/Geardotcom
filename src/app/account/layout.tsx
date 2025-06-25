'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import keycloak from '@/config/keycloakConfig';
import { login } from '@/utils/auth';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  if (!keycloak.authenticated) {
    login();
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
