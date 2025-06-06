import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getUsuarioPorEmail } from '../database/db';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const iniciarSesion = async () => {
  if (email.trim() === '' || password.trim() === '') {
    Alert.alert('Error', 'Ingresa correo y contraseña');
    return;
  }

  try {
    const usuario = await getUsuarioPorEmail(email.trim().toLowerCase());

    if (!usuario) {
      Alert.alert('Usuario no encontrado');
      return;
    }

    if (usuario.password !== password.trim()) {
      Alert.alert('Contraseña incorrecta');
      return;
    }

    const { rol } = usuario;

    await AsyncStorage.setItem('usuario', JSON.stringify({
      email: usuario.email,
      rol: usuario.rol
    }));

    // Redirección a ruta única
    router.replace('/index1');

  } catch (error) {
    Alert.alert('Error al iniciar sesión');
    console.error('Error al iniciar sesión:', error);
  }
};




  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png' }} style={styles.image} />
      <Text style={styles.title}>Ingreso al Laboratorio</Text>

      <TextInput placeholder="Correo" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Pressable style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/registro')}>
        <Text style={{ marginTop: 20, color: '#008080', textAlign: 'center' }}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  image: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold' }
});