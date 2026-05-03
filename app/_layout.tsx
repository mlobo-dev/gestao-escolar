import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/nativewind";
import { makeServer } from "../src/mocks/server";
import "../global.css";
import "../src/i18n";


import { 
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold 
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useRouter, useSegments } from "expo-router";

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

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, isLoading, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "EduManager",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
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
    <GluestackUIProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
