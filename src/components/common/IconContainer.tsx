import React from "react";
import { View } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

interface IconContainerProps {
  children: React.ReactNode;
  containerClassName?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({ 
  children, 
  containerClassName = "" 
}) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`w-14 h-14 rounded-2xl items-center justify-center ${
        isDark ? "bg-white/10" : "bg-slate-100"
      } ${containerClassName}`}
    >
      {children}
    </View>
  );
};
