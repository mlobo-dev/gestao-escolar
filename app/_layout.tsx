import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/nativewind";
import { makeServer } from "../src/mocks/server";
import "../global.css";

// Initialize mock server
makeServer();

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1a56db",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Gestão Escolar",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
