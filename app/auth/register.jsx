import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import InputField from "../../components/InputField";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const { signup } = useAuth(); // Lấy hàm register từ AuthContext
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Vui lòng điền đầy đủ thông tin đăng ký.");
      return;
    }
    try {
      const response = await signup({ name, email, password }); // Gọi hàm register với thông tin người dùng
      console.log("response: ", response); // In ra thông tin phản hồi từ server
      if (response) {
        alert("Đăng ký thành công!"); // Hiển thị thông báo nếu đăng ký thành công
      }
    } catch (error) {
      alert("Đăng ký không thành công. Vui lòng thử lại."); // Hiển thị thông báo lỗi nếu có
    }
  };

  // const [isChecked, setIsChecked] = useState(false); // State cho checkbox
  // const handlerCheckbox = () => {
  //   setIsChecked(!isChecked); // Đảo ngược trạng thái checkbox

  //   console.log(isChecked); // In ra trạng thái checkbox
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>
          Điền thông tin bên dưới hoặc đăng ký bằng tài khoản mạng xã hội
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nhập họ tên:</Text>
        <InputField
          placeholder="Họ và tên"
          onChangeText={(value) => setName(value)}
        />
        <Text style={styles.label}>Nhập email/ Số điện thoại:</Text>
        <InputField
          placeholder="Email/ Số điện thoại"
          onChangeText={(value) => setEmail(value)}
        />
        <Text style={styles.label}>Nhập mật khẩu:</Text>
        <InputField
          placeholder="Mật khẩu"
          secureTextEntry
          onChangeText={(value) => setPassword(value)}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox} />
          <Text style={styles.checkboxText}>
            Tôi đồng ý với điều khoản xử lý dữ liệu cá nhân
          </Text>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Hoặc đăng ký với</Text>
        {/* <SocialLogin /> */}
        <View style={styles.socialButtons}>
          <TouchableOpacity>
            <FontAwesome6 name="facebook" size={24} color="#0866FF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome6 name="square-twitter" size={25} color="#1C96E8" />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <FontAwesome6 name="google" size={24} color="#34A853" />
          </TouchableOpacity> */}
          <TouchableOpacity>
            <Image
              source={{
                uri:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" ||
                  "",
              }}
              style={{
                width: 26,
                height: 26,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome6 name="apple" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginText}>
            Bạn đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E57373",
  },
  header: {
    paddingHorizontal: 24,
    width: "100%",
    height: "20%",
    justifyContent: "center",
  },
  backButton: {
    backgroundColor: "#E57373",
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    justifyContent: "flex-start",
    paddingTop: 32,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    marginLeft: 32,
    alignSelf: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    // alignItems: "center",
    marginVertical: 0,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#E57373",
    borderRadius: 4,
    marginRight: 10,
    marginLeft: 20,
    alignSelf: "center",
  },
  checkboxText: {
    color: "#757575",
  },
  registerButton: {
    width: "90%",
    backgroundColor: "#E57373",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  orText: {
    textAlign: "center",
    marginVertical: 10,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#E57373",
    fontWeight: "bold",
  },
});
