import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { SchoolListScreen, HeaderTitle, SchoolListHeaderRight, EmptySchoolsList } from "../screens/SchoolListScreen";
import { useSchools } from "../../../hooks/useSchools";
import { useAuth } from "../../../context/AuthContext";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("../../../hooks/useSchools", () => ({
  useSchools: jest.fn(),
}));

jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../context/ThemeContext", () => ({
  useThemeContext: jest.fn(() => ({
    colorScheme: "light",
  })),
}));

// Mock lucide-react-native
jest.mock("lucide-react-native", () => ({
  Plus: () => null,
  School: () => null,
  LogOut: () => null,
  Search: () => null,
  ChevronRight: () => null,
  MapPin: () => null,
}));

// Mock components
jest.mock("../../../components/LanguagePicker", () => ({
  LanguagePicker: () => null,
}));
jest.mock("../../../components/ThemeToggle", () => ({
  ThemeToggle: () => null,
}));

describe("SchoolListScreen", () => {
  const mockSchools = [
    { id: "1", name: "School A", address: "Address A" },
    { id: "2", name: "School B", address: "Address B" },
  ];

  const mockSignOut = jest.fn();
  const mockFetchSchools = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSchools as jest.Mock).mockReturnValue({
      schools: mockSchools,
      allSchools: mockSchools,
      isLoading: false,
      fetchSchools: mockFetchSchools,
      totalSchools: 2,
    });
    (useAuth as jest.Mock).mockReturnValue({
      signOut: mockSignOut,
    });
  });

  it("renders the list of schools", async () => {
    const { findByText, getByTestId } = render(<SchoolListScreen />);
    expect(getByTestId("schools-list")).toBeTruthy();
    expect(await findByText("School A")).toBeTruthy();
    expect(await findByText("School B")).toBeTruthy();
  });

  it("navigates to school details when a school is pressed", async () => {
    const { findByText } = render(<SchoolListScreen />);
    const schoolItem = await findByText("School A");
    fireEvent.press(schoolItem);
    expect(mockPush).toHaveBeenCalledWith("/school/1");
  });

  it("navigates to add school screen when add button is pressed", () => {
    const { getByTestId } = render(<SchoolListScreen />);
    fireEvent.press(getByTestId("add-school-button"));
    expect(mockPush).toHaveBeenCalledWith("/school/new");
  });

  it("filters schools based on search query", async () => {
    const { getByPlaceholderText, queryByText, findByText } = render(<SchoolListScreen />);
    const searchInput = getByPlaceholderText(/search/i);

    // Mock search result for query "School A"
    (useSchools as jest.Mock).mockReturnValue({
      schools: [mockSchools[0]],
      allSchools: mockSchools,
      isLoading: false,
      fetchSchools: mockFetchSchools,
      totalSchools: 2,
    });

    fireEvent.changeText(searchInput, "School A");
    expect(await findByText("School A")).toBeTruthy();
    expect(queryByText("School B")).toBeNull();
  });

  it("shows activity indicator when loading", async () => {
    (useSchools as jest.Mock).mockReturnValue({
      schools: [],
      allSchools: [],
      isLoading: true,
      fetchSchools: mockFetchSchools,
      totalSchools: 0,
    });
    const { getByTestId } = render(<SchoolListScreen />);
    await waitFor(() => expect(getByTestId("loading-indicator")).toBeTruthy());
  });

  describe("HeaderTitle", () => {
    it("renders correctly", () => {
      const { getByTestId } = render(<HeaderTitle />);
      expect(getByTestId("logo-image")).toBeTruthy();
    });
  });

  describe("SchoolListHeaderRight", () => {
    it("calls signOut when logout button is pressed", () => {
      const { getByTestId } = render(<SchoolListHeaderRight />);
      fireEvent.press(getByTestId("logout-button"));
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("EmptySchoolsList", () => {
    it("renders no schools message", () => {
      const { getByText } = render(<EmptySchoolsList />);
      expect(getByText(/no_schools/i)).toBeTruthy();
    });
  });
});
