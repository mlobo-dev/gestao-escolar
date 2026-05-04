import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useClasses } from "../../../src/hooks/useClasses";
import { useSchools } from "../../../src/hooks/useSchools";
import {
  Plus,
  Search,
  School as SchoolIcon,
  MapPin,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
} from "lucide-react-native";
import { useThemeStore } from "../../../src/store/useThemeStore";
import { ConfirmationModal } from "../../../src/components/ConfirmationModal";

import { useTranslation } from "react-i18next";

export default function SchoolDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    classes, 
    fetchClasses, 
    deleteClass, 
    isLoading, 
    isLoadingMore, 
    hasMoreClasses 
  } = useClasses(id!, searchQuery);

  const { allSchools, deleteSchool } = useSchools();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const school = allSchools.find((s) => s.id === id);

  useEffect(() => {
    if (id) fetchClasses(id, true);
  }, [id]);

  const handleDeleteSchool = () => {
    setModalConfig({
      isOpen: true,
      title: t("delete_school_title"),
      message: t("delete_school_message", { name: school?.name }),

      onConfirm: async () => {
        await deleteSchool(id!);
        router.replace("/");
      },
    });
  };

  const handleDeleteClass = (classId: string, className: string) => {
    setModalConfig({
      isOpen: true,
      title: t("delete_class_title"),
      message: t("delete_class_message", { name: className }),

      onConfirm: async () => {
        await deleteClass(classId);
      },
    });
  };

  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  if (!school) return null;

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          headerTitle: t("school_unit"),

          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              className="mr-4"
            >
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => router.push(`/school/${id}/edit`)}
                className="mr-4 w-10 h-10 bg-white/10 border border-white/10 rounded-full items-center justify-center"
              >
                <Pencil size={18} color="#f8fafc" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteSchool}
                className="w-10 h-10 bg-destructive/20 rounded-full items-center justify-center border border-destructive/20"
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: "#020617",
          },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />

      {/* School Info Header */}
      <View className={`pb-8 pt-6 px-6 rounded-b-[48px] border-b ${isDark ? "bg-card border-white/5" : "bg-slate-100 border-slate-200"}`}>
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center shadow-md">
            <SchoolIcon size={40} color="#020617" />
          </View>
          <View className="flex-1 ml-5">
            <Text className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
               {school.name}
             </Text>
             <View className="flex-row items-center mt-2">
               <MapPin size={16} color={iconColor} />
               <Text className={`text-sm ml-1.5 flex-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`} numberOfLines={1}>
                 {school.address}
               </Text>
             </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-10">
          <View>
            <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t("classes")}</Text>
            <Text className="text-primary text-sm font-medium mt-1">
              {t("units_found", { count: classes.length })}
            </Text>
          </View>
          <TouchableOpacity
            testID="add-class-button"
            className="bg-primary w-16 h-16 rounded-[22px] items-center justify-center shadow-md"
            onPress={() => router.push(`/school/${id}/class/new`)}
          >
            <Plus size={32} color="#020617" />
          </TouchableOpacity>
        </View>

        {/* Search Input for Classes */}
        <View className={`flex-row items-center px-5 py-3.5 rounded-2xl border mt-6 ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
        }`}>
          <Search size={18} color={iconColor} />
          <TextInput
            className={`flex-1 ml-3 text-base font-medium ${isDark ? "text-white" : "text-slate-900"}`}
            placeholder={t("search")}
            placeholderTextColor={iconColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Classes Section */}
      <View className="flex-1 items-center px-4 mt-4">
        <View className="w-full max-w-4xl flex-1">
          {isLoading ? (
            <ActivityIndicator size="large" color="#1a56db" className="mt-10" />
          ) : (
            <FlatList
              data={classes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={
                <View className="items-center justify-center pt-16">
                  {searchQuery ? (
                    <Search size={48} color="#cbd5e1" />
                  ) : (
                    <Users size={48} color="#cbd5e1" />
                  )}
                  <Text className={`mt-4 text-center font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {searchQuery ? t("no_results_found") : t("no_classes")}
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
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
                          {item.shift}
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
                      onPress={() =>
                        router.push(`/school/${id}/class/${item.id}/edit`)
                      }
                    >
                      <Pencil size={16} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-10 h-10 bg-destructive/10 rounded-xl items-center justify-center border border-destructive/20"
                      onPress={() => handleDeleteClass(item.id, item.name)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              onEndReached={() => {
                if (hasMoreClasses && !isLoadingMore) {
                  fetchClasses(id!);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <View className="py-6">
                    <ActivityIndicator color="hsl(var(--primary))" />
                  </View>
                ) : null
              }
            />

          )}
        </View>
      </View>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </View>
  );
}
