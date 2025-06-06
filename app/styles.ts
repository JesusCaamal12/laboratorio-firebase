import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sensorCard: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#e6f0ff',
  },
  sensorText: {
    fontSize: 16,
  },

  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20
},
iconos: {
  flexDirection: 'row',
  gap: 10
},
icono: {
  marginHorizontal: 5
},
titulo: {
  fontSize: 22,
  fontWeight: 'bold'
}

});
