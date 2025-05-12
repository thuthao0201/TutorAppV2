import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ApiClient } from "../config/api";

export default function TutorBookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = ApiClient(); // Khởi tạo ApiClient

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/api/bookings"); // Gọi API để lấy danh sách đơn thuê gia sư
        console.log("data", response.data);

        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn thuê gia sư:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const dayMapping = {
    Sunday: "Chủ nhật",
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
  };
  const convertDaysToVietnamese = (day) => {
    return dayMapping[day];
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={() => router.push(`/classes/${item.classId}`)}
    >
      <Text style={styles.subject}>
        {item.subject} - Lớp {item.grade}
      </Text>
      <Text style={styles.detail}>
        Gia sư: {item.tutorId?.userId?.name || "Chưa có"}
      </Text>
      <Text style={styles.detail}>
        Thời gian: {item.timeSlot} - {convertDaysToVietnamese(item.day)}
      </Text>
      <Text style={styles.detail}>
        Từ: {new Date(item.startDate).toLocaleDateString()} đến{" "}
        {new Date(item.endDate).toLocaleDateString()}
      </Text>
      <Text style={styles.status}>
        Trạng thái:{" "}
        {item.status === "pending"
          ? "Đang chờ"
          : item.status === "submitted"
          ? "Đã gửi"
          : "Đã hủy"}
      </Text>
      {item.status === "canceled" && (
        <Text style={styles.canceledReason}>
          Lý do hủy: {item.cancelReason || "Không có"}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={28} color="#E57373" />
        </TouchableOpacity>
        <Text style={styles.title}>Danh sách đơn thuê gia sư</Text>
      </View>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text>Không có đơn thuê gia sư nào.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  bookingItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E57373",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  canceledReason: {
    fontSize: 14,
    color: "#E57373",
    marginTop: 4,
  },
});
