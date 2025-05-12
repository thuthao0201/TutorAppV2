import { View, TextInput, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function InputField({
  placeholder,
  secureTextEntry,
  onChangeText,
  value,
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    // marginVertical: 10,
    borderColor: "#E57373",
    borderRadius: 8,
    padding: 10,
    width: width * 1,
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E57373",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});
