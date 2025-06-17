'use client';

import LoadingOverlay from '@/components/LoadingOverlay';
import { useKeycloak } from '@react-keycloak/web';

const CartLayout = ({ children }: { children: React.ReactNode }) => {
  const { initialized, keycloak } = useKeycloak();
  if (initialized && !keycloak.authenticated) keycloak.login();
  if (!initialized) return <LoadingOverlay />;
  return <>{children}</>;
};

export default CartLayout;
