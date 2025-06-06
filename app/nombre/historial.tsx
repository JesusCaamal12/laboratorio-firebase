import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { obtenerHistorialPorSala } from '../../database/db';

export default function HistorialSala() {
    const { nombre } = useLocalSearchParams(); // nombre de la sala
    console.log('Nombre de la sala:', nombre); //log
    const [historial, setHistorial] = useState<any[]>([]);

    useEffect(() => {
        const cargarHistorial = async () => {
            const data = await obtenerHistorialPorSala(nombre as string);
            console.log('Historial cargado:', data);
            setHistorial(data);
        };
        cargarHistorial();
    }, []);

    const renderItem = ({ item }: any) => {
        console.log('Item:', item);
        return (
            <View style={styles.sensorItem}>
                <Text style={styles.sensorTipo}>Sensor: {item.nombreSensor}</Text>
                <Text>Tipo de cambio: {item.tipoCambio}</Text>
                <Text>Nuevo estado: {item.nuevoEstado ?? item.estado ?? 'No disponible'}</Text>
                <Text>Valor: {item.valor !== null ? item.valor : 'No disponible'}</Text>
                <Text>Modelo: {item.modelo ?? 'No disponible'}</Text>
                <Text>
                    Fecha:{' '}
                    {item.fecha && typeof item.fecha.toDate === 'function'
                        ? item.fecha.toDate().toLocaleString()
                        : 'Fecha no disponible'}
                </Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Historial de {nombre}</Text>
            <FlatList
                data={historial}
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
    sensorItem: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2
    },
    sensorTipo: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 }
});
