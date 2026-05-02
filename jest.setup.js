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

jest.mock("react-native/Libraries/Text/Text", () => "Text");
jest.mock("react-native/Libraries/Components/View/View", () => "View");

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
    Screen: jest.fn(() => null),
  },
}));

// Mock lucide-react-native with a Proxy to handle any icon requested
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
  const React = require("react");
  return {
    Text: ({ children, ...props }) => React.createElement("Text", props, children),
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
