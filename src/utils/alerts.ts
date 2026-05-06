import { Alert, Platform } from "react-native";

export const confirmDelete = (
  title: string,
  message: string,
  onConfirm: () => void
) => {
  if (Platform.OS === "web") {
    const confirmed = globalThis.confirm(`${title}\n\n${message}`);
    if (confirmed) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onConfirm },
    ]);
  }
};
