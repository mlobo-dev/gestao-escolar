import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useClasses } from "../../../hooks/useClasses";
import { useSchools } from "../../../hooks/useSchools";
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
import { useThemeContext } from "../../../context/ThemeContext";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { ClassCard } from "../components/ClassCard";
import { SearchInput } from "../../../components/common/SearchInput";
import { SchoolClass } from "../../../types";

const ClassListHeaderLeft = () => {
  const router = useRouter();
  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace("/");
  };
  return (
    <TouchableOpacity onPress={handleBack} className="mr-4">
      <ChevronLeft size={24} color="#f8fafc" />
    </TouchableOpacity>
  );
};

const ClassListHeaderRight = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allSchools, deleteSchool } = useSchools();
  const school = allSchools.find((s) => s.id === id);
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteSchool = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (id) {
      await deleteSchool(id);
      router.replace("/");
    }
  };

  return (
    <>
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("delete_school_title")}
        message={t("delete_school_message", { name: school?.name })}
      />
    </>
  );
};

const EmptyList = ({
  searchQuery,
  isDark,
  t,
}: {
  searchQuery: string;
  isDark: boolean;
  t: any;
}) => (
  <View className="items-center justify-center pt-16">
    {searchQuery ? (
      <Search size={48} color="#cbd5e1" />
    ) : (
      <Users size={48} color="#cbd5e1" />
    )}
    <Text
      className={`mt-4 text-center font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
    >
      {searchQuery ? t("no_results_found") : t("no_classes")}
    </Text>
  </View>
);

const ListFooter = ({ isLoadingMore }: { isLoadingMore: boolean }) => {
  if (!isLoadingMore) return null;
  return (
    <View className="py-6">
      <ActivityIndicator color="#1a56db" />
    </View>
  );
};

export const ClassListScreen = () => {
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
    hasMoreClasses,
  } = useClasses(id || "", searchQuery);

  const { allSchools } = useSchools();

  const [deleteClassModal, setDeleteClassModal] = useState<{
    isOpen: boolean;
    classId: string;
    className: string;
  }>({
    isOpen: false,
    classId: "",
    className: "",
  });

  const school = allSchools.find((s) => s.id === id);

  useEffect(() => {
    if (id) fetchClasses(id, true);
  }, [id]);

  const handleDeleteClass = (classId: string, className: string) => {
    setDeleteClassModal({
      isOpen: true,
      classId,
      className,
    });
  };

  const confirmDeleteClass = async () => {
    await deleteClass(deleteClassModal.classId);
    setDeleteClassModal({ ...deleteClassModal, isOpen: false });
  };

  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  const renderItem = ({ item }: { item: SchoolClass }) => (
    <ClassCard
      item={item}
      onEdit={(classId) => router.push(`/school/${id}/class/${classId}/edit`)}
      onDelete={handleDeleteClass}
    />
  );

  if (!school) return null;

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          headerTitle: t("school_unit"),
          headerLeft: ClassListHeaderLeft,
          headerRight: ClassListHeaderRight,
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      />

      <View
        className={`pb-8 pt-6 px-6 rounded-b-[48px] border-b ${isDark ? "bg-card border-white/5" : "bg-slate-100 border-slate-200"}`}
      >
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-primary rounded-3xl items-center justify-center shadow-md">
            <SchoolIcon size={40} color="#020617" />
          </View>
          <View className="flex-1 ml-5">
            <Text
              className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {school.name}
            </Text>
            <View className="flex-row items-center mt-2">
              <MapPin size={16} color={iconColor} />
              <Text
                className={`text-sm ml-1.5 flex-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
                numberOfLines={1}
              >
                {school.address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-10">
          <View>
            <Text
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("classes")}
            </Text>
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

        <SearchInput
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerClassName="mt-6"
          className="text-base"
        />
      </View>

      <View className="flex-1 items-center px-4 mt-4">
        <View className="w-full max-w-4xl flex-1">
          {isLoading && classes.length === 0 ? (
            <ActivityIndicator size="large" color="#1a56db" className="mt-10" />
          ) : (
            <FlatList
              data={classes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={
                <EmptyList searchQuery={searchQuery} isDark={isDark} t={t} />
              }
              renderItem={renderItem}
              onEndReached={() => {
                if (hasMoreClasses && !isLoadingMore) {
                  fetchClasses(id || "");
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={<ListFooter isLoadingMore={isLoadingMore} />}
            />
          )}
        </View>
      </View>

      <ConfirmationModal
        isOpen={deleteClassModal.isOpen}
        onClose={() => setDeleteClassModal({ ...deleteClassModal, isOpen: false })}
        onConfirm={confirmDeleteClass}
        title={t("delete_class_title")}
        message={t("delete_class_message", { name: deleteClassModal.className })}
      />
    </View>
  );
};
