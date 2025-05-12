import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSearchParams, useRouter } from "expo-router";

export default function PaymentScreen({ route, navigation }) {
  const params = useSearchParams(); // Lấy tham số từ router
  const router = useRouter();
  const { bookingInfo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận thanh toán</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Môn học:</Text>
        <Text style={styles.value}>{bookingInfo.selectedSubject}</Text>

        <Text style={styles.label}>Cấp độ học:</Text>
        <Text style={styles.value}>{bookingInfo.selectedLevel}</Text>

        <Text style={styles.label}>Ngày bắt đầu:</Text>
        <Text style={styles.value}>{bookingInfo.formattedStartDate}</Text>

        <Text style={styles.label}>Ngày kết thúc:</Text>
        <Text style={styles.value}>{bookingInfo.formattedEndDate}</Text>

        <Text style={styles.label}>Số ngày học:</Text>
        <Text style={styles.value}>
          {
            Object.values(bookingInfo.selectedDays).filter(
              (isSelected) => isSelected
            ).length
          }
        </Text>

        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.value}>{bookingInfo.totalPrice} VND</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          // Xử lý thanh toán tại đây
          console.log("Thanh toán thành công!");
          navigation.goBack(); // Quay lại màn trước sau khi thanh toán
        }}
      >
        <Text style={styles.confirmButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#E57373",
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#81C784",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
