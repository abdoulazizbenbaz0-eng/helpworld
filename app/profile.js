import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useAuth } from "../utils/authContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
    return unsub;
  }, [user]);

  if (!profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile.name?.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>
      <Text style={styles.rating}>
        ⭐ {profile.rating?.toFixed(1) || "0.0"} ({profile.ratingCount || 0} avis)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { color: "#666", marginTop: 4 },
  rating: { marginTop: 12, fontSize: 16 },
});
