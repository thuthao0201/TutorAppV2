import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import TutorCard from "./TutorCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function TutorList({
  title,
  tutors,
  layout,
  backgroundColor,
  horizontal = false,
  limit,
  category,
}) {
  const [showAll, setShowAll] = useState(false);

  const displayedTutors = showAll ? tutors : tutors.slice(0, limit);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            router.push(`/tutors?category=${category}`);
            console.log("category from url:", category);
          }}
          style={styles.seeMoreContainer}
        >
          <Text style={styles.seeMore}>Xem thêm</Text>
          <Ionicons name="chevron-forward" size={14} color="gray" />
        </TouchableOpacity>
      </View>

      {tutors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có giảng viên nào phù hợp</Text>
        </View>
      ) : (
        <FlatList
          data={displayedTutors}
          renderItem={({ item }) => <TutorCard tutor={item} layout={layout} />}
          keyExtractor={(item) => item.id}
          numColumns={horizontal ? 1 : layout === "grid" ? 3 : 1}
          horizontal={horizontal}
          scrollEnabled={horizontal}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            layout === "grid" ? styles.gridContainer : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  row: {
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMore: {
    color: "gray",
    fontSize: 14,
    marginRight: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  gridContainer: {
    justifyContent: "space-between",
  },
});
