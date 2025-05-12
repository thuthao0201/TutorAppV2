import { Stack } from "expo-router";

export default function TutorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Gia sư" }} />
      <Stack.Screen name="[id]/index" options={{ title: "Chi tiết gia sư" }} />
    </Stack>
  );
}
