import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../services/firebase";
import * as firebase from "firebase";
import { Avatar } from "react-native-elements";

const Home = ({ navigation }) => {
  const [memo, setMemo] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [memoText, setMemoText] = React.useState("");

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Memo Pollo",
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onLongPress={() => auth.signOut()}>
            <Avatar
              rounded
              source={{
                uri:
                  auth.currentUser?.photoURL ||
                  "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png",
              }}
              style={{
                height: 30,
                width: 30,
              }}
            />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              marginLeft: 15,
              marginRight: 15,
              paddingLeft: 15,
              paddingRight: 15,
              backgroundColor: "gray",
              borderRadius: 50,
              height: 30,
              color: "white",
            }}
            autoFocus
            placeholder="Ajouter un memo..."
            value={memoText}
            onChangeText={(text) => setMemoText(text)}
            onSubmitEditing={sendMemo}
          />

          <TouchableOpacity
            onPress={sendMemo}
            activeOpacity={0.5}
            disabled={memoText.length < 2}
          >
            <Image
              source={{
                uri: "https://image.flaticon.com/icons/png/512/60/60525.png",
              }}
              style={{
                height: 25,
                width: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  function handleUserAuth() {
    auth.onAuthStateChanged((authUser) => {
      if (!authUser) return navigation.replace("Login");

      db.collection("memos")
        .where("whitelisted", "array-contains", authUser.uid)
        .get()
        .then((docs) => docs.docs.map((d) => setMemo(d.id)))
        .catch((err) => alert(err.message));
    });
  }

  React.useEffect(() => {
    handleUserAuth();

    return handleUserAuth();
  }, []);

  React.useEffect(() => {
    if (!memo) return handleUserAuth();

    const unsub = db
      .collection("memos")
      .doc(memo)
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) =>
        setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    return unsub;
  }, [memo]);

  const sendMemo = async () => {
    if (!memo)
      return db
        .collection("memos")
        .add({ whitelisted: [auth.currentUser.uid] })
        .then(() => alert("Nouveau salon crée ! "))
        .catch((err) => alert(err.message));

    await db
      .collection("memos")
      .doc(memo)
      .collection("posts")
      .add({
        text: memoText,
        createdAt: firebase.firestore.Timestamp.now(),
        done: false,
      })
      .catch((error) => alert(error.message));

    setMemoText("");
  };

  const markDone = async (id) => {
    await db
      .collection("memos")
      .doc(memo)
      .collection("posts")
      .doc(id)
      .update({
        done: !posts.filter((a) => a.id === id)[0].done,
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#2974FA", "#38ABFD", "#43D4FF"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          {posts.length > 0 &&
            posts.map(({ id, createdAt, author, text, done }) => (
              <TouchableOpacity
                onLongPress={() => markDone(id)}
                key={id}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: done ? "#18181b" : "#464649",
                  height: 50,
                  marginTop: 15,
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: done ? "normal" : "bold",
                    padding: 10,
                    marginLeft: 5,
                    marginRight: 5,
                    textDecorationLine: done ? "line-through" : "none",
                  }}
                >
                  {text} (
                  {createdAt.toDate().toLocaleDateString("fr-FR", options)})
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;
