import { Stack } from 'expo-router';
export default function Layout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: 'Registro' }} />
      <Stack.Screen name="index1" options={{ title: 'Laboratorio' }} />
      <Stack.Screen name="[nombre]" options={{ title: 'Salas' }} />
      <Stack.Screen name="historial" options={{ title: 'historial' }} />
    </Stack>
  );
} 

