import { Text, View } from "react-native";

export default function Nosotros() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Contactanos
      </Text>

      <Text style={{ fontSize: 16, lineHeight: 24, textAlign: "justify" }}>
        Informacion extra para poder tener un apartado de contacto
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 24 }}>
        Ubicacion:
      </Text>

      <Text style={{ fontSize: 16, marginTop: 8 }}>
        Dirección: Av. Principal #123
        Email: contacto@ejemplo.com
      </Text>

      <Text
        style={{
          marginTop: 30,
          fontSize: 16,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        📜 ¿Cómo podemos ayudarte? Si tienes preguntas sobre nuestros proyectos,
        colaboraciones o necesitas asistencia técnica, estamos aquí para
        ayudarte. ¡No dudes en escribirnos!
      </Text>
    </View>
  );
}
