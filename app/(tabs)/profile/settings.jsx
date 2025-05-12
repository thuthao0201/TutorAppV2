import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth từ AuthContext
import { ApiClient } from "../../../config/api"; // Import ApiClient từ config/api

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const api = ApiClient();

  const [oldPassword, setOldPassword] = useState(""); // State cho mật khẩu cũ
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handlePasswordChange = async () => {
    if (!oldPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu cũ!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp!");
      return;
    }
    try {
      // Gửi yêu cầu kiểm tra mật khẩu cũ và đổi mật khẩu
      const response = await api.put("/user/change-password", {
        oldPassword,
        newPassword: password,
      });

      if (response.data.status === "fail") {
        Alert.alert("Lỗi", response.data.message);
        return;
      }

      Alert.alert("Thành công", "Mật khẩu đã được cập nhật!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại.");
    }
  };

  const handlePersonalInfoChange = async () => {
    try {
      // Gửi yêu cầu cập nhật thông tin cá nhân
      await api.put("/user/update-profile", personalInfo);
      Alert.alert("Thành công", "Thông tin cá nhân đã được cập nhật!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "42%",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 20 }}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#EA5A5A" />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu cũ"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={personalInfo.name}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={personalInfo.email}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, email: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={personalInfo.phone}
          onChangeText={(text) =>
            setPersonalInfo({ ...personalInfo, phone: text })
          }
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handlePersonalInfoChange}
        >
          <Text style={styles.buttonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#EA5A5A",
  },
  section: {
    marginBottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#EA5A5A",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
