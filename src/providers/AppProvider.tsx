import React from "react";
import { GluestackUIProvider } from "@gluestack-ui/nativewind";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SchoolProvider } from "@/context/SchoolContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Componente centralizador de todos os providers da aplicação.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <SchoolProvider>
            <GluestackUIProvider>
              {children}
            </GluestackUIProvider>
          </SchoolProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
