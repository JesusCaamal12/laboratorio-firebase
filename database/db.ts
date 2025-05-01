// Importa Firestore y funciones necesarias
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // ya tienes la conexión a Firebase

// Función para insertar un usuario
export const insertarUsuario = async (email: string, password: string) => {
  try {
    const docRef = await addDoc(collection(db, 'usuarios'), {
      email: email,
      password: password
    });
    console.log('Usuario agregado con ID: ', docRef.id);
  } catch (e) {
    console.error('Error al agregar el usuario: ', e);
  }
};

// Función para insertar un sensor
export const insertSensor = async (sala: string, tipo: string, valor: string) => {
  try {
    const docRef = await addDoc(collection(db, 'sensores'), {
      sala: sala,
      tipo: tipo,
      valor: valor
    });
    console.log('Sensor agregado con ID: ', docRef.id);
  } catch (e) {
    console.error('Error al agregar el sensor: ', e);
  }
};

// Función para obtener los sensores por sala
export const getSensoresPorSala = async (sala: string): Promise<any[]> => {
  try {
    const q = query(collection(db, 'sensores'), where('sala', '==', sala));
    const querySnapshot = await getDocs(q);
    const sensores: any[] = [];
    querySnapshot.forEach((doc) => {
      sensores.push(doc.data());
    });
    return sensores;
  } catch (e) {
    console.error('Error al obtener los sensores: ', e);
    return [];
  }
};

// Función para eliminar sensores por sala (para limpiar)
export const eliminarSensoresPorSala = async (sala: string) => {
  try {
    const q = query(collection(db, 'sensores'), where('sala', '==', sala));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const docRef = doc(db, 'sensores', docSnap.id);
      await deleteDoc(docRef);
    });
    console.log('Sensores eliminados');
  } catch (e) {
    console.error('Error al eliminar sensores: ', e);
  }
};

// Función para verificar si ya existe un usuario con el email dado
export const existeUsuario = async (email: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'usuarios'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // true si ya existe
  } catch (e) {
    console.error('Error al verificar usuario: ', e);
    return false;
  }
};


