import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { router } from "expo-router";

export default function TutorCard({ tutor, layout }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        layout === "grid" ? styles.gridCard : styles.listCard,
      ]}
      onPress={() => {
        router.navigate("/tutors/" + tutor?.id);
      }}
    >
      <Image
        //nếu có ảnh từ url thì dùng uri còn không thì dùng một ảnh mặc định
        source={
          tutor?.image
            ? { uri: tutor?.image }
            : require("../assets/images/default-avatar.png")
        }
        style={[
          styles.image,
          layout === "grid" ? styles.gridImage : styles.listImage,
        ]}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{tutor.name}</Text>
        {/* {tutor?.subjects?.length > 0 &&
          tutor.subjects.map((subject) => (
            <Text key={subject._id} style={styles.subject}>
              {subject.subject}
            </Text>
          ))} */}
        {/* <Text style={styles.subject}>{tutor.subject[0].subject}</Text> */}
        <Text style={styles.subject} numberOfLines={1}>
          {tutor.subjects.map((subject) => subject.name).join(", ")}
        </Text>
        <Text style={styles.price}>{tutor.price} đ</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="heart-circle" size={24} color="#E57373" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridCard: {
    width: width * 0.27,
    flexDirection: "column",
  },
  listCard: {
    marginHorizontal: 10,
    width: "95%",
    // căn giữa
    alignSelf: "center",
  },
  image: {
    borderRadius: 8,
  },
  gridImage: {
    width: "100%",
    height: height * 0.1,
  },
  listImage: {
    width: 50,
    height: 50,
  },
  info: {
    flex: 1,
    marginLeft: 4,
    width: "100%",
  },
  name: {
    fontWeight: "bold",
  },

  subject: {
    color: "#2AAF65",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    // giới hạn nội dung chỉ hiển thị trên một dòng, nếu hết không gian thì thay thế bằng dấu ba chấm
  },
  price: {
    color: "#E57373",
  },
  addButton: {
    alignItems: "center",
  },
});
