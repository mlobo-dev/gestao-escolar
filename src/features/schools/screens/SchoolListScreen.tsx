import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Text,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import LogoImg from "../../../../assets/images/logo.png";
import { useSchools } from "../../../hooks/useSchools";
import { Plus, School as SchoolIcon, LogOut } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { LanguagePicker } from "../../../components/LanguagePicker";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useAuth } from "../../../context/AuthContext";
import { useThemeContext } from "../../../context/ThemeContext";
import { SchoolCard } from "../components/SchoolCard";
import { SearchInput } from "../../../components/common/SearchInput";

const HeaderTitle = () => (
  <Image
    source={LogoImg}
    style={{ width: 160, height: 40, tintColor: "#f8fafc" }}
    resizeMode="contain"
  />
);

const SchoolListHeaderRight = () => {
  const { signOut } = useAuth();
  return (
    <View className="flex-row items-center gap-3 pr-2">
      <ThemeToggle />
      <LanguagePicker />
      <TouchableOpacity
        onPress={signOut}
        className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center active:bg-white/20"
      >
        <LogOut size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

export const SchoolListScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    schools: filteredSchools,
    totalSchools,
    isLoading,
    fetchSchools,
  } = useSchools(searchQuery);

  useEffect(() => {
    fetchSchools();
  }, []);

  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          headerTitle: HeaderTitle,
          headerRight: SchoolListHeaderRight,
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
          headerShadowVisible: false,
        }}
      />
      <View
        className={`pb-10 pt-8 px-6 rounded-b-[48px] border-b ${isDark ? "bg-card border-white/5" : "bg-slate-100 border-slate-200"}`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text
              className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("schools")}
            </Text>
            <Text
              className={`text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("units_found", { count: totalSchools })}
            </Text>
          </View>

          <TouchableOpacity
            testID="add-school-button"
            onPress={() => router.push("/school/new")}
            className="bg-primary w-16 h-16 rounded-[22px] items-center justify-center shadow-md"
          >
            <Plus size={32} color="#020617" />
          </TouchableOpacity>
        </View>

        <SearchInput
          placeholder={t("search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerClassName="mt-8"
        />
      </View>

      <View className="flex-1 items-center">
        <View className="w-full max-w-4xl flex-1">
          {isLoading && filteredSchools.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#1a56db" />
            </View>
          ) : (
            <FlatList
              data={filteredSchools}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              ListEmptyComponent={
                <View className="items-center justify-center pt-20">
                  <SchoolIcon size={64} color="#cbd5e1" />
                  <Text className="text-slate-400 mt-4 text-lg font-medium">
                    {t("no_schools")}
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <SchoolCard
                  item={item}
                  onPress={(id) => router.push(`/school/${id}`)}
                />
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};
