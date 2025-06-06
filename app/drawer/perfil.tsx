import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    BackHandler,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Perfil() {
  const [usuario, setUsuario] = useState<{ email: string; rol: string } | null>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const datos = await AsyncStorage.getItem('usuario');
      if (datos) {
        setUsuario(JSON.parse(datos));
      }
    };
    cargarUsuario();
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('usuario');
    router.replace('/login');
  };

  const salirApp = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png' }}
        style={styles.image}
      />

      {usuario && (
        <>
          <Text style={styles.info}>Correo: {usuario.email}</Text>
          <Text style={styles.info}>Rol: {usuario.rol}</Text>
        </>
      )}

      <Pressable style={styles.boton} onPress={cerrarSesion}>
        <Text style={styles.texto}>Cerrar sesión</Text>
      </Pressable>

      <Pressable style={[styles.boton, { backgroundColor: '#555' }]} onPress={salirApp}>
        <Text style={styles.texto}>Salir de la App</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 100, height: 100, marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10, color: '#333' },
  boton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center'
  },
  texto: { color: '#fff', fontWeight: 'bold' }
});
