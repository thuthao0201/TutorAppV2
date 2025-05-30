import { Stack } from "expo-router";

export default function TutorLayout() {
  return (
    <Stack stylye={{ flex: 1 }} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Gia sư" }} />
      <Stack.Screen name="[id]/index" options={{ title: "Chi tiết gia sư" }} />
    </Stack>
  );
}
