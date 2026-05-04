import { useThemeStore } from "../useThemeStore";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ colorScheme: "light" });
  });

  it("should have initial state light", () => {
    expect(useThemeStore.getState().colorScheme).toBe("light");
  });

  it("should toggle theme from light to dark", () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().colorScheme).toBe("dark");
  });

  it("should toggle theme from dark to light", () => {
    useThemeStore.setState({ colorScheme: "dark" });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().colorScheme).toBe("light");
  });

  it("should set theme directly", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().colorScheme).toBe("dark");
    
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().colorScheme).toBe("light");
  });
});
