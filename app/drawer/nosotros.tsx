import { Text, View } from 'react-native';

export default function Nosotros() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Sobre Nosotros</Text>
      <Text style={{ marginTop: 10 }}>
        Esta app fue desarrollada para monitorear laboratorios con sensores de gas, temperatura y humedad.
        ¡Gracias por usarla!
      </Text>
    </View>
  );
}
