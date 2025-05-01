import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: 'Laboratorio' }} />
      <Stack.Screen name="sala1" options={{ title: 'Sala 1' }} />
      <Stack.Screen name="sala2" options={{ title: 'Sala 2' }} />
      <Stack.Screen name="historialSala1" options={{ title: 'Historial Sala 1' }} />
      <Stack.Screen name="historialSala2" options={{ title: 'Historial Sala 2' }} />
    </Stack>
  );
}
