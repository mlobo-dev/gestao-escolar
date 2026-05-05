import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, RefreshCcw } from "lucide-react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center p-6">
          <View className="bg-slate-900 p-8 rounded-[40px] border border-white/10 items-center w-full max-w-sm shadow-2xl">
            <View className="w-20 h-20 bg-destructive/20 rounded-full items-center justify-center mb-6">
              <AlertCircle size={40} color="#ef4444" />
            </View>
            
            <Text className="text-white text-2xl font-bold text-center mb-4">
              Ops! Algo deu errado
            </Text>
            
            <Text className="text-slate-400 text-center mb-8 leading-6">
              Ocorreu um erro inesperado na aplicação. Por favor, tente reiniciar.
            </Text>

            <TouchableOpacity
              onPress={this.handleReset}
              className="bg-primary px-8 py-4 rounded-2xl flex-row items-center justify-center w-full"
            >
              <RefreshCcw size={20} color="#020617" className="mr-2" />
              <Text className="text-slate-950 font-bold text-lg ml-2">Reiniciar App</Text>
            </TouchableOpacity>
            
            {__DEV__ && (
              <View className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 w-full">
                <Text className="text-red-400 text-xs font-mono" numberOfLines={3}>
                  {this.state.error?.toString()}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
