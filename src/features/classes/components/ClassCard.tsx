import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Users, Pencil, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SchoolClass } from "../../../types";

interface ClassCardProps {
  item: SchoolClass;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isDark: boolean;
  iconColor: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({ item, onEdit, onDelete, isDark, iconColor }) => {
  const { t } = useTranslation();

  return (
    <View className={`mb-4 rounded-[32px] p-6 flex-row items-center border shadow-sm ${
      isDark ? "bg-card border-white/5" : "bg-white border-slate-100"
    }`}>
      <View className={`w-14 h-14 rounded-2xl items-center justify-center border ${
        isDark ? "bg-white/5 border-white/10" : "bg-muted border-border"
      }`}>
        <Users size={26} color={iconColor} />
      </View>
      <View className="flex-1 ml-5">
        <Text className={`font-bold text-lg tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1.5">
          <View className="bg-primary/15 px-3 py-1 rounded-full border border-primary/25 mr-3">
            <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">
              {t(item.shift.toLowerCase().replace("-", "_"))}
            </Text>
          </View>
          <Text className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
            {t("academic_year")}: {item.academicYear}
          </Text>
        </View>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/10 mr-2"
          onPress={() => onEdit(item.id)}
        >
          <Pencil size={16} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-10 h-10 bg-destructive/10 rounded-xl items-center justify-center border border-destructive/20"
          onPress={() => onDelete(item.id, item.name)}
        >
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
