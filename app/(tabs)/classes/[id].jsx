import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useSegments } from "expo-router";
import { ApiClient } from "../../../config/api";
import { convertImageToHttpUrl } from "../../../utils/image"; // Import hàm convertImageToHttpUrl từ utils
import { formatNumber } from "../../../utils/money"; // Import hàm formatNumber từ utils

export default function ClassDetailScreen() {
  const api = ApiClient(); // Khởi tạo ApiClient
  const id = useLocalSearchParams().id; // Lấy id lớp học từ params
  const [classData, setClassData] = useState(null); // State để lưu thông tin lớp học

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        // Gọi API để lấy thông tin lớp học
        const response = await api.get(`/api/classes/${id}`); // Gọi API để lấy thông tin lớp học

        // console.log(response.data); // In ra dữ liệu lớp học để kiểm tra
        setClassData(response.data); // Cập nhật state với dữ liệu lớp học
      } catch (error) {
        console.error("Lỗi khi lấy thông tin lớp học:", error); // In ra lỗi nếu có
      }
    };
    fetchClassDetail(); // Gọi hàm fetchClassDetail khi component được mount
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // router.back();
            router.push("/classes");
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#E57373"
            paddingHorizontal="12"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lớp học</Text>
      </View>
      <View style={styles.infoContainer}>
        {classData?.tutorId?.userId?.avatar ? (
          <Image
            source={{
              uri: convertImageToHttpUrl(classData?.tutorId?.userId?.avatar),
            }}
            style={styles.avatar}
          />
        ) : (
          <Image
            //nếu có ảnh từ url thì dùng uri còn không thì dùng một ảnh mặc định
            source={require("../../../assets/images/default-avatar.png")}
            style={[styles.avatar]}
          />
        )}

        <Text style={styles.tutorName}>
          Gia sư : {classData?.tutorId?.userId?.name}
        </Text>
        <Text style={styles.subject}>
          Lớp học: {classData?.subject} {classData?.grade}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />

          <View style={styles.detailText}>
            <Text style={styles.detailValue}>
              {new Date(classData?.startDate).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              {" - "}
              {new Date(classData?.endDate).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Text>
            <Text style={styles.detailLabel}>Ngày</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={24} color="#fff" />
          <View style={styles.detailText}>
            <Text style={styles.detailValue}>{classData?.timeSlot}</Text>
            <Text style={styles.detailLabel}>Thời gian</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="hourglass-outline" size={24} color="#fff" />
          <View style={styles.detailText}>
            <Text style={styles.detailValue}>{classData?.duration} phút</Text>
            <Text style={styles.detailLabel}>Khoảng thời gian</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={24} color="#fff" />
          <View style={styles.detailText}>
            <Text style={styles.detailValue}>
              {formatNumber(classData?.tutorId?.classPrice)} đ
            </Text>
            <Text style={styles.detailLabel}>Giá</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Vào lớp học {" >>"} </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E57373",
    marginLeft: 8,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 12,
  },
  tutorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#E57373",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
  },
  detailsContainer: {
    backgroundColor: "#E57373",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailText: {
    marginLeft: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  detailLabel: {
    fontSize: 14,
    color: "#fff",
  },
  button: {
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
    // justifyContent: "center",
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
});
