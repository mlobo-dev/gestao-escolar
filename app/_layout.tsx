import React from "react";
import { Stack } from "expo-router";
import { cssInterop } from "nativewind";
import * as SplashScreen from "expo-splash-screen";

// Inicialização Global
import "../global.css";
import "@/i18n";
import "@/mocks/init";

// Recursos e Providers do SRC
import { useAppResources } from "@/hooks/useAppResources";
import { AppProvider } from "@/providers/AppProvider";
import { RootNavigation } from "@/navigation/RootNavigation";

// Interop para permitir estilização do Stack via NativeWind
cssInterop(Stack, { className: "style" });

// Mantém a Splash Screen visível até o carregamento dos recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isReady } = useAppResources();

  if (!isReady) return null;

  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}
