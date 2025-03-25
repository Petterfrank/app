import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'; // Importa Platform
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const DiseasesScreen = () => {
  const [diseases, setDiseases] = useState([]);
  const navigation = useNavigation();

  // Obtener las enfermedades desde la API
  const fetchDiseases = async () => {
    try {
      const response = await axios.get('http://10.131.232.167/enfermedades/');
      setDiseases(response.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleViewTreatment = (diseaseId) => {
    navigation.navigate('Treatment', { diseaseId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enfermedades</Text>
      </View>

      {diseases.map((disease) => (
        <View key={disease.id} style={styles.diseaseCard}>
          {disease.imagen && (
            <Image source={{ uri: disease.imagen }} style={styles.diseaseImage} />
          )}
          <View style={styles.diseaseInfo}>
            <Text style={styles.diseaseName}>{disease.nombre}</Text>
            <Text style={styles.diseaseDescription}>{disease.descripcion}</Text>
            <TouchableOpacity
              style={styles.treatmentButton}
              onPress={() => handleViewTreatment(disease.id)}
            >
              <Text style={styles.buttonText}>Ver Tratamiento</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  diseaseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFF0',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  diseaseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  diseaseInfo: {
    flex: 1,
    marginLeft: 10,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#228B22',
  },
  diseaseDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  treatmentButton: {
    backgroundColor: '#006400',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiseasesScreen;