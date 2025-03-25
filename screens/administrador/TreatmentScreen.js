import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'; // Importa Platform
import axios from 'axios';

const TreatmentScreen = ({ route }) => {
  const [treatment, setTreatment] = useState(null);
  const { diseaseId } = route.params;

  // Obtener el tratamiento desde la API
  const fetchTreatment = async () => {
    try {
      const response = await axios.get(`http://10.131.232.167/tratamientos/?enfermedad=${diseaseId}`);
      if (response.data.length > 0) {
        setTreatment(response.data[0]);  // Suponemos que hay un solo tratamiento por enfermedad
      }
    } catch (error) {
      console.error('Error fetching treatment:', error);
    }
  };

  useEffect(() => {
    fetchTreatment();
  }, [diseaseId]);

  if (!treatment) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tratamiento</Text>
      </View>

      <View style={styles.treatmentInfo}>
        <Text style={styles.treatmentDescription}>{treatment.descripcion}</Text>
      </View>
    </ScrollView>
  );
};

// Estilos 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    backgroundColor: '#006400',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 15, // Uso de Platform
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  treatmentInfo: {
    backgroundColor: '#FFFFF0',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  treatmentDescription: {
    fontSize: 16,
    color: '#555',
  },
});

export default TreatmentScreen;