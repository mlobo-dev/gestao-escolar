import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If the user is logged in (after AuthContext processes the response), 
    // we go to the home screen.
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );
}
