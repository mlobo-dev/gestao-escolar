import "@testing-library/jest-native/extend-expect";
import { NativeModules } from "react-native";

// Mock NativeModules
NativeModules.StatusBarManager = {
  getConstants: jest.fn(() => ({ HEIGHT: 20 })),
};
NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  State: {},
  Directions: {},
};
NativeModules.RNWorkletsCore = {
  install: jest.fn(),
};
NativeModules.UIManager = {
  getViewManagerConfig: jest.fn(),
  getConstants: jest.fn(() => ({})),
  directEventTypes: {},
};

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const View = require('react-native').View;
  const SafeAreaProvider = ({ children }) => React.createElement(View, {}, children);
  SafeAreaProvider.displayName = 'SafeAreaProvider';
  const SafeAreaView = ({ children }) => React.createElement(View, {}, children);
  SafeAreaView.displayName = 'SafeAreaView';

  return {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    },
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    ScreenContainer: ({ children }) => React.createElement(View, {}, children),
    Screen: ({ children }) => React.createElement(View, {}, children),
    NativeScreen: ({ children }) => React.createElement(View, {}, children),
    NativeScreenContainer: ({ children }) => React.createElement(View, {}, children),
    ScreenStack: ({ children }) => React.createElement(View, {}, children),
    ScreenStackHeaderConfig: ({ children }) => React.createElement(View, {}, children),
    ScreenStackHeaderSubview: ({ children }) => React.createElement(View, {}, children),
    SearchBar: ({ children }) => React.createElement(View, {}, children),
  };
});

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: () => true,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: jest.fn(({ options }) => null),
  },
}));

// Mock lucide-react-native
jest.mock("lucide-react-native", () => {
  const React = require("react");
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return (props) => React.createElement(prop, props);
      },
    }
  );
});

// Mock @gluestack-ui/nativewind
jest.mock("@gluestack-ui/nativewind", () => {
  const { Text, View } = require("react-native");
  return {
    Text,
    View,
  };
});


// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock makeServer to avoid MirageJS errors in tests
jest.mock("./src/mocks/server", () => ({
  makeServer: jest.fn(() => ({
    shutdown: jest.fn(),
  })),
}));


