import React from "react";
import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "react-native";
import { Trash2, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../store/useThemeStore";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: ConfirmationModalProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/80 p-6" style={Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}}>
        {/* Container */}
        <View 
          className={`w-full rounded-[40px] overflow-hidden border ${
            isDark ? "bg-[#0f172a] border-white/10" : "bg-white border-slate-200"
          }`}
          style={Platform.OS === 'web' ? { maxWidth: 400 } : { maxWidth: '95%' }}
        >
          {/* Header */}
          <View className="p-8 items-center pt-10">
            <View className="w-20 h-20 bg-red-500/10 rounded-3xl items-center justify-center mb-6 border border-red-500/20">
              <Trash2 size={36} color="#ef4444" />
            </View>
            <Text className={`text-2xl font-bold text-center tracking-tight leading-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {title || t("confirm_delete_title")}
            </Text>
          </View>

          {/* Body */}
          <View className="px-8 pb-8">
            <Text className={`text-center text-lg leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              {message || t("confirm_delete_desc")}
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row px-6 pb-10 gap-3">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className={`flex-1 h-16 rounded-2xl items-center justify-center border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
              }`}
            >
              <Text className={`font-bold text-lg ${
                isDark ? "text-white" : "text-slate-600"
              }`}>{cancelText || t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
              className="flex-1 bg-red-600 h-16 rounded-2xl items-center justify-center shadow-lg shadow-red-900/40"
            >
              <Text className="text-white font-bold text-lg">{confirmText || t("delete")}</Text>
            </TouchableOpacity>
          </View>

          {/* Close button top right */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5"
          >
            <X size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
