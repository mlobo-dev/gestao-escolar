import React from "react";
import { Modal, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { Trash2, X } from "lucide-react-native";

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
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 p-4">
        {/* Container with fixed max-width on web and padding on mobile */}
        <View 
          className="bg-white w-full rounded-[32px] overflow-hidden shadow-2xl"
          style={Platform.OS === 'web' ? { maxWidth: 400 } : { maxWidth: '90%' }}
        >
          {/* Header */}
          <View className="bg-red-50 p-8 items-center">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Trash2 size={32} color="#ef4444" />
            </View>
            <Text className="text-slate-900 text-xl font-bold text-center">
              {title}
            </Text>
          </View>

          {/* Body */}
          <View className="p-8">
            <Text className="text-slate-500 text-center text-base leading-6">
              {message}
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row p-6 pt-0 gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-slate-100 h-14 rounded-2xl items-center justify-center"
            >
              <Text className="text-slate-600 font-bold">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 h-14 rounded-2xl items-center justify-center shadow-sm"
              style={{ backgroundColor: "#ef4444" }}
            >
              <Text className="text-white font-bold">{confirmText}</Text>
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
