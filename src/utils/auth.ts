import keycloak from '@/config/keycloakConfig';
import { getTokenHeader, setTokenHeader } from './header';
import { stringUtils } from './stringUtils';
import type { UserInfo } from '@/types';

export const getUserInfo = async (): Promise<UserInfo | null> => {
  if (keycloak.authenticated === false) return null;
  try {
    await keycloak.updateToken(5); // Ensure token is fresh (5-second min validity)
    const userInfo = await keycloak.loadUserInfo();
    return userInfo as UserInfo;
  } catch (error) {
    console.error('Failed to load user info:', error);
    return null;
  }
};

export const authenticated = async () => {
  if (!keycloak.authenticated) {
    login();
  } else {
    const bearerToken = (getTokenHeader() as string) || '';
    if (!stringUtils.isNotNullAndEmpty(bearerToken)) {
      const res = await getAccessToken();
      if (res !== null && !stringUtils.isNotNullAndEmpty(res)) {
        setTokenHeader(res);
      }
    }
  }
};

export const getUserRoles = (): string[] => {
  if (keycloak.tokenParsed && keycloak.tokenParsed.realm_access) {
    return keycloak.tokenParsed.realm_access.roles || [];
  }
  return [];
};

export const hasRole = (role: string): boolean => {
  return getUserRoles().includes(role);
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    await keycloak.updateToken(5);
    return keycloak.token as string;
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  keycloak.logout({
    redirectUri: 'http://localhost:3000/home'
    // redirectUri: window.location.origin,
  });
};

export const isAuthenticated = () => {
  if (keycloak) {
    return keycloak.authenticated;
  }
};

export const login = () => {
  if (keycloak !== undefined && keycloak.authenticated === false) {
    keycloak.login();
  }
};
