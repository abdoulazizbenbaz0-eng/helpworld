import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useLocalSearchParams, router } from "expo-router";

export default function Candidatures() {
  const { id } = useLocalSearchParams();
  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "missions", id, "candidatures"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setCandidatures(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [id]);

  const accepter = async (candidature) => {
    Alert.alert(
      "Confirmer",
      `Accepter la candidature de ${candidature.applicantName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Accepter",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "missions", id), {
                status: "en cours",
                helperId: candidature.applicantId,
                helperName: candidature.applicantName,
              });
              await updateDoc(
                doc(db, "missions", id, "candidatures", candidature.id),
                { status: "acceptée" }
              );
              router.replace(`/missions/${id}`);
            } catch (e) {
              Alert.alert("Erreur", e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={candidatures}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune candidature pour l'instant.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.applicantName}</Text>
            <Text style={styles.message}>{item.message}</Text>
            {item.proposedPrice ? (
              <Text style={styles.price}>💰 {item.proposedPrice}</Text>
            ) : null}
            <Text style={styles.status}>Statut : {item.status}</Text>

            {item.status === "en attente" && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => accepter(item)}
              >
                <Text style={styles.buttonText}>Accepter cette candidature</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  message: { color: "#333", marginBottom: 8 },
  price: { color: "#2E7D32", fontWeight: "600", marginBottom: 4 },
  status: { color: "#666", fontSize: 12, marginBottom: 8 },
  button: { backgroundColor: "#1E88E5", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
