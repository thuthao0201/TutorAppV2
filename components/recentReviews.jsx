import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ReviewSection = ({ avgRating, totalReviews, recentReviews }) => {
  const [expanded, setExpanded] = useState(false);

  const handleSeeMore = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ratingText}>
          <Text style={styles.boldText}>{avgRating.toFixed(1)}</Text>
          <Text>
            <FontAwesome name="star" size={20} color="#FFD700" />{" "}
          </Text>
          <Text style={styles.headerText}>
            Đánh giá gia sư ({totalReviews})
          </Text>
        </View>

        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMoreText}>
            {expanded ? "Ẩn bớt" : "Xem thêm >>"}
          </Text>
        </TouchableOpacity>
      </View>

      {recentReviews?.length > 0 ? (
        <View>
          {(expanded ? recentReviews : recentReviews.slice(0, 3)).map(
            (item) => (
              <View key={item._id} style={styles.reviewCard}>
                <Image
                  source={{
                    uri: item.avatar || "https://via.placeholder.com/50",
                  }}
                  style={styles.avatar}
                />

                <View style={styles.reviewContent}>
                  <Text style={styles.reviewerName}>{item.reviewerName}</Text>

                  <View style={styles.starRow}>
                    {[
                      ...Array(
                        Math.max(0, Math.min(5, Math.round(item.rating || 0)))
                      ),
                    ].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={12}
                        color="#FFD700"
                      />
                    ))}
                  </View>

                  <Text style={styles.reviewText}>{item.comment}</Text>
                </View>
              </View>
            )
          )}
        </View>
      ) : (
        <Text style={styles.reviewText}>Chưa có đánh giá nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFECEC",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  ratingText: {
    flexDirection: "row",
    fontSize: 16,
    color: "#D32F2F",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  seeMoreText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "bold",
  },
  reviewCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  starRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
});

export default ReviewSection;
