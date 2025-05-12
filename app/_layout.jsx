import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="tutors" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="notification" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="tutorRequestScreen" />
          <Stack.Screen name="listBookings" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
