import { Stack } from "expo-router";
import { View } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/nativewind";
import { makeServer } from "../src/mocks/server";
import { StatusBar } from "expo-status-bar";
import { cssInterop, useColorScheme } from "nativewind";
import "../global.css";
import "../src/i18n";

cssInterop(Stack, { className: "style" });


import { 
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold 
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";

// Initialize mock server safely to prevent duplicate instances during Fast Refresh
if (process.env.NODE_ENV === "development" && !(window as any).server) {
  (window as any).server = makeServer();
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const isAtLogin = segments[0] === "login";

    if (!user && !isAtLogin) {
      router.replace("/login");
    } else if (user && isAtLogin) {
      router.replace("/");
    }
  }, [user, isLoading, segments, navigationState?.key]);

  if (!navigationState?.key) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#020617",
        },
        headerTintColor: "#f8fafc",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#020617" : "#fff",
        },
      }}
    />
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }} className={colorScheme === "dark" ? "dark" : ""}>
        <GluestackUIProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <InitialLayout key={colorScheme} />
        </GluestackUIProvider>
      </View>
    </AuthProvider>
  );
}
