import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { actualizarEstadoSensor, agregarSensorASala, limpiarSensoresDeSala, obtenerSensoresPorSala } from '../../database/db';

export default function NumSala() {
  const { nombre } = useLocalSearchParams(); // nombre de la sala
  const [sensores, setSensores] = useState<any[]>([]);
  const [tipoSensor, setTipoSensor] = useState('');
  const [valor, setValor] = useState('');
  const [modelo, setModelo] = useState('');
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo');
  const [usuario, setUsuario] = useState<any>(null);
  const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);

  const iniciarGeneracionAutomatica = () => {
    if (intervalo) {
      Alert.alert('Ya iniciado', 'La generación automática ya está corriendo.');
      return;
    }

    const tipos = ['temperatura', 'humedad', 'gas'];
    const modelos = ['X100', 'Y200', 'Z300', 'T400'];

    const nuevoIntervalo = setInterval(async () => {
      const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
      const valorAleatorio = parseFloat((Math.random() * 100).toFixed(2));
      const modeloAleatorio = modelos[Math.floor(Math.random() * modelos.length)];

      await agregarSensorASala(
        nombre as string,
        tipoAleatorio,
        valorAleatorio,
        modeloAleatorio,
        'activo' // estado fijo
      );

      cargarSensores();
    }, 5000);

    setIntervalo(nuevoIntervalo);
  };



  const cargarSensores = async () => {
    const data = await obtenerSensoresPorSala(nombre as string);
    setSensores(data);
  };

  useEffect(() => {
    cargarSensores();
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const user = await AsyncStorage.getItem('usuario');
    if (user) {
      setUsuario(JSON.parse(user));
    }
  };

  const handleAgregarSensor = async () => {
    if (!tipoSensor || !valor || !modelo || !estado) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    await agregarSensorASala(
      nombre as string,
      tipoSensor,
      parseFloat(valor),
      modelo,
      estado
    );
    setTipoSensor('');
    setValor('');
    setModelo('');
    setEstado('activo');
    cargarSensores();
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
          }
        }
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
    <Text>Modelo: {item.modelo}</Text>
    <Text>Valor: {formatearValor(item.tipo, item.valor)}</Text>
    <Text>Estado: {item.estado}</Text>
    <Text>Sala: {nombre}</Text>
    <Text>
      Fecha: {new Date(item.fecha?.seconds * 1000).toLocaleString()}
    </Text>
    {usuario?.rol === 'admin' && (
      <Pressable
        onPress={() => toggleEstadoSensor(item.id, item.estado)}
        style={[
          styles.boton,
          { backgroundColor: item.estado === 'activo' ? '#cc3300' : '#339933', marginTop: 8 }
        ]}
      >
        <Text style={{ color: 'white' }}>
          Cambiar a {item.estado === 'activo' ? 'inactivo' : 'activo'}
        </Text>
      </Pressable>
    )}
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sensores de: {nombre}</Text>

      {usuario?.rol === 'admin' && (
        <View style={styles.inputContainer}>
          <Pressable onPress={iniciarGeneracionAutomatica} style={styles.boton}>
            <Text style={{ color: 'white' }}>Empezar a monitorear</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (intervalo) {
                clearInterval(intervalo);
                setIntervalo(null);
                Alert.alert('Detenido', 'La generación automática se ha detenido.');
              }
            }}
            style={[styles.boton, { backgroundColor: '#cc0000', marginTop: 10 }]}
          >
            <Text style={{ color: 'white' }}>Detener monitoreo</Text>
          </Pressable>

        </View>
      )}



      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Pressable
          onPress={() =>
            router.push({ pathname: 'nombre/historial', params: { nombre } })
          }
          style={[styles.boton, { flex: 1, marginRight: 5, backgroundColor: '#666' }]}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Ver Historial</Text>
        </Pressable>
        {usuario?.rol === 'admin' && (
          <Pressable
            onPress={handleLimpiarSensores}
            style={[styles.boton, { flex: 1, marginLeft: 5, backgroundColor: '#990000' }]}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Limpiar Sensores</Text>
          </Pressable>
        )}
      </View>


      <FlatList
        data={sensores}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#eef' },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: { marginBottom: 20, gap: 10 },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderColor: '#aaa',
    borderWidth: 1
  },
  boton: {
    backgroundColor: '#006699',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  sensorItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2
  },
  sensorTipo: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 }
});