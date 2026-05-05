import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

export const AuthCallbackScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );
};
