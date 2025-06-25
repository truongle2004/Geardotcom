'use client';
import LoadingOverlay from '@/components/LoadingOverlay';
import Header from '@/components/Header';
import { useKeycloak } from '@react-keycloak/web';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { initialized } = useKeycloak();
  if (!initialized) return <LoadingOverlay />;
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
