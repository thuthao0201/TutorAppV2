import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

const socialIcons = [
  { id: "facebook", source: { uri: "" } },
  { id: "twitter", source: { uri: "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg" } },
  { id: "google", source: { uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" } },
  { id: "apple", source: { uri: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" } }
];

export default function SocialLogin() {
  return (
    <View style={styles.container}>
      {socialIcons.map((icon) => (
        <TouchableOpacity key={icon.id} style={styles.iconButton}>
          <Image source={icon.source} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  icon: {
    width: 26,
    height: 26,
  },
});
