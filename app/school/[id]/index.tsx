import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useClasses } from "../../../src/hooks/useClasses";
import { useSchools } from "../../../src/hooks/useSchools";
import {
  Plus,
  School as SchoolIcon,
  MapPin,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
} from "lucide-react-native";
import { Text } from "@gluestack-ui/nativewind";
import { ConfirmationModal } from "../../../src/components/ConfirmationModal";

import { useTranslation } from "react-i18next";

export default function SchoolDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    classes, 
    fetchClasses, 
    deleteClass, 
    isLoading, 
    isLoadingMore, 
    hasMoreClasses 
  } = useClasses(id!);

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
    if (id) fetchClasses(id);
  }, [id]);

  const handleDeleteSchool = () => {
    setModalConfig({
      isOpen: true,
      title: "Delete School",
      message: `Are you sure you want to delete "${school?.name}"? This will also remove all its classes.`,
      onConfirm: async () => {
        await deleteSchool(id!);
        router.replace("/");
      },
    });
  };

  const handleDeleteClass = (classId: string, className: string) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Class",
      message: `Are you sure you want to delete "${className}"?`,
      onConfirm: async () => {
        await deleteClass(classId);
      },
    });
  };

  if (!school) return null;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: "Unidade Escolar",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              className="mr-4"
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => router.push(`/school/${id}/edit`)}
                className="mr-4 w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/10"
              >
                <Pencil size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteSchool}
                className="w-10 h-10 bg-destructive/20 rounded-full items-center justify-center border border-destructive/20"
              >
                <Trash2 size={18} color="hsl(var(--destructive))" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />

      {/* School Info Header */}
      <View className="bg-primary/20 pb-8 pt-6 px-6 rounded-b-[40px]">
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center shadow-lg shadow-primary/30">
            <SchoolIcon size={40} color="#0f172a" />
          </View>
          <View className="flex-1 ml-5">
            <Text className="text-white text-3xl font-bold tracking-tight">
              {school.name}
            </Text>
            <View className="flex-row items-center mt-2">
              <MapPin size={16} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/60 text-sm ml-1.5 flex-1" numberOfLines={1}>
                {school.address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-8">
          <View>
            <Text className="text-white text-2xl font-bold">{t("classes")}</Text>
            <Text className="text-primary/80 text-sm font-medium">
              {t("units_found", { count: classes.length })}
            </Text>
          </View>
          <TouchableOpacity
            testID="add-class-button"
            className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-xl shadow-primary/20"
            onPress={() => router.push(`/school/${id}/class/new`)}
          >
            <Plus size={28} color="#0f172a" />
          </TouchableOpacity>
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
                  <Users size={48} color="#cbd5e1" />
                  <Text className="text-slate-400 mt-4 text-center font-medium">
                    No classes registered for this school yet.
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View className="glass mb-4 rounded-[28px] p-5 flex-row items-center border border-white/5">
                  <View className="w-14 h-14 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
                    <Users size={26} color="rgba(255,255,255,0.7)" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white font-bold text-lg tracking-tight">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 mr-2">
                        <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">
                          {item.shift}
                        </Text>
                      </View>
                      <Text className="text-white/40 text-xs font-medium">
                        Ano Letivo: {item.academicYear}
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
                      <Pencil size={16} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-10 h-10 bg-destructive/10 rounded-xl items-center justify-center border border-destructive/20"
                      onPress={() => handleDeleteClass(item.id, item.name)}
                    >
                      <Trash2 size={16} color="hsl(var(--destructive))" />
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
