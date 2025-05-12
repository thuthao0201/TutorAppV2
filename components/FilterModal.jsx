import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const [selectedSubject, setSelectedSubject] = useState("null");
  const [selectedRating, setSelectedRating] = useState("null");

  const subjects = [
    "Toán",
    "Ngữ văn",
    "Tiếng anh",
    "Vật Lý",
    "Hóa học",
    "Sinh học",
    "Lịch sử",
    "Địa lí",
    "Tin học",
  ];
  const ratings = [
    "Trên 4.5 sao",
    "Trên 4.0 sao",
    "Trên 3.5 sao",
    "Trên 3.0 sao",
  ];
  const handleApply = () => {
    // gọi hàm onApplyFilter với các giá trị đã chọn, có thể chọn 1 trong 2 hoặc cả 2
    onApplyFilter({
      subject: selectedSubject !== "null" ? selectedSubject : null,
      rating: selectedRating !== "null" ? selectedRating : null,
    });
    // onApplyFilter({ subject: selectedSubject, rating: selectedRating });
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.sectionTitle}>Môn học ▼</Text>
            {subjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => setSelectedSubject(subject)}
              >
                <View style={styles.radioCircle}>
                  {selectedSubject === subject && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.optionText}>{subject}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Đánh giá ▼</Text>
            {ratings.map((rating, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => setSelectedRating(rating)}
              >
                <View style={styles.radioCircle}>
                  {selectedRating === rating && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.optionText}>{rating}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.buttonframe}>
              <TouchableOpacity style={styles.button} onPress={handleApply}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>đóng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 280,
    backgroundColor: "#FDECEC",
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E57373",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#E57373",
  },
  optionText: {
    fontSize: 14,
    color: "#8B0000",
  },
  buttonframe: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#E57373",
    paddingVertical: 8,
    borderRadius: 5,
    // marginTop: 15,
    width: "40%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
