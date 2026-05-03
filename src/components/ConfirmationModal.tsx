import React from "react";
import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { Trash2, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

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

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 p-6" style={Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}}>
        {/* Container */}

        <View 
          className="bg-card w-full rounded-[40px] overflow-hidden border border-white/10"
          style={Platform.OS === 'web' ? { maxWidth: 400 } : { maxWidth: '90%' }}
        >
          {/* Header */}
          <View className="bg-destructive/10 p-8 items-center border-b border-white/5">
            <View className="w-20 h-20 bg-destructive/20 rounded-3xl items-center justify-center mb-6 border border-destructive/30">
              <Trash2 size={36} color="#ef4444" />
            </View>
            <Text className="text-foreground text-2xl font-bold text-center tracking-tight">
              {title || t("confirm_delete_title")}
            </Text>
          </View>

          {/* Body */}
          <View className="p-8">
            <Text className="text-muted-foreground text-center text-lg leading-6 font-medium">
              {message || t("confirm_delete_desc")}
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row p-8 pt-0 gap-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-white/5 h-16 rounded-2xl items-center justify-center border border-white/10"
            >
              <Text className="text-white/70 font-bold text-lg">{cancelText || t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-destructive h-16 rounded-2xl items-center justify-center shadow-lg shadow-destructive/20"
            >
              <Text className="text-foreground font-bold text-lg">{confirmText || t("delete")}</Text>
            </TouchableOpacity>
          </View>


          {/* Close button top right */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-2 rounded-full"
          >
            <X size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
