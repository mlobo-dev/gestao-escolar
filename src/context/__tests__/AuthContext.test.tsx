import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import * as AuthSession from "expo-auth-session";

// Force use of actual context despite global mock in jest.setup.js
const { AuthProvider, useAuth } = jest.requireActual("../AuthContext");

jest.mock("expo-auth-session", () => ({
  useAutoDiscovery: jest.fn(),
  makeRedirectUri: jest.fn(),
  useAuthRequest: jest.fn(),
}));

jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthSession.useAutoDiscovery as jest.Mock).mockReturnValue({});
    (AuthSession.makeRedirectUri as jest.Mock).mockReturnValue(
      "gestao-escolar://auth"
    );
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      null,
      jest.fn(),
    ]);
  });

  it("should provide default loading state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it("should bypass auth if EXPO_PUBLIC_SKIP_AUTH is true", () => {
    process.env.EXPO_PUBLIC_SKIP_AUTH = "true";
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual({
      name: "Mock User (Bypass)",
      email: "mock@escola.com",
    });
    expect(result.current.isLoading).toBe(false);

    process.env.EXPO_PUBLIC_SKIP_AUTH = "false";
  });

  it("should handle signIn by calling promptAsync", async () => {
    const promptAsync = jest.fn();
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      null,
      promptAsync,
    ]);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn();
    });

    expect(promptAsync).toHaveBeenCalled();
  });

  it("should handle signOut", async () => {
    process.env.EXPO_PUBLIC_SKIP_AUTH = "true";
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    process.env.EXPO_PUBLIC_SKIP_AUTH = "false";
  });
});
