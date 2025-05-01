import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { eliminarSensoresPorSala, getSensoresPorSala, insertSensor } from '../database/db'; // Se usa la nueva versión de insertSensor

export default function Sala2() {
  const [sensores, setSensores] = useState<any[]>([]);
  const [mostrarSensores, setMostrarSensores] = useState(false);

  const cargarDatos = async () => {
    const datos = await getSensoresPorSala('Sala 2');
    setSensores(datos);
  };

  const limpiarSala = async () => {
    try {
      await eliminarSensoresPorSala('Sala 2'); // Eliminamos los sensores de la sala 2
      Alert.alert('Listo', 'Sensores eliminados');
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar sensores: ', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala de Experimentación</Text>
      <Text style={styles.description}>
        En esta sala se experimenta con condiciones ambientales como humedad y detección de gases.
      </Text>

      <Pressable style={styles.toggleButton} onPress={() => setMostrarSensores(!mostrarSensores)}>
        <Text style={styles.toggleButtonText}>{mostrarSensores ? 'Ocultar sensores' : 'Mostrar sensores'}</Text>
      </Pressable>

      {mostrarSensores && (
        <>
          <Pressable style={styles.addButton} onPress={async () => {
            await insertSensor('Sala 2', 'Humedad', `${(40 + Math.random() * 20).toFixed(2)} %`);
            cargarDatos();
          }}>
            <Text style={styles.buttonText}>Agregar humedad</Text>
          </Pressable>

          <Pressable style={styles.addButton} onPress={async () => {
            await insertSensor('Sala 2', 'Gas', `${Math.random() < 0.5 ? 'No detectado' : 'Detectado'}`);
            cargarDatos();
          }}>
            <Text style={styles.buttonText}>Agregar gas</Text>
          </Pressable>

          <FlatList
            data={sensores}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Si no hay id, usar un identificador único
            renderItem={({ item }) => (
              <View style={styles.sensorItem}>
                <Text>{item.tipo}: {item.valor}</Text>
              </View>
            )}
          />
          <Pressable style={styles.deleteButton} onPress={limpiarSala}>
            <Text style={styles.buttonText}>Limpiar sensores de Sala 2</Text>
          </Pressable>
        </>
      )}

      <Link href="/historialSala2" asChild>
        <Pressable style={styles.viewHistoryButton}>
          <Text style={styles.buttonText}>Ver historial</Text>
        </Pressable>
      </Link>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f0f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#134e4a',
  },
  description: {
    marginBottom: 20,
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  viewHistoryButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sensorItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
