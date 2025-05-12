import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PickerSelect from "../components/PickerSelect";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { ApiClient } from "../config/api"; // Import ApiClient từ config/api

const TutorRequestScreen = () => {
  const [subject, setSubject] = useState("Toán"); // Giá trị mặc định là "Toán"
  const [grade, setGrade] = useState("1"); // Giá trị mặc định là "1"
  const [expectedPrice, setExpectedPrice] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const initialEndDate = new Date();
    initialEndDate.setDate(initialEndDate.getDate() + 30);
    return initialEndDate;
  });
  const [day, setDay] = useState(""); // Changed to store a single string value
  const [time, setTime] = useState("");
  const [requirements, setRequirements] = useState("");
  const [alternativeTimes, setAlternativeTimes] = useState([]); // State lưu thời gian thay thế

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const api = ApiClient(); // Khởi tạo ApiClient

  const router = useRouter();

  const gradeItems = Array.from({ length: 12 }, (_, i) => ({
    label: `Lớp ${i + 1}`,
    value: `${i + 1}`,
  }));

  const timeSlotItems = [
    { label: "Chọn ca", value: "" },
    { label: "Ca 1 (7:00 - 9:00)", value: "7:00-9:00" },
    { label: "Ca 2 (9:30 - 11:30)", value: "9:30-11:30" },
    { label: "Ca 3 (13:00 - 15:00)", value: "13:00-15:00" },
    { label: "Ca 4 (15:30 - 17:30)", value: "15:30-17:30" },
    { label: "Ca 5 (19:00 - 21:00)", value: "19:00-21:00" },
  ];

  const daysOfWeek = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
    { key: "Sunday", label: "CN" },
  ];

  const toggleDay = (dayKey) => {
    // Set the clicked day as the selected day or clear if already selected
    const newDay = day === dayKey ? "" : dayKey;
    setDay(newDay);

    // If a day is selected, adjust the start and end dates to match the selected day
    if (newDay) {
      adjustDateToMatchDay(startDate, newDay, setStartDate);
      adjustDateToMatchDay(endDate, newDay, setEndDate);
    }
  };

  // Helper function to adjust a date to the next occurrence of the specified day
  const adjustDateToMatchDay = (date, dayName, setDateFunction) => {
    const dayIndex = getDayIndex(dayName);
    const currentDate = new Date(date);
    const currentDayIndex = currentDate.getDay();

    // Calculate days to add to reach the target day
    let daysToAdd = (dayIndex - currentDayIndex + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7; // If it's the same day, go to next week

    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + daysToAdd);
    setDateFunction(newDate);
  };

  // Get day index (0 = Sunday, 1 = Monday, etc.) from day name
  const getDayIndex = (dayName) => {
    const daysMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return daysMap[dayName];
  };

  // Filter function to only allow dates that match the selected day
  const filterAvailableDates = (date) => {
    if (!day) return true; // If no day selected, all dates are valid
    return date.getDay() === getDayIndex(day);
  };

  const onChangeStartDate = (event, selectedDate) => {
    if (selectedDate) {
      // If a day is selected, ensure the date matches that day
      if (day) {
        const dayIndex = getDayIndex(day);
        if (selectedDate.getDay() !== dayIndex) {
          // Adjust to the next occurrence of the selected day
          adjustDateToMatchDay(selectedDate, day, setStartDate);
          return;
        }
      }

      setStartDate(selectedDate);
      const minimumDate = new Date(selectedDate);
      minimumDate.setDate(minimumDate.getDate() + 7);
      if (endDate < minimumDate) {
        // If we need to adjust end date, make sure it's also on the correct day
        if (day) {
          adjustDateToMatchDay(minimumDate, day, setEndDate);
        } else {
          setEndDate(minimumDate);
        }
      }
    }
    setShowStartDatePicker(false);
  };

  const onChangeEndDate = (event, selectedDate) => {
    if (selectedDate) {
      // If a day is selected, ensure the date matches that day
      if (day) {
        const dayIndex = getDayIndex(day);
        if (selectedDate.getDay() !== dayIndex) {
          // Adjust to the next occurrence of the selected day
          adjustDateToMatchDay(selectedDate, day, setEndDate);
          return;
        }
      }

      const minimumDate = new Date(startDate);
      minimumDate.setDate(minimumDate.getDate() + 7);

      if (selectedDate < minimumDate) {
        alert("Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 7 ngày.");
        if (day) {
          // Find the next valid date for the selected day that's at least 7 days later
          adjustDateToMatchDay(minimumDate, day, setEndDate);
        } else {
          setEndDate(minimumDate);
        }
      } else {
        setEndDate(selectedDate);
      }
    }
    setShowEndDatePicker(false);
  };

  const dayMapping = {
    Sunday: "Chủ nhật",
    Monday: "Thứ hai",
    Tuesday: "Thứ ba",
    Wednesday: "Thứ tư",
    Thursday: "Thứ năm",
    Friday: "Thứ sáu",
    Saturday: "Thứ bảy",
  };
  const convertDaysToVietnamese = (day) => {
    return dayMapping[day];
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/api/posts", {
        subject,
        grade,
        expectedPrice,
        startDate,
        endDate,
        day, // Now sending day as a single string
        timeSlot: time,
        requirements,
      });
      console.log("Response:", response);

      if (response && response.status === "fail") {
        if (response.data?.alternativeTimes) {
          console.log("Alternative times:", response.data.alternativeTimes);
          setAlternativeTimes(response.data.alternativeTimes); // Lưu thời gian thay thế
        }
        alert(response.message);
        return;
      }

      setSubject("");
      setGrade("");
      setExpectedPrice("");
      setStartDate(new Date());
      setEndDate(() => {
        const initialEndDate = new Date();
        initialEndDate.setDate(initialEndDate.getDate() + 30);
        return initialEndDate;
      });
      setDay(""); // Reset to empty string
      setTime("");
      setRequirements("");
      setAlternativeTimes([]); // Reset thời gian thay thế
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);

      alert("Đăng ký thành công!");
      router.replace("/postedArticles");
      return; // Chuyển hướng về trang danh sách lớp học
    } catch (error) {
      console.error("Error submitting form:", error);

      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#E57373" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>ĐĂNG KÝ HỌC</Text>
          <Text style={styles.subText}>
            Bạn có thể để lại thông tin và nội dung yêu cầu.{"\n"} Chúng tôi sẽ
            ghi danh và gửi thông báo cùng báo giá {"\n"} đến bạn trong thời
            gian sớm nhất.
          </Text>
        </View>
      </View>
      <ScrollView style={styles.containerContent}>
        <PickerSelect
          label="Môn học"
          selectedValue={subject}
          onValueChange={(value) => setSubject(value)}
          items={[
            { label: "Toán", value: "Toán" },
            { label: "Tiếng Anh", value: "Tiếng Anh" },
            { label: "Vật lý", value: "Vật lý" },
            { label: "Hóa học", value: "Hóa học" },
            { label: "Sinh học", value: "Sinh học" },
            { label: "Ngữ văn", value: "Ngữ văn" },
            { label: "Lịch sử", value: "Lịch sử" },
            { label: "Địa lý", value: "Địa lý" },
            { label: "Tin học", value: "Tin học" },
          ]}
        />
        <PickerSelect
          label="Cấp độ học"
          selectedValue={grade}
          onValueChange={(value) => setGrade(value)}
          items={gradeItems}
        />
        <Text style={styles.label}>Học phí dự kiến</Text>
        <TextInput
          style={styles.input}
          placeholder="Học phí dự kiến (VNĐ/Buổi)"
          value={expectedPrice}
          onChangeText={(text) => setExpectedPrice(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />
        <View style={styles.ContainerPickDay}>
          <Text style={styles.label}>Ngày học trong tuần</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((dayItem) => (
              <TouchableOpacity
                key={dayItem.key}
                style={[
                  styles.dayButton,
                  day === dayItem.key && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(dayItem.key)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    day === dayItem.key && styles.dayButtonTextSelected,
                  ]}
                >
                  {dayItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rowPickDay}>
            <Text style={styles.label}>Ngày bắt đầu:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {startDate.toLocaleDateString() || "Chọn ngày bắt đầu"}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeStartDate}
                minimumDate={new Date()}
                // Filter dates based on selected day
                filterDate={
                  Platform.OS === "ios" ? filterAvailableDates : undefined
                }
              />
            )}
          </View>
          <View style={styles.rowPickDay}>
            <Text style={styles.label}>Ngày kết thúc:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {endDate.toLocaleDateString() || "Chọn ngày kết thúc"}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeEndDate}
                minimumDate={startDate}
                // Filter dates based on selected day
                filterDate={
                  Platform.OS === "ios" ? filterAvailableDates : undefined
                }
              />
            )}
          </View>
        </View>

        <PickerSelect
          label="Khung giờ học"
          selectedValue={time}
          onValueChange={(value) => setTime(value)}
          items={timeSlotItems}
        />
        <Text style={styles.label}>Yêu cầu chi tiết</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập yêu cầu chi tiết"
          value={requirements}
          onChangeText={setRequirements}
          multiline={true}
          numberOfLines={4}
        />
        {alternativeTimes.length > 0 && (
          <View style={styles.alternativeTimesContainer}>
            <Text style={styles.alternativeTimesTitle}>
              Các thời gian thay thế:
            </Text>
            {alternativeTimes.map((alt, index) => (
              <View key={index} style={styles.alternativeTimeItem}>
                <Text style={styles.alternativeTimeText}>
                  Gia sư: {alt.tutorName}
                </Text>
                <Text style={styles.alternativeTimeText}>
                  Ca học: {alt.timeSlot}
                </Text>
                <Text style={styles.alternativeTimeText}>
                  Giá mỗi buổi: {alt.classPrice.toLocaleString()} VNĐ
                </Text>
                <Text style={styles.alternativeTimeText}>
                  Ngày học: {convertDaysToVietnamese(alt.day)}
                </Text>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Đăng bài</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFEBEE",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
    width: "100%",
    height: "15%",
    marginBottom: 16,
  },
  backButton: {
    paddingTop: 8,
    justifyContent: "flex-start",
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EA5A5A",
    textAlign: "center",
    paddingRight: 16,
  },
  subText: {
    fontSize: 16,
    color: "#EA5A5A",
    textAlign: "center",
    marginTop: 8,
    paddingRight: 16,
  },
  containerContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#E57373",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    color: "#666",
  },
  input: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E57373",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    marginLeft: 32,
    backgroundColor: "#fff",
  },
  ContainerPickDay: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 12,
  },
  rowPickDay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  datePickerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E57373",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    width: "50%",
  },
  datePickerText: {
    color: "#666",
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginVertical: 15,
  },
  dayButton: {
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    alignItems: "center",
    marginHorizontal: 1,
  },
  dayButtonText: {
    fontSize: 14,
    color: "#333",
  },
  dayButtonTextSelected: {
    color: "#E57373",
    fontWeight: "bold",
  },
  dayButtonSelected: {
    borderWidth: 1,
    borderColor: "#E57373",
  },
  submitButton: {
    backgroundColor: "#E57373",
    padding: 12,
    width: "50%",
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
    margin: 32,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  alternativeTimesContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  alternativeTimesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E57373",
  },
  alternativeTimeItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  alternativeTimeText: {
    fontSize: 14,
    color: "#333",
  },
});

export default TutorRequestScreen;
