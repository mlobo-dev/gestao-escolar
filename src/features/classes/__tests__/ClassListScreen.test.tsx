import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { 
  ClassListScreen, 
  ClassListHeaderLeft, 
  ClassListHeaderRight, 
  EmptyList, 
  ListFooter 
} from "../screens/ClassListScreen";
import { useClasses } from "../../../hooks/useClasses";
import { useSchools } from "../../../hooks/useSchools";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    canGoBack: mockCanGoBack,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string, options?: any) => {
      if (options?.name) return `${str} ${options.name}`;
      if (options?.count !== undefined) return `${str} ${options.count}`;
      return str;
    },
  }),
}));

jest.mock("../../../hooks/useClasses", () => ({
  useClasses: jest.fn(),
}));

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

// Mock components
jest.mock("../components/ClassCard", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return {
    ClassCard: ({ item, onEdit, onDelete }: any) => (
      <TouchableOpacity testID={`class-card-${item.id}`} onPress={() => onEdit(item.id)}>
        <Text>{item.name}</Text>
        <TouchableOpacity testID={`delete-class-${item.id}`} onPress={() => onDelete(item.id, item.name)} />
      </TouchableOpacity>
    ),
  };
});

jest.mock("../../../components/ConfirmationModal", () => {
  const { View, TouchableOpacity, Text } = require("react-native");
  return {
    ConfirmationModal: ({ isOpen, onConfirm, onClose, confirmTestID }: any) => {
      if (!isOpen) return null;
      return (
        <View testID="confirmation-modal">
          <TouchableOpacity testID={confirmTestID} onPress={onConfirm} />
          <TouchableOpacity testID="close-modal" onPress={onClose} />
        </View>
      );
    },
  };
});

describe("ClassListScreen", () => {
  const mockClasses = [
    { id: "c1", name: "Math A", shift: "Morning", academicYear: "2024", schoolId: "1" },
    { id: "c2", name: "Science B", shift: "Afternoon", academicYear: "2024", schoolId: "1" },
  ];

  const mockSchools = [
    { id: "1", name: "School 1", address: "Address 1" },
  ];

  const mockDeleteClass = jest.fn();
  const mockDeleteSchool = jest.fn();
  const mockFetchClasses = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useClasses as jest.Mock).mockReturnValue({
      classes: mockClasses,
      fetchClasses: mockFetchClasses,
      deleteClass: mockDeleteClass,
      isLoading: false,
      isLoadingMore: false,
      hasMoreClasses: false,
    });
    (useSchools as jest.Mock).mockReturnValue({
      allSchools: mockSchools,
      deleteSchool: mockDeleteSchool,
    });
  });

  it("renders school info and class list", () => {
    const { getByText, getByTestId } = render(<ClassListScreen />);
    expect(getByText("School 1")).toBeTruthy();
    expect(getByText("Address 1")).toBeTruthy();
    expect(getByText("Math A")).toBeTruthy();
    expect(getByTestId("classes-list")).toBeTruthy();
  });

  it("navigates to edit class when class card is pressed", () => {
    const { getByTestId } = render(<ClassListScreen />);
    fireEvent.press(getByTestId("class-card-c1"));
    expect(mockPush).toHaveBeenCalledWith("/school/1/class/c1/edit");
  });

  it("opens delete class modal and confirms deletion", async () => {
    const { getByTestId } = render(<ClassListScreen />);
    fireEvent.press(getByTestId("delete-class-c1"));
    
    expect(getByTestId("confirmation-modal")).toBeTruthy();
    fireEvent.press(getByTestId("confirm-delete-class"));
    
    await waitFor(() => {
      expect(mockDeleteClass).toHaveBeenCalledWith("c1");
    });
  });

  it("handles loading state", () => {
    (useClasses as jest.Mock).mockReturnValue({
      classes: [],
      fetchClasses: mockFetchClasses,
      deleteClass: mockDeleteClass,
      isLoading: true,
      isLoadingMore: false,
      hasMoreClasses: false,
    });
    const { getByTestId } = render(<ClassListScreen />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("calls fetchClasses on scroll end when more classes available", () => {
    (useClasses as jest.Mock).mockReturnValue({
      classes: mockClasses,
      fetchClasses: mockFetchClasses,
      deleteClass: mockDeleteClass,
      isLoading: false,
      isLoadingMore: false,
      hasMoreClasses: true,
    });
    const { getByTestId } = render(<ClassListScreen />);
    const flatList = getByTestId("classes-list");
    
    fireEvent(flatList, "onEndReached");
    expect(mockFetchClasses).toHaveBeenCalledWith("1");
  });

  it("returns null when school not found", () => {
    (useSchools as jest.Mock).mockReturnValue({
      allSchools: [],
      deleteSchool: mockDeleteSchool,
    });
    const { toJSON } = render(<ClassListScreen />);
    expect(toJSON()).toBeNull();
  });

  describe("ClassListHeaderLeft", () => {
    it("navigates back when back button is pressed", () => {
      const { getByTestId } = render(<ClassListHeaderLeft />);
      fireEvent.press(getByTestId("back-button"));
      expect(mockBack).toHaveBeenCalled();
    });

    it("replaces with root if cannot go back", () => {
      mockCanGoBack.mockReturnValueOnce(false);
      const { getByTestId } = render(<ClassListHeaderLeft />);
      fireEvent.press(getByTestId("back-button"));
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  describe("ClassListHeaderRight", () => {
    it("navigates to edit school", () => {
      const { getByTestId } = render(<ClassListHeaderRight />);
      fireEvent.press(getByTestId("edit-school-button"));
      expect(mockPush).toHaveBeenCalledWith("/school/1/edit");
    });

    it("opens delete school modal and confirms", async () => {
      const { getByTestId } = render(<ClassListHeaderRight />);
      fireEvent.press(getByTestId("delete-school-button"));
      
      expect(getByTestId("confirmation-modal")).toBeTruthy();
      fireEvent.press(getByTestId("confirm-delete-school"));
      
      await waitFor(() => {
        expect(mockDeleteSchool).toHaveBeenCalledWith("1");
        expect(mockReplace).toHaveBeenCalledWith("/");
      });
    });

    it("closes modal on cancel", () => {
      const { getByTestId, queryByTestId } = render(<ClassListHeaderRight />);
      fireEvent.press(getByTestId("delete-school-button"));
      fireEvent.press(getByTestId("close-modal"));
      expect(queryByTestId("confirmation-modal")).toBeNull();
    });
  });

  describe("EmptyList", () => {
    it("renders correctly with search query", () => {
      const { getByTestId, getByText } = render(
        <EmptyList searchQuery="test" isDark={false} t={(s: string) => s} />
      );
      expect(getByTestId("search-icon")).toBeTruthy();
      expect(getByText("no_results_found")).toBeTruthy();
    });

    it("renders correctly without search query", () => {
      const { getByTestId, getByText } = render(
        <EmptyList searchQuery="" isDark={false} t={(s: string) => s} />
      );
      expect(getByTestId("users-icon")).toBeTruthy();
      expect(getByText("no_classes")).toBeTruthy();
    });
  });

  describe("ListFooter", () => {
    it("renders loading indicator when isLoadingMore is true", () => {
      const { getByTestId } = render(<ListFooter isLoadingMore={true} />);
      expect(getByTestId("list-footer-loading")).toBeTruthy();
    });

    it("renders null when isLoadingMore is false", () => {
      const { toJSON } = render(<ListFooter isLoadingMore={false} />);
      expect(toJSON()).toBeNull();
    });
  });
});
