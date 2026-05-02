import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSchools } from "../src/hooks/useSchools";
import {
  Search,
  Plus,
  School as SchoolIcon,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "@gluestack-ui/nativewind";
import { makeServer } from "../src/mocks/server";
import { useTranslation } from "react-i18next";

// Start MirageJS if in development
// Start MirageJS mock server
if (!(window as any).server) {
  (window as any).server = makeServer();
}


export default function SchoolListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { schools, isLoading, isLoadingMore, hasMoreSchools, fetchSchools } = useSchools(searchQuery);

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = schools;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary/20 pb-10 pt-14 px-6 rounded-b-[40px]">
        <View className="bg-white/10 flex-row items-center px-4 py-3 rounded-2xl border border-white/10">
          <Search size={20} color="rgba(255,255,255,0.6)" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder={t("search")}

            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="flex-row justify-between items-center mt-6">
          <View>
            <Text className="text-white text-3xl font-bold tracking-tight">{t("schools")}</Text>
            <Text className="text-white/60 text-sm font-medium">
              {t("units_found", { count: filteredSchools.length })}
            </Text>

          </View>
          <TouchableOpacity
            testID="add-school-button"
            className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20"
            onPress={() => router.push("/school/new")}
          >
            <Plus size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>


      {/* List */}
      <View className="flex-1 items-center">
        <View className="w-full max-w-4xl flex-1">
          {isLoading && schools.length === 0 ? (
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
                  className="glass mb-5 rounded-[32px] p-5 flex-row items-center border border-white/5"
                  onPress={() => router.push(`/school/${item.id}`)}
                >
                  <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center border border-primary/20">
                    <SchoolIcon size={30} color="hsl(var(--primary))" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white font-bold text-xl tracking-tight">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1.5">
                      <MapPin size={14} color="rgba(255,255,255,0.5)" />
                      <Text className="text-white/50 text-sm ml-1 flex-1" numberOfLines={1}>
                        {item.address}
                      </Text>
                    </View>
                    <View className="bg-primary/10 self-start px-3 py-1 rounded-full mt-3 border border-primary/20">
                      <Text className="text-primary text-xs font-bold uppercase tracking-wider">
                        {item.countClasses || 0} Turmas
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              )}
              onEndReached={() => {
                if (hasMoreSchools && !isLoadingMore) {
                  fetchSchools();
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
    </View>
  );
}
