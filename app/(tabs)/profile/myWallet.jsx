import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { ApiClient } from "../../../config/api";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RFNsq4cLLIvkfu0FMWVJa9VK9D70Dgic8ZY9AHnkpwYjwbmciGeXT7Ae92a9pjRlyZ5lXhjQMhycFDp0mwrWp8a00SaL0WAJ3"; // Replace with your Stripe publishable key

export default function MyWallet() {
  const { user } = useAuth(); // Get user data from AuthContext
  const router = useRouter();
  const api = ApiClient();
  const stripe = useStripe();
  const [balance, setBalance] = useState(0); // Initialize balance with 0
  const [amount, setAmount] = useState(""); // Input amount
  const [transactions, setTransactions] = useState([]); // Transaction history

  useEffect(() => {
    // Combined function to fetch both profile and transaction history
    const fetchData = async () => {
      try {
        // Execute both API calls in parallel using Promise.all
        const [profileResponse, transactionsResponse] = await Promise.all([
          api.get("/api/users/information"),
          api.get("/api/payments/history"),
        ]);

        // Update state with the results
        setBalance(profileResponse.data.balance);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert(
          "Lỗi",
          "Không thể tải thông tin tài khoản hoặc lịch sử giao dịch."
        );
      }
    };

    fetchData(); // Call the combined function
  }, []); // Only run once when component mounts

  const handleDeposit = async () => {
    const depositAmount = parseInt(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (depositAmount > 10000000) {
      Alert.alert("Lỗi", "Số tiền nạp tối đa là 10.000.000 đ.");
      return;
    }
    if (depositAmount < 10000) {
      Alert.alert("Lỗi", "Số tiền nạp tối thiểu là 10.000 đ.");
      return;
    }

    try {
      // Call backend API to create a payment intent
      const response = await api.post("/api/payments/deposit", {
        amount: depositAmount,
      });
      const { clientSecret } = response.data;
      console.log("Client Secret:", clientSecret);

      // Initialize the PaymentSheet
      const { error: initError } = await stripe.initPaymentSheet({
        merchantDisplayName: "My Wallet",
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        Alert.alert(
          "Lỗi",
          `Không thể khởi tạo PaymentSheet: ${initError.message}`
        );
        return;
      }

      // Present the PaymentSheet
      const { error: presentError } = await stripe.presentPaymentSheet();

      if (presentError) {
        Alert.alert("Lỗi", `Thanh toán thất bại: ${presentError.message}`);
        return;
      }

      const res = await api.post("/api/payments/confirm", {
        paymentId: response.data.paymentId,
      });
      console.log(res);

      // Payment succeeded
      setBalance(balance + depositAmount);
      setTransactions([
        {
          _id: res.data._id,
          type: "deposit",
          amount: depositAmount,
          createdAt: Date.now(),
          status: "completed",
        },
        ...transactions,
      ]);
      setAmount("");
      Alert.alert("Thành công", "Nạp tiền thành công.");
    } catch (err) {
      console.error("Error during deposit:", err);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi nạp tiền.");
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseInt(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (withdrawAmount > balance) {
      Alert.alert("Lỗi", "Số dư không đủ để rút tiền.");
      return;
    }
    setBalance(balance - withdrawAmount);
    setTransactions([
      ...transactions,
      {
        id: transactions.length + 1,
        type: "withdraw",
        amount: withdrawAmount,
        createdAt: Date.now(),
      },
    ]);
    setAmount("");
    Alert.alert("Thành công", "Rút tiền thành công.");
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        {item.type === "deposit"
          ? "Nạp tiền"
          : item.type === "withdrawal"
          ? "Rút tiền"
          : "Khác"}
        :{" "}
        <Text style={styles.transactionAmount}>
          {item.amount.toLocaleString()} đ
        </Text>
      </Text>
      <Text style={styles.transactionDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.transactionStatus}>
        Trạng thái:{" "}
        {item.status === "completed" ? (
          <Text style={styles.statusCompleted}>Hoàn thành</Text>
        ) : item.status === "pending" ? (
          <Text style={styles.statusPending}>Đang xử lý</Text>
        ) : (
          <Text style={styles.statusFailed}>Thất bại</Text>
        )}
      </Text>
    </View>
  );

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-circle" size={28} color="#E57373" />
          </TouchableOpacity>
          <Text style={styles.title}>Ví của tôi</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            Số dư: {balance.toLocaleString()} đ
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nhập số tiền"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDeposit}>
            <Text style={styles.buttonText}>Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
            <Text style={styles.buttonText}>Rút tiền</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.historyTitle}>Lịch sử giao dịch</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderTransaction}
          style={styles.transactionList}
        />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4E1",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#E57373",
  },
  balanceContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#E57373",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  transactionText: {
    fontSize: 16,
    color: "#333",
  },
  transactionAmount: {
    fontWeight: "bold",
    color: "#E57373",
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  transactionStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusCompleted: {
    color: "#2AAF65",
    fontWeight: "bold",
  },
  statusPending: {
    color: "#d9802e",
    fontWeight: "bold",
  },
  statusFailed: {
    color: "#E57373",
    fontWeight: "bold",
  },
});
