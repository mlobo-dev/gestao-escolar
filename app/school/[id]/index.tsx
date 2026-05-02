import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useSchoolStore } from "../../../src/store/useSchoolStore";
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

export default function SchoolDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    schools,
    classes,
    fetchClasses,
    deleteSchool,
    deleteClass,
    isLoading,
  } = useSchoolStore();

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

  const school = schools.find((s) => s.id === id);

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
    <View className="flex-1 bg-slate-50">
      <Stack.Screen
        options={{
          headerTitle: "School Details",
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
                className="mr-3"
              >
                <Pencil size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSchool}>
                <Trash2 size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: "#1d4ed8" },
          headerTintColor: "#fff",
        }}
      />

      {/* School Info Header */}
      <View className="bg-blue-700 shadow-lg">
        <View className="w-full max-w-4xl px-6 pt-6 pb-12">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-white/10 rounded-[28px] items-center justify-center border border-white/20">
              <SchoolIcon size={40} color="#fff" />
            </View>
            <View className="ml-5 flex-1">
              <Text className="text-white text-3xl font-extrabold tracking-tight">
                {school.name}
              </Text>
              <View className="flex-row items-center mt-2 bg-white/10 self-start px-2 py-1 rounded-lg">
                <MapPin size={14} color="#fff" />
                <Text
                  className="text-blue-50 text-xs ml-1 font-medium"
                  numberOfLines={1}
                >
                  {school.address}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="h-8 bg-slate-50 rounded-t-[40px] -mt-8" />
      </View>

      {/* Classes Section */}
      <View className="flex-1 items-center px-4 mt-4">
        <View className="w-full max-w-4xl flex-1">
          <View className="flex-row justify-between items-center mb-6 px-2">
            <View>
              <Text className="text-slate-900 text-xl font-bold">Classes</Text>
              <Text className="text-slate-500 text-xs font-medium">
                {classes.length} {classes.length === 1 ? "class" : "classes"} total
              </Text>
            </View>
            <TouchableOpacity
              className="bg-blue-600 px-5 py-2.5 rounded-2xl flex-row items-center shadow-md active:opacity-80"
              onPress={() => router.push(`/school/${id}/class/new`)}
            >
              <Plus size={18} color="#fff" strokeWidth={3} />
              <Text className="text-white font-bold text-sm ml-1.5">
                New Class
              </Text>
            </TouchableOpacity>
          </View>

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
                <View className="bg-white mb-3 rounded-3xl p-4 flex-row items-center shadow-sm border border-slate-100">
                  <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
                    <Users size={24} color="#64748b" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-slate-900 font-bold text-base">
                      {item.name}
                    </Text>
                    <Text className="text-slate-500 text-xs mt-0.5">
                      {item.shift} • Year {item.academicYear}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      className="p-2 bg-slate-50 rounded-xl mr-2"
                      onPress={() =>
                        router.push(`/school/${id}/class/${item.id}/edit`)
                      }
                    >
                      <Pencil size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-2 bg-red-50 rounded-xl"
                      onPress={() => handleDeleteClass(item.id, item.name)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
