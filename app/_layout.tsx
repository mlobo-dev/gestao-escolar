import { Stack } from "expo-router";
import { View } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/nativewind";
import { makeServer } from "../src/mocks/server";
import { StatusBar } from "expo-status-bar";
import { cssInterop, useColorScheme } from "nativewind";
import "../global.css";
import "../src/i18n";
import { useThemeStore } from "../src/store/useThemeStore";
import { useEffect } from "react";

cssInterop(Stack, { className: "style" });

import { 
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold 
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";

if (process.env.NODE_ENV === "development" && !(window as any).server) {
  (window as any).server = makeServer();
}

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useThemeStore();
  const { setColorScheme } = useColorScheme();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

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
    <View 
      key={`theme-wrapper-${colorScheme}`}
      style={{ flex: 1 }} 
      className={colorScheme === "dark" ? "dark" : ""}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </View>
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
    <AuthProvider>
      <GluestackUIProvider>
        <InitialLayout />
      </GluestackUIProvider>
    </AuthProvider>
  );
}
