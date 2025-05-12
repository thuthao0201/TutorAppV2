import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ApiClient } from "../../../config/api";
import { Ionicons } from "@expo/vector-icons";

const daysOfWeek = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};

export default function ClassesScreen() {
  const api = ApiClient();
  const [classes, setClasses] = React.useState([]); // State để lưu danh sách lớp học

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/api/classes"); // Gọi API để lấy danh sách lớp học
        const classes = response.data;
        setClasses(classes); // Cập nhật state với danh sách lớp học
      } catch (error) {
        console.error("Error fetching classes:", error.message); // In lỗi nếu có
      }
    };
    fetchClasses(); // Gọi hàm fetchClasses khi component được mount
  }, []);

  // Format date string from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Check if the date is already in a different format
    if (dateString.includes("/")) return dateString;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid date

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original in case of error
    }
  };

  const renderClassItem = ({ item }) => (
    <ScrollView style={styles.classCard} key={item._id}>
      <TouchableOpacity onPress={() => router.push(`/classes/${item._id}`)}>
        <View style={styles.classInfo}>
          <Text style={styles.className}>
            {"Lớp " + item.subject + " " + item.grade}
          </Text>
          <Text style={styles.classTime}>Thời gian: {item.timeSlot}</Text>
          <Text style={styles.classDay}>
            {daysOfWeek[item.day]} - {formatDate(item.startDate)} đến{" "}
            {formatDate(item.endDate)}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách lớp học</Text>
      </View>
      <View style={styles.contentContainer}>
        {classes.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Ionicons name="folder-open-outline" size={40} color="#E57373" />
            <Text style={{ fontSize: 18, color: "#E57373" }}>
              Không có lớp học nào
            </Text>
          </View>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item._id}
            renderItem={renderClassItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#E57373",
    padding: 16,
    paddingTop: 32,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E57373",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E57373",
  },
  listContainer: {
    padding: 16,
  },
  classCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#BE5656",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },
  classInfo: {
    marginBottom: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E57373",
  },
  classCode: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  classTime: {
    fontSize: 14,
    color: "#666",
  },
  classDay: {
    fontSize: 14,
    color: "#666",
  },
  classFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classMode: {
    flexDirection: "row",
    alignItems: "center",
  },
  classModeText: {
    fontSize: 14,
    color: "#E57373",
    marginLeft: 4,
  },
  classPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
