import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Champs manquants", "Remplis tous les champs.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Mot de passe trop court", "Minimum 6 caractères.");
      return;
    }
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email: email.trim(),
        rating: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
      });
      router.replace("/missions");
    } catch (e) {
      Alert.alert("Erreur d'inscription", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput style={styles.input} placeholder="Nom complet" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe (min. 6 caractères)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={busy}>
        <Text style={styles.buttonText}>{busy ? "Création..." : "S'inscrire"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 24, color: "#1E88E5" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#1E88E5", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
