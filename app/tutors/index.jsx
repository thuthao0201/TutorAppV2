import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TutorCard from "../../components/TutorCard";
import FilterModal from "../../components/FilterModal";
import { ApiClient } from "../../config/api";
import { convertImageToHttpUrl } from "../../utils/image";
import { useSearchParams } from "expo-router/build/hooks";
import { use } from "react";

const categories = ["Nổi bật", "Theo dõi", "Mới"];

export default function TutorList() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [category] = useSearchParams(); // Lấy category từ params
  const [selectedCategory, setSelectedCategory] = useState(
    category || "Nổi bật"
  );
  const [filters, setFilters] = useState({ subject: null, rating: null });
  const [tutors, setTutors] = useState([]); // State để lưu danh sách gia sư
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [tutorsToDisplay, setTutorsToDisplay] = useState([]);
  const api = ApiClient(); // Khởi tạo ApiClient

  // Hàm gọi API để lấy danh sách gia sư
  const fetchTutors = async (query = {}) => {
    try {
      const response = await api.get("/api/tutors", { ...query });
      setTutors(response.data); // Cập nhật state với dữ liệu gia sư

      // Lọc gia sư theo bộ lọc
      const filtered = response.data.filter((tutor) => {
        if (
          filters.rating &&
          (!tutor.rating || tutor.rating < filters.rating)
        ) {
          return false;
        }
        if (filters.subject && tutor.subject !== filters.subject) {
          return false;
        }
        return true;
      });
      setFilteredTutors(filtered);

      console.log("Filtered tutors:", filtered); // In ra danh sách gia sư đã lọc

      // Chuyển đổi dữ liệu gia sư để hiển thị
      const displayData = filtered.map((tutor) => ({
        id: tutor._id,
        name: tutor.userId.name,
        image:
          tutor.userId.avatar && convertImageToHttpUrl(tutor.userId.avatar),
        subjects: tutor.subjects,
        price: tutor.classPrice,
        rating: tutor.avgRating,
        isFollowed: tutor.isFollowed,
      }));

      setTutorsToDisplay(displayData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách gia sư:", error); // In ra lỗi nếu có
    }
  };

  // useEffect(() => {
  //   if (category) {
  //     setSelectedCategory(category); // Nếu có category từ params, cập nhật selectedCategory
  //   }
  // }, [category]);
  useEffect(() => {
    if (category) {
      const categoryValue = Array.isArray(category) ? category[1] : category; // Lấy giá trị chuỗi từ mảng hoặc đối tượng
      setSelectedCategory(categoryValue); // Cập nhật selectedCategory
    }
    let query = {};
    if (selectedCategory === "Nổi bật") {
      query.isFeatured = true; // Lấy gia sư nổi bật
    } else if (selectedCategory === "Theo dõi") {
      query.followed = true; // Lấy gia sư đã theo dõi
    } else if (selectedCategory === "Mới") {
      query.isNew = true; // Lấy gia sư mới
    }
    if (filters.subject) {
      query.subject = filters.subject; // Thêm bộ lọc subject vào query
    }

    fetchTutors(query);
  }, []);
  // console.log("category from url:", category);

  // Gọi API khi `selectedCategory` hoặc `filters` thay đổi
  useEffect(() => {
    if (!selectedCategory) return; // Nếu không có selectedCategory, không làm gì cả
    let query = {};
    if (selectedCategory === "Nổi bật") {
      query.isFeatured = true; // Lấy gia sư nổi bật
    } else if (selectedCategory === "Theo dõi") {
      query.followed = true; // Lấy gia sư đã theo dõi
    } else if (selectedCategory === "Mới") {
      query.isNew = true; // Lấy gia sư mới
    }
    if (filters.subject) {
      query.subject = filters.subject; // Thêm bộ lọc subject vào query
    }

    fetchTutors(query); // Gọi API với query tương ứng
  }, [selectedCategory, filters]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gia sư</Text>
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={styles.filterButton}
        >
          <Ionicons name="filter-outline" size={24} color="#E57373" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tutorsToDisplay}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => <TutorCard tutor={item} layout="grid" />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có giảng viên nào phù hợp</Text>
        }
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilter={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    margin: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    marginLeft: 16,
    justifyContent: "flex-start",
    marginBottom: 10,
    // backgroundColor: "#000",
  },
  categoryButton: {
    width: 80,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FCE4EC",
  },
  categoryButtonActive: {
    backgroundColor: "#E57373",
  },
  categoryText: {
    color: "#E57373",
    fontWeight: "bold",
    textAlign: "center",
  },
  categoryTextActive: {
    color: "white",
  },
  list: {
    alignItems: "left",
    padding: 8,
    marginHorizontal: 8,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
