import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../services/firebase";

const Forget = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [showLoading, setShowLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Forget",
      headerShown: false,
    });
  }, []);

  React.useEffect(() => {
    if (email.length < 12) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [email]);

  const resetUser = async () => {
    setShowLoading(true);

    auth
      .sendPasswordResetEmail(email)
      .then((val) => {
        if (credentials) navigation.replace("Home");
      })
      .catch((err) => console.error(err.message));
  };

  return (
    <LinearGradient
      colors={["#2974FA", "#38ABFD", "#43D4FF"]}
      style={styles.container}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <Icon name="id-card" size={130} color="white" />
        </View>

        <View>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 35 }}>
            Changer de mot passe
          </Text>
        </View>

        <View
          style={{
            width: "90%",
          }}
        >
          <Input
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={{ color: "white" }}
            inputContainerStyle={{ borderBottomColor: "white" }}
            autoFocus
            leftIcon={
              <Icon
                name="user"
                size={25}
                color="white"
                style={{ padding: 5 }}
              />
            }
            leftIconContainerStyle={{ marginRight: 10 }}
          />
        </View>

        <View>
          <Button
            title="Valider"
            disabled={disabled}
            loading={showLoading}
            buttonStyle={{ width: 150, height: 50 }}
            onPress={resetUser}
          />
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Icon name="arrow-left" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "white",
    color: "white",
  },
});

export default Forget;
