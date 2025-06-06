import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index1" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="perfil" options={{ title: 'Perfil' }} />
      <Drawer.Screen name="nosotros" options={{ title: 'Sobre Nosotros' }} />
    </Drawer>
  );
}
