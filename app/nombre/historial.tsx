import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { obtenerHistorialPorSala } from '../../database/db';

export default function HistorialSala() {
    const { nombre } = useLocalSearchParams();
    console.log('Nombre de la sala:', nombre); 
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
                <Text style={styles.textLine}>Tipo de cambio: {item.tipoCambio}</Text>
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
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f9fc', // más limpio que #eef
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    sensorItem: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 16, // esquinas más redondeadas
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    sensorTipo: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#2c3e50',
    },
    textLine: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
});
