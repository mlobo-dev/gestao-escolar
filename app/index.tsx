import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Text,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import LogoImg from "../assets/images/logo.png";


import { useSchools } from "../src/hooks/useSchools";
import {
  Search,
  Plus,
  School as SchoolIcon,
  MapPin,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { LanguagePicker } from "../src/components/LanguagePicker";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { useAuth } from "../src/context/AuthContext";
import { useThemeStore } from "../src/store/useThemeStore";




export default function SchoolListScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    schools: filteredSchools,
    totalSchools,
    isLoading,
    isLoadingMore,
    hasMoreSchools,
    fetchSchools,
  } = useSchools(searchQuery); // Exemplo de hook customizado para busca de escolas

  useEffect(() => {
    fetchSchools();
  }, []);


  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <Image 
              source={LogoImg} 
              style={{ width: 160, height: 40, tintColor: "#f8fafc" }}
              resizeMode="contain"
            />
          ),


          headerRight: () => (


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
          ),
          headerStyle: {
            backgroundColor: "#020617",
          },
          headerTintColor: "#f8fafc",
          headerShadowVisible: false,
        }}
      />
      <View className={`pb-10 pt-8 px-6 rounded-b-[48px] border-b ${isDark ? "bg-card border-white/5" : "bg-slate-100 border-slate-200"}`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {t("schools")}
            </Text>
            <Text className={`text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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

        <View className={`flex-row items-center px-5 py-4 rounded-2xl border mt-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
          <Search size={20} color={iconColor} />
          <TextInput
            className={`flex-1 ml-3 text-lg font-medium ${isDark ? "text-white" : "text-slate-900"}`}
            placeholder={t("search")}
            placeholderTextColor={iconColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
                    No schools found
                  </Text>
                </View>
              }
              renderItem={({ item }) => (

                <TouchableOpacity
                  onPress={() => router.push(`/school/${item.id}`)}
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
              )}
            />


          )}
        </View>
      </View>
    </View>
  );
}
