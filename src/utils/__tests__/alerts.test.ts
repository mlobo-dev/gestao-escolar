import { Alert, Platform } from "react-native";
import { confirmDelete } from "../alerts";

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: "ios",
  },
}));

describe("alerts utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call Alert.alert on mobile (iOS)", () => {
    const onConfirm = jest.fn();
    confirmDelete("Title", "Message", onConfirm);

    expect(Alert.alert).toHaveBeenCalledWith("Title", "Message", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm },
    ]);
  });

  it("should call globalThis.confirm on web", () => {
    // @ts-ignore
    Platform.OS = "web";
    // @ts-ignore
    global.confirm = jest.fn(() => true);
    const onConfirm = jest.fn();

    confirmDelete("Title", "Message", onConfirm);

    expect(global.confirm).toHaveBeenCalledWith("Title\n\nMessage");
    expect(onConfirm).toHaveBeenCalled();

    // @ts-ignore
    delete global.confirm;
    // @ts-ignore
    Platform.OS = "ios";
  });

  it("should not call onConfirm on web if cancelled", () => {
    // @ts-ignore
    Platform.OS = "web";
    // @ts-ignore
    global.confirm = jest.fn(() => false);
    const onConfirm = jest.fn();

    confirmDelete("Title", "Message", onConfirm);

    expect(global.confirm).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();

    // @ts-ignore
    delete global.confirm;
    // @ts-ignore
    Platform.OS = "ios";
  });
});
