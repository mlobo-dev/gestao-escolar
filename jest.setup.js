import "@testing-library/jest-native/extend-expect";

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
  const { Text } = require("react-native");
  return {
    Text: ({ children, className, ...props }) => (
      <Text {...props}>{children}</Text>
    ),
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
