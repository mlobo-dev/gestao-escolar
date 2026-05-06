import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { Search } from "lucide-react-native";
import { useThemeContext } from "../../context/ThemeContext";

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  containerClassName = "",
  className: inputClassName = "",
  ...props
}) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <View
      className={`flex-row items-center px-5 py-4 rounded-2xl border ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
      } ${containerClassName}`}
    >
      <Search size={20} color={iconColor} />
      <TextInput
        className={`flex-1 ml-3 text-lg font-medium ${
          isDark ? "text-white" : "text-slate-900"
        } ${inputClassName}`}
        placeholderTextColor={iconColor}
        {...props}
      />
    </View>
  );
};
