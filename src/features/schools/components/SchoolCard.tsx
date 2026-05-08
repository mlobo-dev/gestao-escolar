import React from "react";
import { View, Text } from "react-native";
import {
  School as SchoolIcon,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { School } from "../../../types";
import { BaseCard } from "../../../components/common/BaseCard";
import { useThemeContext } from "../../../context/ThemeContext";
import { IconContainer } from "../../../components/common/IconContainer";

interface SchoolCardProps {
  item: School;
  onPress: (id: string) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ item, onPress }) => {
  const { t } = useTranslation();
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <BaseCard
      onPress={() => onPress(item.id)}
      leftContent={
        <IconContainer containerClassName={isDark ? "" : "bg-primary/10 border-primary/20"}>
          <SchoolIcon size={28} color={isDark ? "#10b981" : "#1a56db"} />
        </IconContainer>
      }
      rightContent={
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-50"
            }`}
        >
          <ChevronRight size={20} color={iconColor} />
        </View>
      }
    >
      <Text
        className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
      >
        {item.name}
      </Text>
      <View className="flex-row items-center mt-2">
        <MapPin size={14} color={iconColor} />
        <Text
          className={`text-sm ml-1.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {item.address}
        </Text>
      </View>
      <View
        className={`self-start px-4 py-1.5 rounded-full mt-4 border ${isDark
          ? "bg-primary/10 border-primary/25"
          : "bg-slate-50 border-slate-100"
          }`}
      >
        <Text className="text-primary text-[11px] font-bold uppercase tracking-widest">
          {item.countClasses || 0}{" "}
          {t("class", { count: item.countClasses || 0 })}
        </Text>
      </View>
    </BaseCard>
  );
};
