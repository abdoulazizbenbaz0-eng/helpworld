import { Stack } from "expo-router";
import { AuthProvider } from "../utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerStyle: { backgroundColor: "#1E88E5" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="index" options={{ title: "Connexion" }} />
        <Stack.Screen name="register" options={{ title: "Inscription" }} />
        <Stack.Screen name="missions/index" options={{ title: "Missions" }} />
        <Stack.Screen name="missions/[id]" options={{ title: "Détail mission" }} />
        <Stack.Screen name="profile" options={{ title: "Mon profil" }} />
      </Stack>
    </AuthProvider>
  );
}
