import { Text, View } from 'react-native';

export default function Nosotros() {
  return (
<View style={{ flex: 1, padding: 20 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
    Sobre Nosotros
  </Text>

  <Text style={{ fontSize: 16, lineHeight: 24, textAlign: 'justify' }}>
    Esta aplicación fue desarrollada para monitorear laboratorios mediante sensores de gas, temperatura y humedad. 
    Nuestro objetivo es ayudar a mantener espacios seguros y controlados para la investigación y el trabajo técnico.
  </Text>

  <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 24 }}>
    Desarrolladores:
  </Text>

  <Text style={{ fontSize: 16, marginTop: 8 }}>
    • Jesús Guadalupe Caamal Noh{'\n'}
    • Alan Ricardo Che Cahum{'\n'}
    • Ángel David Chale Bacab{'\n'}
    • Braulio Pool Durán
  </Text>

  <Text style={{ marginTop: 30, fontSize: 16, fontStyle: 'italic', textAlign: 'center' }}>
    ¡Gracias por usar nuestra app!
  </Text>
</View>

  );
}
