import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { router, Redirect, useRootNavigationState } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../components/InputField";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const { login, isLoggedIn } = useAuth(); // Lấy hàm login từ AuthContext
  const [email, setEmail] = useState(""); // State cho email
  const [password, setPassword] = useState(""); // State cho password

  const handleLogin = async () => {
    try {
      console.log(email, password); // In ra thông tin đăng nhập

      await login(email, password); // Gọi hàm login từ AuthContext
    } catch (error) {
      console.error("Đăng nhập thất bại:", error); // In ra lỗi nếu có
      Alert.alert(
        "Đăng nhập thất bại",
        "Vui lòng kiểm tra thông tin đăng nhập của bạn."
      );
    }
  };

  return isLoggedIn ? (
    <Redirect href="/" />
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chào mừng bạn quay trở lại!</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>
          Điền thông tin của bạn bên dưới hoặc {"\n"} đăng nhập bằng tài khoản
          mạng xã hội
        </Text>
        <Text style={styles.label}>Email/ Số điện thoại</Text>
        <InputField
          placeholder="Email/ Số điện thoại"
          secureTextEntry={false}
          onChangeText={setEmail}
          value={email}
        />
        <Text style={styles.label}>Mật khẩu</Text>
        <InputField
          placeholder="Mật khẩu"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />

        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin()}
        >
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Hoặc đăng nhập với</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity>
            <FontAwesome6 name="facebook" size={24} color="#0866FF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome6 name="square-twitter" size={25} color="#1C96E8" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome6 name="google" size={24} color="#34A853" />
          </TouchableOpacity>
          {/* <TouchableOpacity>
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
          </TouchableOpacity> */}
          <TouchableOpacity>
            <FontAwesome6 name="apple" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.registerText}>
            {" "}
            Bạn chưa có tài khoản?{" "}
            <Text style={styles.registerLink}>Đăng ký</Text>
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
    // backgroundColor: "#E57373",
    height: "16%",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#FBEAEA",
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C44",
    marginTop: 20,
    marginBottom: 24,
  },
  subtitle: {
    textAlign: "center",
    color: "#C44",
    marginBottom: 32,
    fontWeight: "semibold",
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginVertical: 10,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMe: {
    marginLeft: 6,
    color: "#666",
  },
  forgotPassword: {
    color: "#E57373",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#E57373",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#666",
    marginVertical: 10,
    marginTop: "30%",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#E57373",
    fontWeight: "bold",
  },
});
