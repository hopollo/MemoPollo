import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db, auth } from "../services/firebase";

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [errorText, setErrorText] = React.useState("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Authentication",
      headerShown: false,
    });
  }, []);

  React.useEffect(() => {
    if (email.length < 12 || password.length < 3) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [email, password]);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) navigation.replace("Home");
    });

    return unsub;
  }, []);

  const connectUser = async () => {
    setShowLoading(true);

    await auth.signInWithEmailAndPassword(email, password).catch((err) => {
      setShowLoading(false);

      setErrorText(err.message);
      console.error(err.message);
    });
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
          marginTop: 5,
          marginBottom: 10
        }}
      >
        <View>
          <Icon name="user-circle" size={130} color="white" />
        </View>

        <View>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 50 }}>
            Memo'Pollo
          </Text>
        </View>

        <View
          style={{
            flex: 1,
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

          <Input
            placeholder="Password"
            placeholderTextColor="white"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
            onSubmitEditing={connectUser}
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

          <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
            <Text style={{ color: "red", fontSize: 12, textAlign: "center", textDecorationLine: "underline", fontWeight: "bold" }}>
              Mot de passe oublié
            </Text>
          </TouchableOpacity>
        </View>

        {errorText.length > 1 ? (
          <View>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "red",
                padding: 10,
                borderRadius: 15,
              }}
            >
              {errorText}
            </Text>
          </View>
        ) : null}

        <View style={{ marginBottom: 10 }}>
          <Button
            title="Valider"
            disabled={disabled}
            loading={showLoading}
            buttonStyle={{ width: 150, height: 50 }}
            onPress={connectUser}
          />
        </View>
        
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              créer un compte
            </Text>
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

export default Login;
