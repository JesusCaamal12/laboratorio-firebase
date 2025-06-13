import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

export const insertarUsuario = async (email: string, password: string, rol: string) => {
  try {
    const docRef = await addDoc(collection(db, 'usuarios'), {
      email: email,
      password: password,
      rol: rol
    });
    console.log('Usuario agregado con ID: ', docRef.id);
  } catch (e) {
    console.error('Error al agregar el usuario: ', e);
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

// Función para obtener un usuario por email
export const getUsuarioPorEmail = async (email: string): Promise<any | null> => {
  try {
    const q = query(collection(db, 'usuarios'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() }; // ⬅ Incluye el ID
    }
    return null;
  } catch (e) {
    console.error('Error al obtener usuario: ', e);
    return null;
  }
};


export const crearSala = async (nombre: string, creador: string) => {
  try {
    const docRef = await addDoc(collection(db, 'salas'), {
      nombre,
      creador,
      fechaCreacion: Timestamp.now()
    });
    console.log('Sala creada con ID:', docRef.id);
  } catch (e) {
    console.error('Error al crear sala:', e);
  }
};

export const obtenerSalas = async (): Promise<any[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'salas'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Error al obtener salas:', e);
    return [];
  }
};

export const eliminarSala = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'salas', id));
    console.log('Sala eliminada:', id);
  } catch (e) {
    console.error('Error al eliminar sala:', e);
  }
};

// Obtener sensores de una sala
export const obtenerSensoresPorSala = async (salaId: string): Promise<any[]> => {
  try {
    const sensoresRef = collection(db, 'salas', salaId, 'sensores');
    const querySnapshot = await getDocs(sensoresRef);
    const sensores: any[] = [];
    querySnapshot.forEach((doc) => {
      sensores.push({ id: doc.id, ...doc.data() });
    });
    return sensores;
  } catch (e) {
    console.error('Error al obtener sensores: ', e);
    return [];
  }
};

// Agregar sensor a sala nuevo
export const agregarSensorASala = async (
  salaId: string,
  tipo: string,
  valor: number,
  modelo: string,
  estado: string
) => {
  try {
    const sensoresRef = collection(db, 'salas', salaId, 'sensores');

    // Buscar sensor existente por tipo
    const q = query(sensoresRef, where('tipo', '==', tipo));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Sensor existe
      const sensorDoc = querySnapshot.docs[0];
      const sensorRef = doc(db, 'salas', salaId, 'sensores', sensorDoc.id);

      const modeloExistente = sensorDoc.data().modelo;
      const valorExistente = sensorDoc.data().valor;

      await updateDoc(sensorRef, {
        valor,
        estado,
        fecha: new Date()
      });

      // Ahora pasamos valor y modelo para registrar
      const tipoExistente = sensorDoc.data().tipo;

      await registrarCambioEnHistorial(
        salaId,
        sensorDoc.id,
        'actualizado',
        estado,
        valor,
        modeloExistente,
        tipoExistente
      );


      console.log('Sensor actualizado y registrado en historial');
    } else {
      // Crear nuevo sensor
      const docRef = await addDoc(sensoresRef, {
        tipo,
        valor,
        modelo,
        estado,
        fecha: new Date()
      });

      await registrarCambioEnHistorial(salaId, docRef.id, 'agregado', estado, valor, modelo);

      console.log('Sensor agregado y registrado en historial');
    }

  } catch (e) {
    console.error('Error al agregar o actualizar sensor: ', e);
  }
};



// actualizar estado

export const actualizarEstadoSensor = async (
  salaId: string,
  sensorId: string,
  nuevoEstado: string
) => {
  try {
    const sensorRef = doc(db, 'salas', salaId, 'sensores', sensorId);

    // Obtener datos actuales del sensor
    const sensorSnap = await getDoc(sensorRef);
    const sensorData = sensorSnap.data();

    if (!sensorData) {
      console.error('No se encontró el sensor.');
      return;
    }

    await updateDoc(sensorRef, { estado: nuevoEstado });

    // Guardar en historial con más datos
    const historialRef = collection(db, 'salas', salaId, 'historial');
    await addDoc(historialRef, {
      sensorId,
      tipo: sensorData.tipo,
      modelo: sensorData.modelo,
      valor: sensorData.valor,
      tipoCambio: 'actualización',
      nuevoEstado,
      fecha: new Date()
    });

    console.log('Estado actualizado y registrado en historial');
  } catch (e) {
    console.error('Error al actualizar el estado del sensor:', e);
  }
};


//limpiar
export const limpiarSensoresDeSala = async (salaId: string) => {
  try {
    const sensoresRef = collection(db, 'salas', salaId, 'sensores');
    const querySnapshot = await getDocs(sensoresRef);

    const deletePromises = querySnapshot.docs.map((sensorDoc) => {
      const sensorRef = doc(db, 'salas', salaId, 'sensores', sensorDoc.id);
      return deleteDoc(sensorRef);
    });

    await Promise.all(deletePromises);
    console.log('Todos los sensores eliminados de la sala');
  } catch (e) {
    console.error('Error al limpiar los sensores de la sala:', e);
  }
};

//historial 

export const obtenerHistorialPorSala = async (salaId: string) => {
  try {
    const historialRef = collection(db, 'salas', salaId, 'historial');
    const q = query(historialRef, orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);

    const historialConNombre = await Promise.all(
      querySnapshot.docs.map(async (docHistorial) => {
        const data = docHistorial.data();
        console.log('Historial data:', data);
        let nombreSensor = 'Desconocido';

        if (data.sensorId) {
          console.log('Buscando sensor con ID:', data.sensorId);
          const sensorRef = doc(db, 'salas', salaId, 'sensores', data.sensorId);
          const sensorSnap = await getDoc(sensorRef);
          if (sensorSnap.exists()) {
            const sensorData = sensorSnap.data();
            console.log('Sensor encontrado:', sensorData);
            nombreSensor = sensorData.nombre || sensorData.tipo || 'Sin nombre';
          } else {
            console.warn(`Sensor con ID ${data.sensorId} no encontrado`);
          }
        }

        return {
          id: docHistorial.id,
          ...data,
          nombreSensor,
          valor: data.valor ?? null,
          modelo: data.modelo ?? null
        };
      })
    );

    return historialConNombre;
  } catch (e) {
    console.error('Error al obtener el historial:', e);
    return [];
  }
};

//Registro de cambio nuevo
export const registrarCambioEnHistorial = async (
  salaId: string,
  sensorId: string,
  tipoCambio: string,
  estado: string,
  valor: number,
  modelo: string,
  tipo?: string
) => {
  try {
    const historialRef = collection(db, 'salas', salaId, 'historial');

    const historialData: any = {
      sensorId,
      tipoCambio,
      estado,
      valor,
      modelo,
      fecha: new Date()
    };

    if (tipo !== undefined) {
      historialData.tipo = tipo;
    }

    await addDoc(historialRef, historialData);
  } catch (e) {
    console.error('Error al registrar en historial:', e);
  }
};













