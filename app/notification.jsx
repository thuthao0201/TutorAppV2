import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-off-outline" size={32} color="#999" />
      <Text style={styles.message}>Không có thông báo mới</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
  },
  message: {
    marginTop: 8,
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
});
