import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

/**
 * Component PickerSelect tái sử dụng cho các dropdown selector
 * @param {string} label - Nhãn hiển thị
 * @param {any} selectedValue - Giá trị đã chọn
 * @param {function} onValueChange - Hàm xử lý khi thay đổi giá trị
 * @param {Array} items - Mảng các options [{label, value}]
 * @param {Object} containerStyle - Style cho container
 * @param {number} height - Chiều cao của picker (mặc định 36)
 */
const PickerSelect = ({
  label,
  selectedValue,
  onValueChange,
  items,
  containerStyle = {},
  height = 32,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerContainer, { height }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "48%",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
});

export default PickerSelect;
