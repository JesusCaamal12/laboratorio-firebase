import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Animated, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { crearSala, eliminarSala, obtenerSalas, obtenerSensoresPorSala } from '../../database/db';
import { detenerMonitoreoGlobal } from '../salas/[nombre]';

export default function Index1() {
  const [nombreSala, setNombreSala] = useState('');
  const [salas, setSalas] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [alertas, setAlertas] = useState<{ sala: string; mensaje: string }[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    cargarUsuario();

    const intervalo = setInterval(async () => {
      const data = await cargarSalas();
      verificarAlertas(data);
    }, 2000);

    return () => clearInterval(intervalo);
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
    return data;
  };


  const verificarAlertas = async (salasParaVerificar?: any[]) => {
    const salasActuales = salasParaVerificar || salas;

    if (salasActuales.length === 0) return;

    const nuevasAlertas: { sala: string; mensaje: string }[] = [];

    for (const sala of salasActuales) {
      const sensores = await obtenerSensoresPorSala(sala.nombre);

      sensores.forEach((sensor: any) => {
        if (sensor.tipo === 'gas' && sensor.valor > 50) {
          nuevasAlertas.push({
            sala: sala.nombre,
            mensaje: `¡Gas detectado en la sala ${sala.nombre}!`,
          });
        }
        if (sensor.tipo === 'temperatura' && sensor.valor > 30) {
          nuevasAlertas.push({
            sala: sala.nombre,
            mensaje: `Temperatura alta (${sensor.valor.toFixed(1)}°C) en la sala ${sala.nombre}`,
          });
        }
        if (sensor.tipo === 'humedad' && sensor.valor > 70) {
          nuevasAlertas.push({
            sala: sala.nombre,
            mensaje: `Humedad alta (${sensor.valor.toFixed(1)}%) en la sala ${sala.nombre}`,
          });
        }
      });
    }

    if (nuevasAlertas.length > 0) {
      setAlertas(nuevasAlertas);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setAlertas([]));
      }, 3000);
    }
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
          +         // 1) Detenemos el monitoreo en segundo plano
            +         detenerMonitoreoGlobal();
          // 2) Borramos la sala de la base de datos
          await eliminarSala(id);
          // 3) Volvemos a recargar la lista
          cargarSalas();
        },
      },
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
        <Pressable
          onPress={() => handleEliminarSala(item.id)}
          style={styles.eliminarBtn}>
          <Text style={{ color: 'white' }}>Eliminar</Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Alerta sutil */}
      {alertas.length > 0 && (
        <Animated.View style={[styles.alertaContainer, { opacity: fadeAnim }]}>
          {alertas.map((alerta, index) => (
            <Text key={index} style={styles.alertaTexto}>
              ⚠️ {alerta.mensaje}
            </Text>
          ))}
        </Animated.View>
      )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  alertaContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#ffe6e6',
    borderColor: '#ff9999',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  alertaTexto: {
    color: '#cc0000',
    fontWeight: 'bold',
    fontSize: 14,
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
});