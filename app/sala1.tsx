import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { eliminarSensoresPorSala, getSensoresPorSala, insertSensor } from '../database/db'; // Se usa la nueva versión de insertSensor

export default function Sala1() {
  const [sensores, setSensores] = useState<any[]>([]);
  const [mostrarSensores, setMostrarSensores] = useState(false);

  const cargarDatos = async () => {
    const datos = await getSensoresPorSala('Sala 1');
    setSensores(datos);
  };

  const limpiarSala = async () => {
    try {
      await eliminarSensoresPorSala('Sala 1'); // Eliminamos los datos de los sensores en Firestore
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
      <Text style={styles.title}>Sala de Muestras Químicas</Text>
      <Text style={styles.subtitle}>
        En esta sala se observan compuestos químicos a diferentes temperaturas.
      </Text>

      <Pressable style={styles.toggleButton} onPress={() => setMostrarSensores(!mostrarSensores)}>
        <Text style={styles.buttonText}>{mostrarSensores ? 'Ocultar sensores' : 'Mostrar sensores'}</Text>
      </Pressable>

      {mostrarSensores && (
        <>
          <Pressable style={styles.actionButton} onPress={async () => {
            await insertSensor('Sala 1', 'Temperatura', `${(20 + Math.random() * 10).toFixed(2)} °C`);
            cargarDatos();
          }}>
            <Text style={styles.buttonText}>Agregar temperatura</Text>
          </Pressable>

          <FlatList
            data={sensores.filter(s => s.tipo === 'Temperatura')}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Si no hay id, usar un identificador único
            renderItem={({ item }) => (
              <View style={styles.sensorCard}>
                <Text>{item.tipo}: {item.valor}</Text>
              </View>
            )}
          />


          <Pressable style={styles.deleteButton} onPress={limpiarSala}>
            <Text style={styles.buttonText}>Limpiar sensores de Sala 1</Text>
          </Pressable>
        </>
      )}

      <Link href="/historialSala1" asChild>
        <Pressable style={styles.linkButton}>
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
    backgroundColor: '#e0f7f4'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#045d56'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333'
  },
  toggleButton: {
    backgroundColor: '#4bb8a9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  actionButton: {
    backgroundColor: '#5fcfbc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  linkButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  sensorCard: {
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  }
});