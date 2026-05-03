import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
import { Text } from "@gluestack-ui/nativewind";
import { useTranslation } from "react-i18next";
import { LanguagePicker } from "../src/components/LanguagePicker";
import { useAuth } from "../src/context/AuthContext";




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
  } = useSchools(searchQuery);

  useEffect(() => {
    fetchSchools();
  }, []);


  return (
    <View className="flex-1 bg-background">
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
              <LanguagePicker />
              <TouchableOpacity
                onPress={signOut}
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl items-center justify-center active:bg-white/10"
              >
                <LogOut size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )
        }}
      />
      {/* Header Section */}
      <View className="bg-card/50 pb-10 pt-8 px-6 rounded-b-[48px] border-b border-white/5">
        <View className="bg-white/5 flex-row items-center px-5 py-4 rounded-2xl border border-white/10">
          <Search size={20} color="rgba(255,255,255,0.5)" />
          <TextInput
            className="flex-1 ml-3 text-foreground text-lg font-medium"
            placeholder={t("search")}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View className="flex-row justify-between items-center mt-10">
          <View className="flex-1">
            <Text className="text-foreground text-3xl font-bold tracking-tight">{t("schools")}</Text>
            <Text className="text-muted-foreground text-sm font-medium mt-1">
              {t("units_found", { count: totalSchools })}
            </Text>
          </View>

          <TouchableOpacity
            testID="add-school-button"
            onPress={() => router.push("/school/new")}
            className="bg-primary w-16 h-16 rounded-[22px] items-center justify-center shadow-2xl shadow-primary/40"
          >
            <Plus size={32} color="#020617" />
          </TouchableOpacity>
        </View>
      </View>



      {/* List */}
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
                  className="bg-card border border-white/[0.05] p-6 rounded-[32px] mb-5 flex-row items-center shadow-sm shadow-black/40"
                >
                  <View className="w-16 h-16 bg-primary/20 rounded-2xl items-center justify-center border border-primary/30">
                    <SchoolIcon size={28} color="#10b981" />
                  </View>
                  
                  <View className="flex-1 ml-5">
                    <Text className="text-foreground text-xl font-bold">{item.name}</Text>
                    <View className="flex-row items-center mt-1.5">
                      <MapPin size={14} color="#94a3b8" />
                      <Text className="text-muted-foreground text-sm ml-1.5 font-medium">{item.address}</Text>
                    </View>
                    <View className="bg-primary/15 self-start px-4 py-1.5 rounded-full mt-4 border border-primary/25">
                      <Text className="text-primary text-[11px] font-bold uppercase tracking-widest">
                        {item.countClasses || 0} {t("classes")}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="bg-white/5 w-10 h-10 rounded-full items-center justify-center">
                    <ChevronRight size={20} color="#94a3b8" />
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
