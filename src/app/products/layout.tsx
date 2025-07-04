'use client';
import LoadingOverlay from '@/components/LoadingOverlay';
import Header from '@/components/Header';
import { useKeycloak } from '@react-keycloak/web';
import Footer from '@/components/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { initialized } = useKeycloak();
  if (!initialized) return <LoadingOverlay />;
  return (
    <>
      <Header />
      {children}
      <Footer/>
    </>
  );
};

export default Layout;
