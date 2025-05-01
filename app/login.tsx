/* import { Link } from 'expo-router';
import { Alert, BackHandler, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Home() {

  const salirApp = () => {
    Alert.alert('Salir', '¿Estás seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí', onPress: () => BackHandler.exitApp() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Monitoreo de Laboratorio</Text>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3022/3022768.png' }}
        style={styles.labImage}
      />

      <Text style={styles.subtitle}>Seleccióna una sala para verificar: </Text>

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
}); */

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { existeUsuario, insertarUsuario } from '../database/db'; // Asegúrate de tener esta función implementada

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Ingresa correo y contraseña');
      return;
    }

    try {
      const yaExiste = await existeUsuario(email);
      if (yaExiste) {
        Alert.alert('Correo ya registrado', 'Por favor usa otro correo');
        return;
      }

      await insertarUsuario(email, password); // solo si no existe
      router.replace('/index1');
    } catch (error) {
      Alert.alert('Error al guardar usuario');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png' }}
        style={styles.image}
      />

      <Text style={styles.title}>Ingreso al Laboratorio</Text>
      <Text style={styles.subtitle}>Por favor ingresa tus datos para continuar</Text>

      <TextInput
        placeholder="ejemplo@correo.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  image: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
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
