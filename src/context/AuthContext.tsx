import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: { name: string; email: string } | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Keycloak config from environment variables
const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
const REALM = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
const CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const discovery = AuthSession.useAutoDiscovery(
    `${KEYCLOAK_URL}realms/${REALM}`
  );

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "gestao-escolar",
    path: "auth",
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID!,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  const isSkipAuth = process.env.EXPO_PUBLIC_SKIP_AUTH === "true";

  useEffect(() => {
    if (isSkipAuth) {
      setUser({ name: "Mock User (Bypass)", email: "mock@escola.com" });
      setIsLoading(false);
      return;
    }

    if (response?.type === "success") {
      setUser({ name: "User Admin", email: "admin@escola.com" });
    }
    setIsLoading(false);
  }, [response, isSkipAuth]);

  const signIn = async () => {
    if (isSkipAuth) {
      setUser({ name: "Mock User (Bypass)", email: "mock@escola.com" });
      return;
    }
    await promptAsync();
  };

  const signOut = async () => {
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      isLoading: isLoading || (!isSkipAuth && !request),
    }),
    [user, signIn, signOut, isLoading, isSkipAuth, request]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
