import { Stack } from "expo-router";

export default function ClassesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Lớp học" }} />
      <Stack.Screen name="[id]" options={{ title: "Chi tiết lớp học" }} />
    </Stack>
  );
}
