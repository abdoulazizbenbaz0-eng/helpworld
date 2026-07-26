import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { useAuth } from "../utils/authContext";
import { router, Link } from "expo-router";

export default function Login() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/missions");
    }
  }, [loading, user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Champs manquants", "Entre ton email et ton mot de passe.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      Alert.alert("Erreur de connexion", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HelpWorld</Text>
      <Text style={styles.subtitle}>Le monde d'aide</Text>

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
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={busy}>
        <Text style={styles.buttonText}>{busy ? "Connexion..." : "Se connecter"}</Text>
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        Pas encore de compte ? S'inscrire
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#1E88E5" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 32, color: "#666" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: "#1E88E5", padding: 14, borderRadius: 8, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", marginTop: 20, color: "#1E88E5" },
});
