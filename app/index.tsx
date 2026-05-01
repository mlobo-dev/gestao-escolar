import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSchoolStore } from "../src/store/useSchoolStore";
import {
  Search,
  Plus,
  School as SchoolIcon,
  MapPin,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "@gluestack-ui/nativewind";

export default function SchoolListScreen() {
  const router = useRouter();
  const { schools, fetchSchools, isLoading } = useSchoolStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header with Search */}
      <View className="bg-blue-700 px-4 pt-4 pb-8 rounded-b-[32px] shadow-lg">
        <View className="flex-row items-center bg-white/20 rounded-2xl px-4 py-2 border border-white/30">
          <Search size={20} color="#fff" opacity={0.7} />
          <TextInput
            className="flex-1 ml-2 text-white text-base"
            placeholder="Search schools..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="flex-row justify-between items-center mt-6">
          <View>
            <Text className="text-white text-2xl font-bold">Public Schools</Text>
            <Text className="text-blue-100 text-sm opacity-80">
              {filteredSchools.length} schools found
            </Text>
          </View>
          <TouchableOpacity
            testID="add-school-button"
            className="bg-white p-3 rounded-2xl shadow-sm"
            onPress={() => router.push("/school/new")}
          >
            <Plus size={24} color="#1a56db" />
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
                  className="bg-white mb-4 rounded-3xl p-4 flex-row items-center shadow-sm border border-slate-100"
                  onPress={() => router.push(`/school/${item.id}`)}
                >
                  <View className="w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center">
                    <SchoolIcon size={28} color="#1a56db" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-slate-900 font-bold text-lg">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color="#64748b" />
                      <Text className="text-slate-500 text-sm ml-1" numberOfLines={1}>
                        {item.address}
                      </Text>
                    </View>
                    <View className="bg-slate-100 self-start px-2 py-0.5 rounded-lg mt-2">
                      <Text className="text-slate-600 text-xs font-bold uppercase tracking-wider">
                        {item.countClasses} {item.countClasses === 1 ? "Class" : "Classes"}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}
