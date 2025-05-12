import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SideMenu({ closeDrawer }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Smart-Tutor</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          router.push("/home");
          closeDrawer();
        }}
      >
        <Ionicons name="home" size={24} color="#E57373" />
        <Text style={styles.menuText}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          router.push("/schedule");
          closeDrawer();
        }}
      >
        <Ionicons name="calendar" size={24} color="#E57373" />
        <Text style={styles.menuText}>Lịch học</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          router.push("/chat");
          closeDrawer();
        }}
      >
        <Ionicons name="chatbubbles" size={24} color="#E57373" />
        <Text style={styles.menuText}>Chatbot</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          router.push("/profile");
          closeDrawer();
        }}
      >
        <Ionicons name="person" size={24} color="#E57373" />
        <Text style={styles.menuText}>Cá nhân</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={closeDrawer}>
        <Ionicons name="close" size={24} color="gray" />
        <Text style={styles.menuText}>Đóng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E57373",
    marginBottom: 20,
  },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  menuText: { fontSize: 18, marginLeft: 15 },
});
