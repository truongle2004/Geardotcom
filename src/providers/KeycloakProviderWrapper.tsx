'use client';
import keycloak from '@/config/keycloakConfig';
import { ReactKeycloakProvider } from '@react-keycloak/web';
const KeycloakProviderWrapper = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: 'check-sso',
          checkLoginIframe: false
        }}
      >
        {children}
      </ReactKeycloakProvider>
    </>
  );
};

export default KeycloakProviderWrapper;
