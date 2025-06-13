import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { actualizarEstadoSensor, agregarSensorASala, limpiarSensoresDeSala, obtenerSensoresPorSala } from '../../database/db';

//  Variable global al módulo para el intervalo
let intervaloGlobal: NodeJS.Timeout | null = null;
export default function NumSala() {
  const { nombre } = useLocalSearchParams(); // nombre de la sala
  const [sensores, setSensores] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [monitoreoActivo, setMonitoreoActivo] = useState(false);

  // Carga inicial de sensores y usuario
  useEffect(() => {
    cargarSensores();
    cargarUsuario();
  }, []);

  const cargarSensores = async () => {
    const data = await obtenerSensoresPorSala(nombre as string);
    setSensores(data);
  };

  const cargarUsuario = async () => {
    const user = await AsyncStorage.getItem('usuario');
    if (user) {
      setUsuario(JSON.parse(user));
    }
  };

 
  // Iniciar generación: guarda el setInterval en intervaloGlobal (si no existe)

  const iniciarGeneracionAutomatica = () => {
    if (intervaloGlobal) {
      Alert.alert('Ya iniciado', 'La generación automática ya está corriendo.');
      return;
    }

    Alert.alert('Inicio', 'La generación automática ha comenzado.');
    setMonitoreoActivo(true);

    // Ocultar el mensaje de “iniciado” en 5 seg
    setTimeout(() => {
      setMonitoreoActivo(false);
    }, 5000);

    const tipos = ['temperatura', 'humedad', 'gas'];
    const modelos = ['X100', 'Y200', 'Z300', 'T400'];

    intervaloGlobal = setInterval(async () => {
      // Genera datos aleatorios
      const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
      const valorAleatorio = parseFloat((Math.random() * 100).toFixed(2));
      const modeloAleatorio = modelos[Math.floor(Math.random() * modelos.length)];

      await agregarSensorASala(
        nombre as string,
        tipoAleatorio,
        valorAleatorio,
        modeloAleatorio,
        'activo'
      );

      // Refresca lista en pantalla
      cargarSensores();
    }, 3000);
  };

  // ---------------  
  // 4) Detener monitoreo: limpia intervaloGlobal si existe
  // ---------------
  const detenerMonitoreo = () => {
    if (intervaloGlobal) {
      clearInterval(intervaloGlobal);
      intervaloGlobal = null;
      Alert.alert('Se ha detenido el monitoreo');
    }
  };

  const handleLimpiarSensores = async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres eliminar todos los sensores de esta sala?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: async () => {
            await limpiarSensoresDeSala(nombre as string);
            cargarSensores();
          },
        },
      ]
    );
  };

  const toggleEstadoSensor = async (sensorId: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    await actualizarEstadoSensor(nombre as string, sensorId, nuevoEstado);
    cargarSensores();
  };

  const formatearValor = (tipo: string, valor: number) => {
    switch (tipo) {
      case 'temperatura':
        return `${valor.toFixed(2)} °C`;
      case 'humedad':
        return `${valor.toFixed(2)} %`;
      case 'gas':
        return valor > 50 ? 'Se ha detectado gas' : 'Sin gas detectado';
      default:
        return valor.toString();
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.sensorItem}>
      <Text style={styles.sensorTipo}>{item.tipo.toUpperCase()}</Text>
      <Text style={styles.sensorTexto}>Modelo: {item.modelo}</Text>
      <Text style={styles.sensorTexto}>Valor: {formatearValor(item.tipo, item.valor)}</Text>
      <Text style={styles.sensorTexto}>Estado: {item.estado}</Text>
      <Text style={styles.sensorTexto}>Sala: {nombre}</Text>
      <Text style={styles.sensorTexto}>
        Fecha: {new Date(item.fecha?.seconds * 1000).toLocaleString()}
      </Text>
      {usuario?.rol === 'admin' && (
        <Pressable
          onPress={() => toggleEstadoSensor(item.id, item.estado)}
          style={[
            styles.cambiarEstadoBoton,
            { backgroundColor: item.estado === 'activo' ? '#cc3300' : '#339933' },
          ]}
        >
          <Text style={styles.botonTexto}>
            Cambiar a {item.estado === 'activo' ? 'inactivo' : 'activo'}
          </Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nombre}</Text>

      <View style={{ flex: 1, marginBottom: 16 }}>
        <FlatList
          data={sensores}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {(usuario?.rol === 'admin' || usuario?.rol === 'invitado') && (
        <View style={styles.botonesContainer}>
          <Pressable onPress={iniciarGeneracionAutomatica} style={styles.botonVerde}>
            <Text style={styles.botonTexto}>Empezar a Monitorear</Text>
          </Pressable>

          <Pressable onPress={detenerMonitoreo} style={styles.botonRojo}>
            <Text style={styles.botonTexto}>Detener Monitoreo</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.botonesAbajo}>
        <Pressable
          onPress={() => router.push({ pathname: 'nombre/historial', params: { nombre } })}
          style={styles.botonGris}
        >
          <Text style={styles.botonTexto}>Ver Historial</Text>
        </Pressable>

        {usuario?.rol === 'admin' && (
          <Pressable onPress={handleLimpiarSensores} style={styles.botonOscuro}>
            <Text style={styles.botonTexto}>Limpiar Sensores</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function detenerMonitoreoGlobal() {
  if (intervaloGlobal) {
    clearInterval(intervaloGlobal);
    intervaloGlobal = null;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f8',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 12,
  },
  sensorItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sensorTipo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#2d3436',
  },
  sensorTexto: {
    fontSize: 14,
    marginBottom: 2,
    color: '#636e72',
  },
  cambiarEstadoBoton: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  botonesContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  botonVerde: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonRojo: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonGris: {
    backgroundColor: '#7f8c8d',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
  },
  botonOscuro: {
    backgroundColor: '#34495e',
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 6,
  },
  botonesAbajo: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  botonTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});