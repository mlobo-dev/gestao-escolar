import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { School as SchoolIcon, MapPin, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { School } from "../../../types";

interface SchoolCardProps {
  item: School;
  onPress: (id: string) => void;
  isDark: boolean;
  iconColor: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ item, onPress, isDark, iconColor }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      className={`p-6 rounded-[32px] mb-5 flex-row items-center border shadow-sm ${
        isDark 
          ? "bg-card border-white/10 shadow-black/40" 
          : "bg-white border-slate-100 shadow-slate-200/50"
      }`}
    >
      <View className={`w-16 h-16 rounded-2xl items-center justify-center border ${
        isDark ? "bg-white/5 border-white/10" : "bg-primary/10 border-primary/20"
      }`}>
        <SchoolIcon size={28} color={isDark ? "#10b981" : "#1a56db"} />
      </View>
      
      <View className="flex-1 ml-5">
        <Text className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-2">
          <MapPin size={14} color={iconColor} />
          <Text className={`text-sm ml-1.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {item.address}
          </Text>
        </View>
        <View className={`self-start px-4 py-1.5 rounded-full mt-4 border ${
          isDark ? "bg-primary/10 border-primary/25" : "bg-primary/10 border-primary/25"
        }`}>
          <Text className="text-primary text-[11px] font-bold uppercase tracking-widest">
            {item.countClasses || 0} {t("class", { count: item.countClasses || 0 })}
          </Text>
        </View>
      </View>
      
      <View className={`w-10 h-10 rounded-full items-center justify-center ${
        isDark ? "bg-white/5" : "bg-slate-50"
      }`}>
        <ChevronRight size={20} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};
