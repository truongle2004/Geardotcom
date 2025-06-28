'use client';
import keycloak from '@/config/keycloakConfig';
import useUserStore from '@/store/userStore';
import type { UserInfo } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const KeycloakProviderWrapper = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { setUserInfo } = useUserStore();
  const handleEvent = async (event: string, error?: any) => {
    if (event === 'onAuthSuccess') {
      try {
        const res = (await keycloak.loadUserInfo()) as UserInfo;

        if (res) {
          setUserInfo(res);
          axiosInstance.defaults.headers.common['X-USER-ID'] =
            res.sub as string;
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false
      }}
      onEvent={handleEvent}
    >
      {children}
    </ReactKeycloakProvider>
  );
};

export default KeycloakProviderWrapper;
