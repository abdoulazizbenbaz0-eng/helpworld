import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../utils/firebaseConfig";
import { useAuth } from "../../utils/authContext";
import { router } from "expo-router";

export default function Missions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "missions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const createMission = async () => {
    if (!title.trim()) {
      Alert.alert("Titre requis", "Décris la mission en un titre.");
      return;
    }
    await addDoc(collection(db, "missions"), {
      title: title.trim(),
      status: "ouverte",
      authorId: user.uid,
      authorName: user.displayName || "Anonyme",
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text style={styles.headerLink}>Mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={styles.headerLink}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {showForm ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Titre de la mission"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.button} onPress={createMission}>
            <Text style={styles.buttonText}>Publier</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Text style={styles.buttonText}>+ Nouvelle mission</Text>
        </TouchableOpacity>
      )}

      <FlatList
        style={{ marginTop: 16 }}
        data={missions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Aucune mission pour l'instant.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/missions/${item.id}`)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.authorName} · {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  headerLink: { color: "#1E88E5", fontWeight: "600" },
  form: { marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 8 },
  button: { backgroundColor: "#1E88E5", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  card: { padding: 16, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardMeta: { color: "#888", marginTop: 4, fontSize: 12 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
