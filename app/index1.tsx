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
    <View>
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
            <Text style={styles.botonTexto}>Crear</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>

    <View style={styles.footerButtons}>
      <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem('usuario');
          router.replace('/login');
        }}
        style={styles.botonSecundario}
      >
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </Pressable>

      <Pressable
        onPress={() => BackHandler.exitApp()}
        style={styles.botonSalir}
      >
        <Text style={styles.botonTexto}>Salir de la App</Text>
      </Pressable>
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  crearSalaContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  botonCrear: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  salaItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },
  salaNombre: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#34495e',
    marginBottom: 4,
  },
  salaDetalle: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  eliminarBtn: {
    marginTop: 12,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtons: {
    gap: 10,
    marginTop: 30,
  },
  botonSecundario: {
    backgroundColor: '#ff9900',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonSalir: {
    backgroundColor: '#34495e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  }
});

