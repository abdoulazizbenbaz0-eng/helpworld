import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../utils/authContext";
import { useLocalSearchParams } from "expo-router";

export default function MissionChat() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "missions", id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const content = text.trim();
    setText("");
    await addDoc(collection(db, "missions", id, "messages"), {
      text: content,
      senderId: user.uid,
      senderName: user.displayName || "Anonyme",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.uid;
          return (
            <View
              style={[
                styles.bubble,
                isMine ? styles.bubbleMine : styles.bubbleTheirs,
              ]}
            >
              {!isMine && <Text style={styles.senderName}>{item.senderName}</Text>}
              <Text style={isMine ? styles.textMine : styles.textTheirs}>
                {item.text}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun message. Dis bonjour 👋</Text>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Écris un message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  bubbleMine: {
    backgroundColor: "#1E88E5",
    alignSelf: "flex-end",
  },
  bubbleTheirs: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  senderName: { fontSize: 11, color: "#666", marginBottom: 2 },
  textMine: { color: "#fff" },
  textTheirs: { color: "#000" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
});
