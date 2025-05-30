import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ApiClient } from "../config/api";

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: "1", text: "Xin chào! Tôi có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = ApiClient();

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || isLoading) return;

    // Thêm tin nhắn người dùng
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages([...messages, userMessage]);

    const userQuery = inputText;
    setInputText("");
    setIsLoading(true);

    // Thêm tin nhắn "đang suy nghĩ"
    const botTypingId = (Date.now() + 1).toString();
    const botTypingMessage = {
      id: botTypingId,
      text: "Đang suy nghĩ...",
      sender: "bot",
    };
    setMessages((prev) => [...prev, botTypingMessage]);

    try {
      // Gọi API RAG
      const response = await api.post("/api/rag/chat", { userQuery });

      // Cập nhật tin nhắn với kết quả từ API
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botTypingId
            ? {
                id: msg.id,
                text: response.answer || "Tôi không thể trả lời câu hỏi này.",
                sender: "bot",
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error calling RAG API:", error);

      // Thay thế tin nhắn "đang suy nghĩ" bằng thông báo lỗi
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botTypingId
            ? {
                id: msg.id,
                text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.",
                sender: "bot",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color="#E74C3C" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tutor AI</Text>
        </View>

        <View style={styles.aiIconContainer}>
          <MaterialCommunityIcons
            name="google-assistant"
            size={64}
            color="#f5b0a9"
          />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "user"
                    ? { color: "white" }
                    : { color: "black" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập..."
            value={inputText}
            onChangeText={setInputText}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.sendText}>Gửi</Text>
                <Ionicons name="send" size={18} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },

  header: {
    backgroundColor: "#FADBD8",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
    marginHorizontal: 20,
  },

  aiIconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },

  messagesList: {
    flexGrow: 1,
    marginHorizontal: 15,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "70%",
  },
  userMessage: {
    backgroundColor: "#E74C3C",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#FADBD8",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "semibold",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E74C3C",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendText: {
    color: "white",
    marginRight: 5,
  },
});
