import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TutorList from "../../components/TutorList";
import { router, Redirect } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { ApiClient } from "../../config/api";
import { convertImageToHttpUrl } from "../../utils/image";

const subjectColors = [
  "#E8EAF6", // (Tím nhạt)
  "#E8F5E9", // (Xanh lá nhạt)
  "#FFF3E0", // (Cam nhạt)
  "#FFCDD2", // (Đỏ nhạt)
  "#FCE4EC", // (Hồng nhạt)
  "#FFF8E1", // (Vàng nhạt)
  "#E3F2FD", // (Xanh dương nhạt)
  "#E0F2F1", // (Xanh ngọc nhạt)
  "#FBE9E7", // (Cam hồng nhạt)
  "#F8BBD0", // (Hồng đậm hơn chút)
];

export default function HomeScreen() {
  const { isLoggedIn } = useAuth();
  const api = ApiClient();
  const [followedTutors, setFollowedTutors] = useState([]);
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [newTutors, setNewTutors] = useState([]);

  // Helper function to format tutor data
  const formatTutorData = (tutors) => {
    return tutors.map((tutor) => ({
      id: tutor._id,
      name: tutor.userId.name,
      image: tutor.userId.avatar && convertImageToHttpUrl(tutor.userId.avatar),
      subjects: tutor.subjects,
      price: tutor.classPrice,
      rating: tutor.avgRating,
    }));
  };

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        // Fetch followed tutors
        const followedResponse = await api.get("/api/tutors", {
          followed: true,
        });
        setFollowedTutors(formatTutorData(followedResponse.data));

        // Fetch featured tutors
        const featuredResponse = await api.get("/api/tutors", {
          isFeatured: true,
        });
        setFeaturedTutors(formatTutorData(featuredResponse.data));

        // Fetch new tutors
        const newResponse = await api.get("/api/tutors", {
          isNew: true,
        });
        setNewTutors(formatTutorData(newResponse.data));

        console.log("Followed Tutors:", followedTutors);
        console.log("Featured Tutors:", featuredTutors);
        console.log("New Tutors:", newTutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutorData();
  }, []);

  return !isLoggedIn ? (
    <Redirect href={"/auth/login"} />
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Smart-Tutor</Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            onPress={() => router.push("/chat")}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E57373",
              width: 30,
              height: 30,
            }}
          >
            <Ionicons name="logo-ionitron" size={24} color="#E57373" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/notification")}
            style={{
              backgroundColor: "#fff",
              borderRadius: 200,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E57373",
              width: 30,
              height: 30,
            }}
          >
            <Ionicons name="notifications-outline" size={18} color="#E57373" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.containerContent}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Nhập để tìm kiếm"
            style={styles.searchInput}
            onPress={() => router.push("/search")}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subjectList}
        >
          {[
            "Toán",
            "Vật lý",
            "Hóa học",
            "Sinh học",
            "Tin học",
            "Ngữ văn",
            "Lịch sử",
            "Địa lí",
            "Tiếng Anh",
          ].map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.subjectItem,
                {
                  backgroundColor: subjectColors[index % subjectColors.length],
                },
              ]}
            >
              <Text style={styles.subjectText}>{subject}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đăng tìm gia sư</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/tutorRequestScreen")}
          >
            <Text style={styles.editButtonText}>Tạo bài đăng</Text>
          </TouchableOpacity>
        </View>

        <TutorList
          title="Gia sư đã theo dõi"
          tutors={followedTutors}
          layout="grid"
          backgroundColor="#FFF5F5"
          horizontal={true}
          limit={6}
          category={"Theo dõi"}
        />
        <TutorList
          title="Gia sư nổi bật"
          tutors={featuredTutors}
          layout="list"
          backgroundColor="#FADBD8"
          limit={4}
          category={"Nổi bật"}
        />
        <TutorList
          title="Gia sư mới"
          tutors={newTutors}
          layout="grid"
          backgroundColor="#FFF5F5"
          limit={9}
          category={"Mới"}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    // padding: 20,
  },
  header: {
    flexDirection: "row",
    // backgroundColor: "#FFF",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E57373",
  },
  containerContent: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 0,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
  },
  subjectList: {
    flexDirection: "row",
    marginBottom: 10,
  },
  subjectItem: {
    backgroundColor: "#FFD9D9",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  subjectText: {
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFC1C1",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E57373",
    marginBottom: 16,
  },

  editButton: {
    backgroundColor: "#E57373",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
