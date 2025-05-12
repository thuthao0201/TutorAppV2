import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth từ AuthContext
import { ApiClient } from "../../../config/api"; // Import ApiClient từ config/api
import { useRouter } from "expo-router";
import { convertImageToHttpUrl } from "../../../utils/image"; // Import hàm convertImageToHttpUrl từ utils
import { formatNumber } from "../../../utils/money"; // Import hàm formatNumber từ utils

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(user); // State để lưu thông tin người dùng
  const api = ApiClient(); // Khởi tạo ApiClient

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/users/information");
        console.log(response.data);

        setProfile(response.data); // Cập nhật thông tin người dùng
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile(); // Gọi hàm fetchProfile khi component mount
  }, []); // Chỉ gọi lại khi api thay đổir

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {profile ? (
          <>
            <Image
              source={{
                uri: convertImageToHttpUrl(profile.avatar),
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => router.push("/profile/settings")}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <Text>Đang tải thông tin...</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../listBookings")}
        >
          <Ionicons name="checkmark-done-circle" size={24} color="#ed8c82" />
          <Text>Đơn thuê gia sư</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../postedArticles")}
        >
          <Ionicons name="book" size={24} color="#ed8c82" />
          <Text>Bài đăng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.walletContainer}
        onPress={() => router.push("/profile/myWallet")}
      >
        <Text style={styles.walletTitle}>Ví tiền</Text>
        <Text>{formatNumber(profile?.balance)} đ</Text>
      </TouchableOpacity>

      {/* <View style={styles.transactionContainer}>
        <TouchableOpacity>
          <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>
        </TouchableOpacity>
        <View style={styles.transactionItem} />
        <View style={styles.transactionItem} />
        <View style={styles.transactionItem} />
      </View> */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    color: "gray",
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fccac5",
    padding: 10,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f8a1ae",
  },
  walletContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  walletTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    height: 40,
    backgroundColor: "#facfcf",
    borderRadius: 5,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: "#EA5A5A",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    //căn xuống cuối trang
    position: "absolute",
    bottom: 20,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
