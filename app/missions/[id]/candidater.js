import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../utils/authContext";
import { useLocalSearchParams, router } from "expo-router";

export default function Candidater() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!message.trim()) {
      Alert.alert("Message requis", "Explique pourquoi tu es la bonne personne.");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "missions", id, "candidatures"), {
        applicantId: user.uid,
        applicantName: user.displayName || "Anonyme",
        message: message.trim(),
        proposedPrice: price.trim() || null,
        status: "en attente",
        createdAt: serverTimestamp(),
      });
      Alert.alert("Candidature envoyée", "L'auteur de la mission va l'examiner.");
      router.back();
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Postuler pour cette mission</Text>

      <Text style={styles.label}>Ton message</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Présente-toi et explique ta proposition..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Text style={styles.label}>Prix proposé (optionnel)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 5000 FCFA"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={submit} disabled={busy}>
        <Text style={styles.buttonText}>{busy ? "Envoi..." : "Envoyer ma candidature"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textarea: { minHeight: 100, textAlignVertical: "top" },
  button: { backgroundColor: "#1E88E5", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
