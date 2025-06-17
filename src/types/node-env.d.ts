declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: string;
    NEXT_PUBLIC_KEYCLOAK_REALMS: string;
    NEXT_PUBLIC_KEYCLOAK_URL: string;
    SERVER_URL: string;
  }
}
