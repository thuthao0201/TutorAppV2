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

export default function PostedArticlesScreen() {
  const [articles, setArticles] = useState([]); // State to store articles
  const [selectedStatus, setSelectedStatus] = useState(
    "waiting_tutor_confirmation"
  ); // Changed default to waiting_tutor_confirmation
  const router = useRouter();
  const api = ApiClient(); // Initialize ApiClient

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

  const handleStatusChange = (status) => {
    setSelectedStatus(status); // Update selected status
  };

  const handleEdit = (item) => {
    router.push(`/tutorRequestScreen/${item._id}`);
  };

  const handleDelete = (item) => {
    console.log("Xóa bài đăng:", item._id);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/api/posts"); // Replace with your API endpoint
        console.log("Fetched articles:", response.data); // Log the fetched articles
        setArticles(response.data); // Update state with fetched articles
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles(); // Fetch articles on component mount
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => router.push(`/classes/${item.classId._id}`)}
    >
      <View style={styles.articleActions}>
        <Text style={styles.classTitle}>
          {item.subject} - Lớp {item.grade}
        </Text>
        {/* <Text style={styles.classDetail}>
          Học sinh: <Text style={styles.detail}>{item.studentId.name}</Text>
        </Text> */}
        <Text style={styles.classDetail}>
          Thời gian: <Text style={styles.detail}>{item.timeSlot}</Text>
        </Text>
        <Text style={styles.classDetail}>
          Ngày học:{" "}
          <Text style={styles.detail}>{convertDaysToVietnamese(item.day)}</Text>
        </Text>
        <Text style={styles.classDetail}>
          Từ:{" "}
          <Text style={styles.detail}>
            {new Date(item.startDate).toLocaleDateString()}
          </Text>{" "}
          đến:{" "}
          <Text style={styles.detail}>
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </Text>
        <Text style={styles.classDetail}>
          {/* Giá dự kiến:{" "} */}
          Giá:{" "}
          <Text style={styles.detail}>
            {item.expectedPrice.toLocaleString()} đ
          </Text>
        </Text>
        <Text style={styles.classDetail}>
          {/* Giá dự kiến:{" "} */}
          Gia sư:{" "}
          <Text style={styles.detail}>
            {item?.currentAssignedTutor?.userId?.name.toLocaleString()}
          </Text>
        </Text>
        <Text style={styles.classStatus}>
          Trạng thái:{" "}
          {item.status === "waiting_tutor_confirmation" ? (
            <Text style={styles.statusPending}>
              Đang chờ giảng viên chấp nhận
            </Text>
          ) : item.status === "matched" ? (
            <Text style={styles.statusMatched}>Đã ghép lớp</Text>
          ) : (
            <Text style={styles.statusCanceled}>Đã hủy</Text>
          )}
        </Text>
        <Text style={styles.classDetail}>
          Yêu cầu: <Text style={styles.detail}>{item.requirements}</Text>
        </Text>
      </View>
      <View style={styles.containerButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={16} color="#E57373" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle" size={28} color="#E57373" />
        </TouchableOpacity>
        <Text style={styles.title}>Danh sách bài đã đăng</Text>
        <TouchableOpacity onPress={() => router.push("/tutorRequestScreen")}>
          <Text style={{ color: "#E57373", fontWeight: "bold" }}>
            <Ionicons name="add-circle-sharp" size={32} color="#E57373" />{" "}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "waiting_tutor_confirmation" &&
              styles.selectedStatusButton,
          ]}
          onPress={() => handleStatusChange("waiting_tutor_confirmation")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "waiting_tutor_confirmation" &&
                styles.selectedStatusText,
            ]}
          >
            Chờ xác nhận
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "matched" && styles.selectedStatusButton,
          ]}
          onPress={() => handleStatusChange("matched")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "matched" && styles.selectedStatusText,
            ]}
          >
            Đã ghép
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusButton,
            selectedStatus === "canceled" && styles.selectedStatusButton,
          ]}
          onPress={() => handleStatusChange("canceled")}
        >
          <Text
            style={[
              styles.statusButtonText,
              selectedStatus === "canceled" && styles.selectedStatusText,
            ]}
          >
            Đã hủy
          </Text>
        </TouchableOpacity>
      </View>

      {articles.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={articles.filter((article) => article.status === selectedStatus)}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={{ padding: "16", fontSize: 16 }}>
          Không có bài đăng nào.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "#f0bfb6",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  statusButton: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedStatusButton: {
    backgroundColor: "#E57373",
  },
  statusButtonText: {
    color: "#333",
    padding: 4,
  },
  selectedStatusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  articleItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
  },
  articleActions: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  containerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 5,
    height: 30,
  },
  deleteButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 5,
    height: 30,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E57373",
  },
  classDetail: {
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  detail: {
    color: "#666",
    fontWeight: "light",
  },
  classStatus: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  statusPending: {
    color: "#d9802e",
  },
  statusMatched: {
    color: "#2AAF65",
  },
  statusCanceled: {
    color: "#E57373",
  },
});
