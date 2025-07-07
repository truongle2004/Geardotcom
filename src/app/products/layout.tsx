'use client';
import Footer from '@/components/Footer';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useKeycloak } from '@react-keycloak/web';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { initialized } = useKeycloak();
  if (!initialized) return <LoadingOverlay />;
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
