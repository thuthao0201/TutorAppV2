import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ApiClient } from "../config/api";
import TutorCard from "../components/TutorCard";
import { convertImageToHttpUrl } from "../utils/image";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [tutors, setTutors] = useState([]);

  const api = ApiClient();

  // Search tutors by name or subject
  const handleSearch = async () => {
    try {
      const response = await api.get("/api/tutors", {
        search: searchText,
        // subject: searchText,
      });
      console.log("Hello", response.data);

      const tutors = response.data.map((tutor) => ({
        id: tutor._id,
        name: tutor.userId.name,
        image:
          tutor.userId.avatar && convertImageToHttpUrl(tutor.userId.avatar),
        subjects: tutor.subjects,
        price: tutor.classPrice,
        rating: tutor.avgRating,
      }));
      setTutors(tutors);
      setSearchText(""); // Clear search text after search
    } catch (error) {
      console.error("Error searching tutors:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Tìm kiếm theo tên hoặc môn học"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      <View>
        <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
        <FlatList
          data={tutors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TutorCard tutor={item} layout="list" />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy kết quả phù hợp</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
