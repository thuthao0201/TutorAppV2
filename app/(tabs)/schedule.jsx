import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { ApiClient } from "../../config/api";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function ScheduleScreen() {
  const api = ApiClient(); // Khởi tạo ApiClient
  const [scheduleData, setScheduleData] = useState([]); // State để lưu lịch học
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const generateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];

    // Use <= instead of < to include the end date
    while (start <= end) {
      dateArray.push(new Date(start).toISOString().split("T")[0]); // Thêm ngày vào mảng
      start.setDate(start.getDate() + 1); // Tăng ngày lên 1
    }

    return dateArray;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get("/api/classes");

        // console.log("In ra dữ liệu lịch học: ", response.data); // In ra dữ liệu lịch học để kiểm tra

        const daysOfWeek = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        const schedule = response.data.reduce((acc, session) => {
          // Ensure we handle dates properly - create full date objects
          const startDate = new Date(session.startDate);
          const endDate = new Date(session.endDate);

          // Make sure endDate includes the full day by setting it to 23:59:59
          endDate.setHours(23, 59, 59, 999);

          // Xử lý trường hợp session.day là một chuỗi đơn (không phải mảng)
          const sessionDay = Array.isArray(session.day)
            ? session.day.map((d) => daysOfWeek[d])
            : [daysOfWeek[session.day]];

          // Tạo tất cả các ngày từ startDate đến endDate
          const allDates = generateDateRange(
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
          );

          // Lọc ra những ngày khớp với day của session
          allDates.forEach((date) => {
            const dayOfWeek = new Date(date).getDay();
            if (sessionDay.includes(dayOfWeek)) {
              if (!acc[date]) {
                acc[date] = [];
              }

              // Dựng thông tin buổi học
              acc[date].push({
                id: session._id,
                time: session.timeSlot || session.time, // Xử lý cả 2 trường hợp tên trường
                tutor: session.tutorId?.userId?.name || "Không xác định",
                subject: session.subject,
                grade: session.grade,
                duration: session.duration,
                status: session.status,
                tutorImage: session.tutorId?.userId?.avatar,
              });
            }
          });

          return acc;
        }, {});

        setScheduleData(schedule);

        // Find the closest date with a class - either today if it has classes or the next available date
        const today = getTodayDate();
        const futureDates = Object.keys(schedule)
          .filter((date) => date >= today)
          .sort();

        if (futureDates.length > 0) {
          // Set selected date to the closest future date with a class
          const closestDate = futureDates[0];
          setSelectedDate(closestDate);

          // Wait for state update to complete then scroll calendar to that date
          setTimeout(() => {
            // If using a calendar ref, you could scroll to that date
            // For React Native Calendars, setting initialDate should be enough
            // But this ensures the UI updates to show the selected date
            console.log("Setting selected date to:", closestDate);
          }, 100);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch học:", error);
      }
    };

    fetchSchedule();
  }, []);

  // Create a formatted representation of the selected date for display
  const formatSelectedDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Thời gian biểu</Text>

      <Calendar
        // Set current date to the selected date to scroll to it
        current={selectedDate}
        // Set initial date to selected date to ensure it's visible when component mounts
        initialDate={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...Object.keys(scheduleData).reduce((marked, date) => {
            // Mark all dates with schedule data
            marked[date] = { marked: true, dotColor: "#E57373" };
            return marked;
          }, {}),
          // Always apply selected styling to the currently selected date
          [selectedDate]: {
            selected: true,
            selectedColor: "#D32F2F",
            // If this date also has schedule data, keep the dot
            ...(scheduleData[selectedDate]
              ? { marked: true, dotColor: "#FFFFFF" }
              : {}),
          },
          // Special styling for today if it's not the selected date
          ...(getTodayDate() !== selectedDate
            ? {
                [getTodayDate()]: {
                  ...(scheduleData[getTodayDate()]
                    ? { marked: true, dotColor: "#E57373" }
                    : {}),
                  dotColor: "#f0c0c0",
                },
              }
            : {}),
        }}
        theme={{
          todayTextColor: "#D32F2F",
          arrowColor: "#D32F2F",
          selectedDayBackgroundColor: "#D32F2F",
          selectedDayTextColor: "#FFFFFF",
          // Ensure text for today is visible even when it's not selected
          todayBackgroundColor: "#FFEBEE",
        }}
      />

      <Text style={styles.dateText}>
        Lịch học ngày {formatSelectedDate(selectedDate)}
      </Text>

      {scheduleData[selectedDate] && scheduleData[selectedDate].length > 0 ? (
        scheduleData[selectedDate].map((item, index) => (
          <TouchableOpacity
            key={item.id || index}
            onPress={() => router.push(`/classes/${item.id}`)}
          >
            <View style={styles.scheduleItem}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.subject}>
                Môn: {item.subject} {item.grade ? `- Lớp ${item.grade}` : ""}
              </Text>
              <Text style={styles.tutor}>Gia sư: {item.tutor}</Text>
              {item.status && (
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.status,
                      item.status === "active"
                        ? styles.statusActive
                        : item.status === "completed"
                        ? styles.statusCompleted
                        : styles.statusCanceled,
                    ]}
                  >
                    {item.status === "active"
                      ? "Đang diễn ra"
                      : item.status === "completed"
                      ? "Đã hoàn thành"
                      : "Đã hủy"}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noSchedule}>Không có lịch học vào ngày này</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBE8E9",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#D32F2F",
    marginVertical: 10,
    marginBottom: 20,
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 8,
  },
  scheduleItem: {
    backgroundColor: "#FADBD8",
    borderWidth: 1,
    borderColor: "#de9e9e",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  time: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 16,
  },
  tutor: {
    fontWeight: "bold",
    marginTop: 4,
  },
  subject: {
    fontWeight: "500",
    marginTop: 4,
  },
  statusContainer: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusActive: {
    backgroundColor: "#C8E6C9",
    color: "#2E7D32",
  },
  statusCompleted: {
    backgroundColor: "#BBDEFB",
    color: "#1565C0",
  },
  statusCanceled: {
    backgroundColor: "#FFCDD2",
    color: "#C62828",
  },
  noSchedule: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
    color: "#666",
    padding: 20,
  },
});
