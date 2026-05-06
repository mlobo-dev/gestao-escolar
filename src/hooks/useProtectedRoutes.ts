import { useEffect } from "react";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useAuth } from "../context/AuthContext";

/**
 * Hook customizado para gerenciar o redirecionamento baseado no estado de autenticação.
 * Garante que usuários não autenticados sejam jogados para o login e usuários logados
 * não consigam voltar para a tela de login.
 */
export const useProtectedRoutes = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Se o roteador ainda não carregou a árvore de navegação, esperamos
    if (isLoading || !navigationState?.key) return;

    const isAtLogin = segments[0] === "login";

    // Lógica de proteção:
    // 1. Se não houver usuário e não estiver na tela de login -> Vai para o login
    if (!user && !isAtLogin) {
      router.replace("/login");
    }
    // 2. Se houver usuário e estiver na tela de login -> Vai para o home
    else if (user && isAtLogin) {
      router.replace("/");
    }
  }, [user, isLoading, segments, navigationState?.key]);

  return { isLoading: isLoading || !navigationState?.key };
};
