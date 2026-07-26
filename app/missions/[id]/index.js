import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../utils/authContext";
import { useLocalSearchParams, router } from "expo-router";

export default function MissionDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "missions", id), (snap) => {
      if (snap.exists()) setMission({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [id]);

  const takeMission = async () => {
    try {
      await updateDoc(doc(db, "missions", id), {
        status: "en cours",
        helperId: user.uid,
        helperName: user.displayName || "Anonyme",
      });
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  };

  const completeMission = async () => {
    try {
      await updateDoc(doc(db, "missions", id), { status: "terminée" });
    } catch (e) {
      Alert.alert("Erreur", e.message);
    }
  };

  if (!mission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  const isAuthor = mission.authorId === user?.uid;
  const isHelper = mission.helperId === user?.uid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.meta}>Publié par {mission.authorName}</Text>
      <Text style={styles.status}>Statut : {mission.status}</Text>

      {mission.helperName ? (
        <Text style={styles.meta}>Aidé par {mission.helperName}</Text>
      ) : null}

      {mission.status === "ouverte" && !isAuthor && (
        <TouchableOpacity style={styles.button} onPress={takeMission}>
          <Text style={styles.buttonText}>Je prends cette mission</Text>
        </TouchableOpacity>
      )}

      {mission.status === "en cours" && (isAuthor || isHelper) && (
        <TouchableOpacity style={styles.button} onPress={completeMission}>
          <Text style={styles.buttonText}>Marquer comme terminée</Text>
        </TouchableOpacity>
      )}

      {mission.status === "ouverte" && !isAuthor && (
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => router.push(`/missions/${id}/candidater`)}
        >
          <Text style={styles.buttonOutlineText}>Postuler pour cette mission</Text>
        </TouchableOpacity>
      )}

      {isAuthor && mission.status === "ouverte" && (
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => router.push(`/missions/${id}/candidatures`)}
        >
          <Text style={styles.buttonOutlineText}>Voir les candidatures</Text>
        </TouchableOpacity>
      )}

      {(isAuthor || isHelper) && mission.helperId && (
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.push(`/missions/${id}/chat`)}
        >
          <Text style={styles.buttonText}>💬 Discuter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  meta: { color: "#666", marginBottom: 4 },
  status: { fontSize: 16, fontWeight: "600", marginVertical: 12, color: "#1E88E5" },
  button: { backgroundColor: "#1E88E5", padding: 14, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  buttonOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#1E88E5",
  },
  buttonOutlineText: { color: "#1E88E5", textAlign: "center", fontWeight: "bold" },
  buttonSecondary: { backgroundColor: "#2E7D32" },
});
