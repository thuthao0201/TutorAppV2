import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ReviewSection from "../../../components/recentReviews";
import BookingModal from "../../../components/BookingModal";
import { ApiClient } from "../../../config/api";
import { convertImageToHttpUrl } from "../../../utils/image";
import { formatNumber } from "../../../utils/money";

const tutors = [
  {
    id: "1",
    name: "Nguyễn Thu Nga",
    price: "200.000 đ/h",
    subject: ["Toán", "Hóa học", "Vật lý"],
    avgRating: 4.8,
    image: require("../../../assets/images/natra.jpg"),
    introduce:
      "Chứng chỉ TOEIC L&R 800. Có 4 năm kinh nghiệm giảng dạy tiếng Anh cho lứa tuổi mầm non và thiếu nhi.",
    specialized: "Ngôn ngữ Anh",
    degree: "Đại học",
    field: "Hà Nội",
    hasCertificate: true,
    experience:
      "Có 4 năm kinh nghiệm giảng dạy TOEIC LR 800/900. Tốt nghiệp chuyên ngành Ngôn Ngữ Anh. Kinh nghiệm hơn 4 năm làm giáo viên và trợ giảng tiếng Anh. GPA tích lũy 3.55/4 điểm.",
    totalReviews: 150,
    recentReviews: [
      {
        _id: "3",
        reviewerName: "Trần Thị Mỹ Hạnh",
        rating: 5,
        comment:
          "Gia sư nhiệt tình tận tâm, kiến thức chuyên môn cao, rất hài lòng",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        _id: "4",
        reviewerName: "Nguyễn Văn Nam",
        rating: 4,
        comment: "Giảng dạy dễ hiểu, có tâm với học viên.",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
    ],
  },
  {
    id: "2",
    name: "Trần Minh Tú",
    price: "180.000 đ/h",
    avgRating: 4.6,
    image: require("../../../assets/images/natra.jpg"),
    introduce:
      "Giảng viên tiếng Anh với 6 năm kinh nghiệm, chuyên luyện thi IELTS và TOEFL.",
    specialized: "Ngôn ngữ Anh",
    degree: "Thạc sĩ",
    field: "TP. Hồ Chí Minh",
    hasCertificate: true,
    experience:
      "Tốt nghiệp bậc Cử nhân khoa ngoại ngữ - Anh Văn 2015 bậc chính qui tại Trường Đại học Cần Thơ.Ngay khi còn là học sinh cấp 3 từ lop 11 mình đã đứng lớp dạy kèm tiếng Anh và các môn toán hoá Lí khác để giúp mẹ bớt gánh nặng.. lên đại học liên ngày học tối dạy kèm các em dưới Cần Thơ rất yêu mến vì các em có tiến bộ nhanh chóng sau khi gặp được mình dạy kèm Tiếng Anh. Ôn lại kiến thức và dạy các bạn giao tiếp trực tiếp. Suốt 2016-2021 và đến nay mình làm cho người nước ngoài nên tiếng anh là một thế mạnh giao tiếp.",
    totalReviews: 230,
    recentReviews: [
      {
        _id: "5",
        reviewerName: "Nguyễn Văn Nam",
        rating: 4,
        comment: "Giảng dạy dễ hiểu, có tâm với học viên.",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        _id: "6",
        reviewerName: "Lê Thảo My",
        rating: 5,
        comment: "Kiến thức vững, hướng dẫn tận tình.",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        _id: "7",
        reviewerName: "Bùi Minh Khôi",
        rating: 4,
        comment: "Lịch học linh hoạt, phương pháp giảng dạy tốt.",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ],
  },
];

export default function TutorDetail() {
  const { id } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [tutor, setTutor] = React.useState(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const api = ApiClient(); // Khởi tạo API client

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await api.get(`/api/tutors/${id}`); // Gọi API để lấy thông tin gia sư
        const tutorData = response.data;
        console.log("tutorData", tutorData); // In dữ liệu nhận được từ API

        const tutor = {
          id: tutorData._id,
          name: tutorData.userId?.name,
          image: convertImageToHttpUrl(tutorData?.userId?.avatar),
          subjects: tutorData.subjects,
          price: tutorData.classPrice,
          avgRating: tutorData.avgRating,
          introduce: tutorData.introduce,
          specialized: tutorData.specialized,
          degree: tutorData.degree,
          hasCertificate: tutorData.hasCertificate,
          experience: tutorData.experiences,
          totalReviews: tutorData.totalReviews,
          recentReviews: tutorData.recentReviews.map((review) => ({
            _id: review._id,
            reviewerName: review.name,
            rating: review.rating,
            comment: review.content,
            avatar: convertImageToHttpUrl(review.avatar),
          })),
          availableSchedule: tutorData.availableSchedule,
          upcomingClasses: tutorData.upcomingClasses || [],
          isFollowed: tutorData.isFollowed || false, // Lấy trạng thái theo dõi từ dữ liệu API
        };
        setTutor(tutor);
        setIsFollowing(tutorData.isFollowed || false); // Cập nhật state isFollowing
      } catch (error) {
        console.error("Lỗi khi lấy thông tin gia sư:", error);
      }
    };
    fetchTutor();
  }, [id]);

  // Hàm định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Mapping ngày trong tuần sang tiếng Việt
  const dayMapping = {
    Sunday: "Chủ nhật",
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
  };

  if (!tutor) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy gia sư!</Text>
      </View>
    );
  }

  const handleFollow = async (tutorId) => {
    try {
      // Endpoint for favorite/unfavorite
      const endpoint = `/api/tutors/${tutorId}/favorite`;
      let response;

      if (isFollowing) {
        // If already following, make a DELETE request to unfollow
        response = await api.del(endpoint);
      } else {
        // If not following, make a POST request to follow
        response = await api.post(endpoint);
      }

      if (response.status === "success") {
        // Cập nhật state nếu API call thành công
        setIsFollowing(!isFollowing);

        // Cập nhật trạng thái trong tutor object
        setTutor((prev) => ({
          ...prev,
          isFollowed: !isFollowing,
        }));

        // Thông báo thành công
        alert(isFollowing ? "Đã bỏ theo dõi gia sư" : "Đã theo dõi gia sư");
      } else {
        // Xử lý khi có lỗi từ API
        alert(response.data.message || "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.error("Lỗi khi theo dõi/bỏ theo dõi gia sư:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={
            tutor?.image
              ? { uri: tutor?.image }
              : require("../../../assets/images/splash-amongus.jpg")
          }
          style={[styles.avatar]}
        />
        <Text style={styles.name}>{tutor.name}</Text>
        <Text style={styles.price}>{formatNumber(tutor.price)} đ</Text>
        <Text style={styles.rating}>
          {tutor.avgRating === 0
            ? "Chưa có đánh giá"
            : `⭐ ${tutor.avgRating.toFixed(1)} / 5`}
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.contactButton]}>
          <Ionicons name="chatbubble-outline" size={16} color="#fff" />
          <Text style={styles.buttonText}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.scheduleButton]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="calendar-outline" size={16} color="#fff" />
          <Text style={styles.buttonText}>Đặt lịch</Text>
        </TouchableOpacity>

        <BookingModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onReset={() => {
            setModalVisible(false);
          }}
          tutorName={tutor.name}
          tutorSubjects={tutor.subjects}
          tutor={tutor}
          upcomingClasses={tutor.upcomingClasses || []}
        />

        <TouchableOpacity
          style={[
            styles.button,
            isFollowing ? styles.followingButton : styles.followButton,
          ]}
          onPress={() => handleFollow(tutor.id)}
        >
          <Ionicons
            name={isFollowing ? "heart" : "heart-outline"}
            size={16}
            color="#fff"
          />
          <Text style={styles.buttonText}>
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.text}>{tutor.introduce}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Chuyên ngành</Text>
        <Text style={styles.text}>{tutor.specialized}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Trình độ</Text>
        <Text style={styles.text}>{tutor.degree}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Chứng chỉ</Text>
        <Text style={styles.text}>
          {tutor.hasCertificate ? "Đã cung cấp" : "Chưa cung cấp"}
        </Text>
      </View>
      <View style={styles.subjectinfo}>
        {tutor?.subjects &&
          tutor?.subjects?.length > 0 &&
          tutor?.subjects?.map((subject, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.sectionTitle}>{subject.name}</Text>
              {subject.grades && subject.grades.length > 0 ? (
                <Text style={styles.text}>
                  {subject.grades.map((grade) => "Lớp " + grade).join(", ")}
                </Text>
              ) : (
                <Text style={styles.text}>Chưa có thông tin</Text>
              )}
            </View>
          ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kinh nghiệm và thành tích</Text>
        <Text style={styles.text}>{tutor.experience}</Text>
      </View>

      {tutor.upcomingClasses && tutor.upcomingClasses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch dạy sắp tới</Text>
          {tutor.upcomingClasses.map((classItem, index) => (
            <View key={index} style={styles.classItem}>
              <View style={styles.classHeader}>
                <Text style={styles.classSubject}>
                  {classItem.subject} - Lớp {classItem.grade}
                </Text>
              </View>

              <View style={styles.classDetail}>
                <View style={styles.classDetailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.classDetailText}>
                    {dayMapping[classItem.day]} ({classItem.timeSlot})
                  </Text>
                </View>

                <View style={styles.classDetailItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.classDetailText}>
                    Từ {formatDate(classItem.startDate)} đến{" "}
                    {formatDate(classItem.endDate)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <ReviewSection
        avgRating={tutor.avgRating}
        totalReviews={tutor.totalReviews}
        recentReviews={tutor.recentReviews}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  profile: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: "#E57373",
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  contactButton: {
    backgroundColor: "#64B5F6",
  },
  scheduleButton: {
    backgroundColor: "#81C784",
  },
  followButton: {
    backgroundColor: "#E57373",
  },
  followingButton: {
    backgroundColor: "#FF8A80",
  },
  section: {
    margin: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    flex: 1,
  },
  row: {
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  subjectinfo: {
    marginVertical: 8,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    flex: 2,
    textAlign: "justify",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  classItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#81C784",
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  classStatus: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  classDetail: {
    marginTop: 8,
  },
  classDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  classDetailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
});
