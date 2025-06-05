import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const [rol, setRol] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('usuario');
      if (data) {
        const usuario = JSON.parse(data);
        setRol(usuario.rol);
        setEmail(usuario.email);
      }
    };
    cargarUsuario();
  }, []);

  const salirApp = () => {
    Alert.alert('Salir', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', onPress: () => BackHandler.exitApp() },
    ]);
  };

  const agregarSala = () => {
    Alert.alert('Función', 'Aquí podrías abrir un modal para agregar sala');
  };

  const eliminarSala = () => {
    Alert.alert('Función', 'Aquí podrías seleccionar y eliminar salas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Monitoreo de Laboratorio</Text>
      <Text style={styles.subtitle}>Rol: {rol}</Text>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3022/3022768.png' }}
        style={styles.labImage}
      />

      <Text style={styles.subtitle}>Selecciona una sala para verificar:</Text>

      <Link href="/sala1" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sala 1 - Muestras Químicas</Text>
        </Pressable>
      </Link>

      <Link href="/sala2" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Sala 2 - Experimentación</Text>
        </Pressable>
      </Link>

      {/* Solo si es admin, muestra opciones de agregar/eliminar salas */}
      {rol === 'admin' && (
        <>
          <Pressable style={[styles.button, { backgroundColor: '#2980b9' }]} onPress={agregarSala}>
            <Text style={styles.buttonText}>Agregar nueva sala</Text>
          </Pressable>

          <Pressable style={[styles.button, { backgroundColor: '#c0392b' }]} onPress={eliminarSala}>
            <Text style={styles.buttonText}>Eliminar sala</Text>
          </Pressable>
        </>
      )}

      <Pressable style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={salirApp}>
        <Text style={styles.buttonText}>Salir de la app</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0f0f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#045d56',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  labImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3fb984',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

