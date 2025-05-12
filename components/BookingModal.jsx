import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import PickerSelect from "./PickerSelect";
import { router } from "expo-router";
import { ApiClient } from "../config/api";

export default function BookingModal({
  visible,
  onClose,
  tutorName,
  tutorSubjects,
  tutor,
  upcomingClasses = [],
}) {
  const api = ApiClient(); // Khởi tạo ApiClient

  const [selectedSubject, setSelectedSubject] = useState(""); // State cho môn học
  const [selectedLevel, setSelectedLevel] = useState(""); // State cho cấp độ học
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const initialEndDate = new Date();
    initialEndDate.setDate(initialEndDate.getDate() + 30); // Mặc định là 30 ngày sau ngày hiện tại
    return initialEndDate;
  });

  // State hiển thị picker cho ngày bắt đầu/kết thúc
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // State lưu ngày bắt đầu và kết thúc đã chọn
  const [formattedStartDate, setFormattedStartDate] = useState(
    startDate.toLocaleDateString()
  );
  const [formattedEndDate, setFormattedEndDate] = useState(
    endDate.toLocaleDateString()
  );

  // State cho ghi chú
  const [note, setNote] = useState("");

  // State cho ngày học được chọn
  const [selectedDay, setSelectedDay] = useState("");

  // Lọc daysOfWeek dựa trên availableSchedule của tutor
  const [availableDays, setAvailableDays] = useState([]);

  // Helper function to parse dates in DD/MM/YYYY format
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;

    // Split the date string (DD/MM/YYYY) into components
    const parts = dateString.split("/");
    if (parts.length !== 3) return null;

    // Create date as YYYY-MM-DD (month is 0-indexed in JS Date)
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  useEffect(() => {
    if (tutor && tutor.availableSchedule) {
      // Lấy danh sách các ngày mà tutor có thể dạy
      const days = tutor.availableSchedule.map((schedule) => schedule.day);

      setAvailableDays(days);
    }
  }, [tutor]);

  // Khi ngày được chọn thay đổi, cập nhật lại danh sách timeSlots có sẵn
  useEffect(() => {
    if (selectedDay && tutor && tutor.availableSchedule) {
      const schedule = tutor.availableSchedule.find(
        (s) => s.day === selectedDay
      );

      if (schedule) {
        // Lọc ra các time slots đã được đặt trong upcomingClasses cho ngày đã chọn
        // Chỉ xét những lịch trùng về ngày trong tuần và khoảng thời gian
        const bookedTimeSlots = upcomingClasses
          .filter((cls) => {
            if (cls.day !== selectedDay) return false;

            // Kiểm tra xem lớp học có thời gian trùng với khoảng thời gian đang chọn không
            const classStart = new Date(cls.startDate);
            const classEnd = new Date(cls.endDate);

            // Nếu chưa chọn ngày bắt đầu/kết thúc, không cần lọc
            if (!formattedStartDate || !formattedEndDate) return true;

            // Parse formatted dates correctly
            const bookingStart = parseLocalDate(formattedStartDate);
            const bookingEnd = parseLocalDate(formattedEndDate);

            // Kiểm tra xem có sự chồng chéo về thời gian không
            // (start1 <= end2) && (end1 >= start2)

            if (!bookingStart || !bookingEnd) return false;
            return bookingStart <= classEnd && bookingEnd >= classStart;
          })
          .map((cls) => cls.timeSlot);

        // Chỉ hiển thị những time slots chưa được đặt
        const availableSlots = schedule.timeSlots.filter(
          (slot) => !bookedTimeSlots.includes(slot)
        );

        const timeSlots = availableSlots.map((slot, index) => ({
          key: `time-${index}`,
          label: getTimeSlotLabel(slot),
          value: slot,
        }));

        setAvailableTimeSlots([
          { key: "time-default", label: "Chọn ca", value: "" },
          ...timeSlots,
        ]);
      } else {
        setAvailableTimeSlots([
          { key: "time-default", label: "Chọn ca", value: "" },
        ]);
      }
    } else {
      setAvailableTimeSlots([
        { key: "time-default", label: "Chọn ca", value: "" },
      ]);
    }
    // Reset selected time slot when day changes
    setSelectedTimeSlot("");
  }, [
    selectedDay,
    tutor,
    upcomingClasses,
    formattedStartDate,
    formattedEndDate,
  ]);

  const getTimeSlotLabel = (timeSlot) => {
    const timeSlotMap = {
      "7:00-9:00": "Ca 1 (7:00 - 9:00)",
      "9:30-11:30": "Ca 2 (9:30 - 11:30)",
      "13:00-15:00": "Ca 3 (13:00 - 15:00)",
      "15:30-17:30": "Ca 4 (15:30 - 17:30)",
      "19:00-21:00": "Ca 5 (19:00 - 21:00)",
    };
    return timeSlotMap[timeSlot] || timeSlot;
  };

  const daysOfWeek = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
    { key: "Sunday", label: "CN" },
  ];

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

    if (setDateFunction === setStartDate) {
      setStartDate(newDate);
      setFormattedStartDate(newDate.toLocaleDateString());
    } else if (setDateFunction === setEndDate) {
      setEndDate(newDate);
      setFormattedEndDate(newDate.toLocaleDateString());
    }
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
    if (!selectedDay) return true; // If no day selected, all dates are valid
    return date.getDay() === getDayIndex(selectedDay);
  };

  // Kiểm tra xem ngày nào có slot trống trong khoảng thời gian đã chọn
  const checkAvailableDaysAndSlots = () => {
    if (!tutor || !tutor.availableSchedule) return [];

    const availableDaysWithSlots = tutor.availableSchedule.map((schedule) => {
      const day = schedule.day;

      // Lọc ra các lịch học trùng trong khoảng thời gian đã chọn
      const conflictingClasses = upcomingClasses.filter((cls) => {
        if (cls.day !== day) return false;

        // Nếu chưa chọn ngày bắt đầu/kết thúc, không tính là có xung đột
        if (!formattedStartDate || !formattedEndDate) return false;

        const classStart = new Date(cls.startDate);
        const classEnd = new Date(cls.endDate);

        // Parse formatted dates correctly
        const bookingStart = parseLocalDate(formattedStartDate);
        const bookingEnd = parseLocalDate(formattedEndDate);

        if (!bookingStart || !bookingEnd) return false;
        // Kiểm tra xem có sự chồng chéo về thời gian không
        return bookingStart <= classEnd && bookingEnd >= classStart;
      });

      // Lấy danh sách các slot đã đặt
      const bookedTimeSlots = conflictingClasses.map((cls) => cls.timeSlot);

      // Kiểm tra xem còn slot trống không
      const hasAvailableSlots = schedule.timeSlots.some(
        (slot) => !bookedTimeSlots.includes(slot)
      );

      return {
        day,
        hasAvailableSlots,
        availableSlots: schedule.timeSlots.filter(
          (slot) => !bookedTimeSlots.includes(slot)
        ),
      };
    });

    return availableDaysWithSlots;
  };

  const toggleDay = (dayKey) => {
    if (!availableDays.includes(dayKey)) {
      // If this day is not available for the tutor, don't allow selection
      return;
    }

    // Kiểm tra xem ngày này có ca học nào còn trống không dựa trên khoảng thời gian đã chọn
    const availableDaysInfo = checkAvailableDaysAndSlots();
    const dayInfo = availableDaysInfo.find((d) => d.day === dayKey);

    if (dayInfo && !dayInfo.hasAvailableSlots) {
      alert(
        "Tất cả các ca học vào ngày này đã được đặt trong khoảng thời gian bạn chọn"
      );
      return;
    }

    // Set the clicked day as the selected day or clear if already selected
    const newDay = selectedDay === dayKey ? "" : dayKey;
    setSelectedDay(newDay);

    // If a day is selected, adjust the start and end dates to match the selected day
    if (newDay) {
      adjustDateToMatchDay(startDate, newDay, setStartDate);
      adjustDateToMatchDay(endDate, newDay, setEndDate);
    }
  };

  // Xử lý chọn ngày bắt đầu
  const onChangeStartDate = (event, selectedDate) => {
    if (selectedDate) {
      // If a day is selected, ensure the date matches that day
      if (selectedDay) {
        const dayIndex = getDayIndex(selectedDay);
        if (selectedDate.getDay() !== dayIndex) {
          // Adjust to the next occurrence of the selected day
          adjustDateToMatchDay(selectedDate, selectedDay, setStartDate);
          return;
        }
      }

      setStartDate(selectedDate);
      setFormattedStartDate(selectedDate.toLocaleDateString());

      const minimumDate = new Date(selectedDate);
      minimumDate.setDate(minimumDate.getDate() + 7); // Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 7 ngày

      if (endDate < minimumDate) {
        // If we need to adjust end date, make sure it's also on the correct day
        if (selectedDay) {
          adjustDateToMatchDay(minimumDate, selectedDay, setEndDate);
        } else {
          setEndDate(minimumDate);
          setFormattedEndDate(minimumDate.toLocaleDateString());
        }
      }
    }
    setShowStartDatePicker(false);
  };

  // Xử lý chọn ngày kết thúc
  const onChangeEndDate = (event, selectedDate) => {
    if (selectedDate) {
      // If a day is selected, ensure the date matches that day
      if (selectedDay) {
        const dayIndex = getDayIndex(selectedDay);
        if (selectedDate.getDay() !== dayIndex) {
          // Adjust to the next occurrence of the selected day
          adjustDateToMatchDay(selectedDate, selectedDay, setEndDate);
          return;
        }
      }

      const minimumDate = new Date(startDate);
      minimumDate.setDate(minimumDate.getDate() + 7); // Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 7 ngày

      if (selectedDate < minimumDate) {
        alert("Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 7 ngày.");

        if (selectedDay) {
          // Find the next valid date for the selected day that's at least 7 days later
          adjustDateToMatchDay(minimumDate, selectedDay, setEndDate);
        } else {
          setEndDate(minimumDate);
          setFormattedEndDate(minimumDate.toLocaleDateString());
        }
      } else {
        setEndDate(selectedDate);
        setFormattedEndDate(selectedDate.toLocaleDateString());
      }
    }
    setShowEndDatePicker(false);
  };

  tutorSubjects = [{ name: "Chọn môn", grades: [] }, ...tutorSubjects];

  const handleClose = () => {
    setSelectedSubject("");
    setSelectedLevel("");
    setSelectedTimeSlot("");
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days later
    setFormattedStartDate(new Date().toLocaleDateString());
    setFormattedEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    );
    setNote("");
    setSelectedDay("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!selectedSubject || selectedSubject === "Chọn môn") {
        alert("Vui lòng chọn môn học");
        return;
      }

      if (!selectedLevel) {
        alert("Vui lòng chọn cấp độ học");
        return;
      }

      if (!selectedDay) {
        alert("Vui lòng chọn ngày học trong tuần");
        return;
      }

      if (!selectedTimeSlot) {
        alert("Vui lòng chọn khung giờ học");
        return;
      }

      // Convert dates to YYYY-MM-DD format for API
      const formatDateForAPI = (dateString) => {
        const parts = dateString.split("/");
        if (parts.length !== 3) return dateString;
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };

      const bookingInfo = {
        subject: selectedSubject,
        grade: selectedLevel,
        timeSlot: selectedTimeSlot,
        day: selectedDay,
        startDate: formatDateForAPI(formattedStartDate),
        endDate: formatDateForAPI(formattedEndDate),
        requirement: note,
      };

      const res = await api.post(
        `/api/tutors/${tutor.id}/bookings`,
        bookingInfo,
        {}
      );

      if (res.status === "success") {
        alert("Đặt lịch thành công!");
        handleClose(); // Đóng modal và reset form sau khi đặt lịch thành công
      } else {
        alert(
          "Đặt lịch thất bại: " + (res.data?.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi đặt lịch");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thông tin đặt lịch</Text>
            <Text style={styles.tutorInfo}>Gia sư: {tutorName}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.modalContent}>
              <View style={styles.rowContainer}>
                <PickerSelect
                  label="Môn học"
                  selectedValue={selectedSubject}
                  onValueChange={(value) => setSelectedSubject(value)}
                  items={tutorSubjects?.map((subject, index) => ({
                    key: `subject-${index}`,
                    label: subject.name,
                    value: subject.name,
                  }))}
                />
              </View>
              <View style={styles.rowContainer}>
                <PickerSelect
                  label="Cấp độ học"
                  selectedValue={selectedLevel}
                  onValueChange={(value) => setSelectedLevel(value)}
                  items={
                    selectedSubject
                      ? tutorSubjects
                          ?.find((subject) => subject.name === selectedSubject)
                          ?.grades?.map((grade, index) => {
                            return {
                              key: `grade-${index}-${grade}`,
                              label: "Lớp " + grade,
                              value: grade,
                            };
                          })
                      : [{ key: "default-grade", label: "Chọn lớp", value: "" }]
                  }
                />
              </View>

              <Text style={styles.label}>Ngày học trong tuần</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => {
                  // Kiểm tra xem ngày này có ca học nào còn trống không trong khoảng thời gian đã chọn
                  const availableDaysInfo = checkAvailableDaysAndSlots();
                  const dayInfo = availableDaysInfo.find(
                    (d) => d.day === day.key
                  );

                  // Một ngày chỉ có thể chọn nếu tutor có lịch dạy ngày đó VÀ còn ca trống trong khoảng thời gian
                  const isAvailable =
                    availableDays.includes(day.key) &&
                    (!dayInfo || dayInfo.hasAvailableSlots);

                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayButton,
                        !isAvailable && styles.dayButtonDisabled,
                        selectedDay === day.key && styles.dayButtonSelected,
                      ]}
                      onPress={() => toggleDay(day.key)}
                      disabled={!isAvailable}
                    >
                      <Text
                        style={[
                          styles.dayButtonText,
                          !isAvailable && styles.dayButtonTextDisabled,
                          selectedDay === day.key &&
                            styles.dayButtonTextSelected,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <PickerSelect
                label="Khung giờ học"
                selectedValue={selectedTimeSlot}
                onValueChange={(value) => setSelectedTimeSlot(value)}
                items={availableTimeSlots}
              />

              <Text style={styles.label}>Ngày bắt đầu</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {formattedStartDate || "Chọn ngày bắt đầu"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeStartDate}
                  minimumDate={new Date()}
                  filterDate={
                    Platform.OS === "ios" && selectedDay
                      ? filterAvailableDates
                      : undefined
                  }
                />
              )}

              <Text style={styles.label}>Ngày kết thúc</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {formattedEndDate || "Chọn ngày kết thúc"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeEndDate}
                  minimumDate={startDate}
                  filterDate={
                    Platform.OS === "ios" && selectedDay
                      ? filterAvailableDates
                      : undefined
                  }
                />
              )}

              <Text style={styles.label}>Ghi chú</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập ghi chú"
                value={note}
                onChangeText={(text) => setNote(text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
            >
              <Ionicons name="close" size={16} color="#fff" />
              <Text style={styles.modalButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    height: "80%",
  },
  modalHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E57373",
  },
  tutorInfo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalContent: {
    backgroundColor: "#eeeeee",
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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
  dayButtonDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
    opacity: 0.6,
  },
  dayButtonTextDisabled: {
    color: "#aaa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#81C784",
  },
  cancelButton: {
    backgroundColor: "#E57373",
  },
  modalButtonText: {
    marginLeft: 5,
    color: "#fff",
    fontWeight: "bold",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
  datePickerTextDisabled: {
    color: "#aaa",
  },
});
