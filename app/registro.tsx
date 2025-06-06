import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { existeUsuario, insertarUsuario } from '../database/db';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const rol: 'invitado' = 'invitado'; // rol fijo sin opción de cambiar

  const registrar = async () => {
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

      await insertarUsuario(email, password, rol);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error al registrar');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2913/2913465.png' }} style={styles.image} />
      <Text style={styles.title}>Registro de Usuario</Text>

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

      {/* Ya no mostramos selección de rol */}

      <Pressable style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/login')}>
        <Text style={{ marginTop: 20, color: '#008080', textAlign: 'center' }}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
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
