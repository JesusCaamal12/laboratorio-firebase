import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-gesture-handler';
import { crearSala, eliminarSala, obtenerSalas } from '../database/db';

export default function Index1() {
  const [nombreSala, setNombreSala] = useState('');
  const [salas, setSalas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    cargarUsuario();
    cargarSalas();
  }, []);

  const cargarUsuario = async () => {
    const user = await AsyncStorage.getItem('usuario');
    if (user) {
      setUsuario(JSON.parse(user));
    }
  };

  const cargarSalas = async () => {
    const data = await obtenerSalas();
    setSalas(data);
  };

  const handleCrearSala = async () => {
    if (nombreSala.trim() === '') {
      Alert.alert('Error', 'Ingresa un nombre de sala');
      return;
    }
    await crearSala(nombreSala, usuario?.email || 'desconocido');
    setNombreSala('');
    cargarSalas();
  };

  const handleEliminarSala = async (id: string) => {
    Alert.alert('Confirmación', '¿Estás seguro de eliminar esta sala?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await eliminarSala(id);
          cargarSalas();
        }
      }
    ]);
  };

  const irASala = (nombre: string) => {
    router.push(`/salas/${nombre}`);

  };

  const renderItem = ({ item }: any) => (
    <Pressable onPress={() => irASala(item.nombre)} style={styles.salaItem}>
      <Text style={styles.salaNombre}>{item.nombre}</Text>
      <Text style={styles.salaDetalle}>Creado por: {item.creador}</Text>
      <Text style={styles.salaDetalle}>
        Fecha: {new Date(item.fechaCreacion.seconds * 1000).toLocaleString()}
      </Text>

      {usuario?.rol === 'admin' && (
        <Pressable onPress={() => handleEliminarSala(item.id)} style={styles.eliminarBtn}>
          <Text style={{ color: 'white' }}>Eliminar</Text>
        </Pressable>
      )}
    </Pressable>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Salas del Laboratorio</Text>

      {usuario?.rol === 'admin' && (
        <View style={styles.crearSalaContainer}>
          <TextInput
            placeholder="Nombre de la sala"
            value={nombreSala}
            onChangeText={setNombreSala}
            style={styles.input}
          />
          <Pressable onPress={handleCrearSala} style={styles.botonCrear}>
            <Text style={{ color: 'white' }}>Crear Sala</Text>
          </Pressable>
        </View>
      )}


      <FlatList
        data={salas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem('usuario');
          router.replace('/login'); // Asegúrate que esta ruta existe
        }}
        style={[styles.botonCrear, { backgroundColor: '#ff9900', marginTop: 10 }]}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Cerrar sesión</Text>
      </Pressable>

      <Pressable
        onPress={() => BackHandler.exitApp()}
        style={[styles.botonCrear, { backgroundColor: '#333', marginTop: 10 }]}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Salir de la App</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  crearSalaContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  botonCrear: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center'
  },
  salaItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2
  },
  salaNombre: { fontWeight: 'bold', fontSize: 16 },
  salaDetalle: { color: '#666' },
  eliminarBtn: {
    marginTop: 10,
    backgroundColor: '#ff5555',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center'
  }
});
