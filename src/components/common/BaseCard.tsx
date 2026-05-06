import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

interface BaseCardProps {
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  leftContent,
  rightContent,
  onPress,
  className = "",
  style,
}) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Container
      {...containerProps}
      className={`p-6 rounded-[32px] mb-4 flex-row items-center border shadow-sm ${
        isDark
          ? "bg-card border-white/10 shadow-black/40"
          : "bg-white border-slate-100 shadow-slate-200/50"
      } ${className}`}
      style={style}
    >
      {leftContent && <View className="mr-5">{leftContent}</View>}

      <View className="flex-1">{children}</View>

      {rightContent && <View className="ml-2">{rightContent}</View>}
    </Container>
  );
};
