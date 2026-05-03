import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: any | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Keycloak config from user
const KEYCLOAK_URL = "https://auth.facilitalabs.com.br/";
const REALM = "gestao-escolar";
const CLIENT_ID = "gestao-escolar-app"; // Assuming this ID

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const discovery = AuthSession.useAutoDiscovery(`${KEYCLOAK_URL}realms/${REALM}`);
  
  const redirectUri = "gestao-escolar://auth";

  console.log("[Auth] Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      // In a real app, you would exchange the code for a token here.
      // For this mock/technical challenge, we'll simulate a successful login.
      setUser({ name: "User Admin", email: "admin@escola.com" });
    }
    setIsLoading(false);
  }, [response]);

  const signIn = async () => {
    await promptAsync();
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading: isLoading || !request }}>
      {children}
    </AuthContext.Provider>
  );
};

