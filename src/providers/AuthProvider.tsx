'use client';

import keycloak from '@/config/keycloakConfig';
import { authenticated, getAccessToken, getUserInfo } from '@/utils/auth';
import { setTokenHeader } from '@/utils/header';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useCallback } from 'react';

keycloak.onAuthSuccess = () => {
  console.log('Auth success');
};

keycloak.onAuthError = () => {
  console.log('Auth error');
};

keycloak.onAuthLogout = () => {
  console.log('Auth logout');
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { initialized, keycloak } = useKeycloak();
  const checkLogin = useCallback(async () => {
    if (initialized && !keycloak.authenticated) keycloak.login();
    else {
      try {
        const res = await getAccessToken();
        if (res) setTokenHeader(res);
      } catch (error) {
        // TODO: if it's error, redirect to login
        console.log(error);
        keycloak.login();
      }
    }
  }, [initialized, keycloak]);

  useEffect(() => {
    const handleGetUserInfo = async () => {
      const res = await getUserInfo();
      console.log(res);
    };

    // handleGetUserInfo();
  }, []);

  useEffect(() => {
    checkLogin();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
