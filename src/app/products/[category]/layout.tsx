'use client';
import LoadingOverlay from '@/components/LoadingOverlay';
import Navbar from '@/components/Navbar';
import { useKeycloak } from '@react-keycloak/web';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { initialized } = useKeycloak();
  if (!initialized) return <LoadingOverlay />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
