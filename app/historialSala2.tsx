import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { getSensoresPorSala } from '../database/db';
import { styles } from './styles';

export default function HistorialSala2() {
  const [datos, setDatos] = useState<any[]>([]);

  useEffect(() => {
    getSensoresPorSala('Sala 2').then(firestoreDatos => {
      // Añadir el ID del documento a cada sensor
      const datosConId = firestoreDatos.map((sensor: any) => ({
        ...sensor,
        id: sensor.id || Math.random().toString() // Usar doc.id si existe
      }));
      setDatos(datosConId);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial - Sala de Experimentación</Text>
      <FlatList
        data={datos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.sensorCard}>
            <Text style={styles.sensorText}>{item.tipo}: {item.valor}</Text>
          </View>
        )}
      />
    </View>
  );
}
