import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../services/firebase";

const Register = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [samePassword, setSamePassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Register",
      headerShown: false,
    });
  }, []);

  React.useEffect(() => {
    if (
      email.length < 12 ||
      password.length < 3 ||
      password !== confirmPassword
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [email, password, confirmPassword]);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) navigation.replace("Home");
    });

    return unsub;
  }, []);

  const registerUser = async () => {
    setShowLoading(true);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
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
        }}
      >
        <View>
          <Icon name="id-card" size={130} color="white" />
        </View>

        <View>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 50 }}>
            Enregistrement
          </Text>
        </View>

        <View>
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

          <Input
            placeholder="Password"
            placeholderTextColor="white"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
            style={{ color: "white" }}
            inputContainerStyle={{ borderBottomColor: "white" }}
            leftIcon={<Icon name="key" size={25} color="white" />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={!showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            }
            leftIconContainerStyle={{ marginRight: 10 }}
          />

          <Input
            placeholder="Re-enter password"
            placeholderTextColor="white"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry
            onSubmitEditing={registerUser}
            style={{ color: "white" }}
            inputContainerStyle={{ borderBottomColor: "white" }}
            leftIcon={<Icon name="key" size={25} color="white" />}
            rightIcon={
              <Icon
                name={samePassword ? "check-circle" : "times-cricle"}
                size={20}
                color="white"
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
            onPress={registerUser}
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

export default Register;
