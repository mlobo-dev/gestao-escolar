import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useThemeContext } from "@/context/ThemeContext";
import { useProtectedRoutes } from "@/hooks/useProtectedRoutes";

/**
 * Componente que define a estrutura de navegação principal.
 */
export const RootNavigation = () => {
  const { colorScheme } = useThemeContext();
  const { isLoading } = useProtectedRoutes();

  // Enquanto estiver carregando estado de auth ou navegação, não renderizamos nada
  if (isLoading) return null;

  return (
    <View
      key={`theme-wrapper-${colorScheme}`}
      style={{ flex: 1 }}
      className={colorScheme === "dark" ? "dark" : ""}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#020617" : "#fff",
          },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};
