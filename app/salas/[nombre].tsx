import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { actualizarEstadoSensor, agregarSensorASala, limpiarSensoresDeSala, obtenerSensoresPorSala } from '../../database/db';

export default function NumSala() {
  const { nombre } = useLocalSearchParams(); // nombre de la sala
  const [sensores, setSensores] = useState<any[]>([]);
  const [tipoSensor, setTipoSensor] = useState('');
  const [valor, setValor] = useState('');
  const [modelo, setModelo] = useState('');
  const [estado, setEstado] = useState<'activo' | 'inactivo'>('activo');
  const [usuario, setUsuario] = useState<any>(null);

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


  const renderItem = ({ item }: any) => (
    <View style={styles.sensorItem}>
      <Text style={styles.sensorTipo}>{item.tipo.toUpperCase()}</Text>
      <Text>Modelo: {item.modelo}</Text>
      <Text>Valor: {item.valor}</Text>
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
          <TextInput
            placeholder="Tipo (temperatura, gas...)"
            value={tipoSensor}
            onChangeText={setTipoSensor}
            style={styles.input}
          />
          <TextInput
            placeholder="Valor"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
            style={styles.input}
          />
          <TextInput
            placeholder="Modelo del sensor"
            value={modelo}
            onChangeText={setModelo}
            style={styles.input}
          />
          <Picker
            selectedValue={estado}
            onValueChange={(value) => setEstado(value)}
            style={styles.input}
          >
            <Picker.Item label="Activo" value="activo" />
            <Picker.Item label="Inactivo" value="inactivo" />
          </Picker>

          <Pressable onPress={handleAgregarSensor} style={styles.boton}>
            <Text style={{ color: 'white' }}>Agregar Sensor</Text>
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
