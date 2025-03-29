import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/index.js';

export default function AdminResearcherScreen({ navigation }) {
  const [plantName, setPlantName] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [disease, setDisease] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false
  });
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const scrollViewRef = useRef();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la cámara.');
      }
    };
    
    requestPermissions();
    
    return () => {
      setImageUri(null);
      setDisease(null);
    };
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setDisease(null);
        setSelection({ x: 0, y: 0, width: 0, height: 0, visible: false });
        setShowConfirmButton(false);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectDisease = useCallback(() => {
    if (!imageUri) {
      Alert.alert('Error', 'Primero debes tomar una foto.');
      return;
    }

    if (!selection.visible) {
      Alert.alert('Error', 'Por favor selecciona el área afectada en la imagen.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setDisease({
        name: 'Moho gris',
        description: 'Infección fúngica que afecta las hojas y tallos.',
        affectedArea: selection
      });
      setIsLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  }, [imageUri, selection]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  const savePlantData = async () => {
    if (!plantName || !description || !imageUri || !selection.visible) {
      Alert.alert('Error', 'Por favor complete todos los campos, tome una foto y seleccione el área afectada');
      return;
    }

    setIsLoading(true);
    try {
      // Obtener información del archivo de la imagen
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      
      if (!fileInfo.exists) {
        throw new Error('El archivo de imagen no existe');
      }

      // Obtener el token de autenticación
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Crear el objeto FormData
      const formData = new FormData();
      formData.append('nombre', plantName);
      formData.append('especie', species);
      formData.append('ubicacion', location);
      formData.append('descripcion', description);
      
      // Agregar la imagen como archivo
      formData.append('imagen', {
        uri: imageUri,
        name: 'plant_image.jpg',
        type: 'image/jpeg',
      });
      
      // Agregar datos del área afectada
      formData.append('area_afectada_x', selection.x.toString());
      formData.append('area_afectada_y', selection.y.toString());
      formData.append('area_afectada_width', selection.width.toString());
      formData.append('area_afectada_height', selection.height.toString());

      // Enviar datos al backend
      const response = await api.post('/plantas/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data) {
        Alert.alert('Éxito', 'Planta registrada correctamente');
        // Limpiar el formulario
        setPlantName('');
        setSpecies('');
        setLocation('');
        setDescription('');
        setImageUri(null);
        setDisease(null);
        setSelection({ x: 0, y: 0, width: 0, height: 0, visible: false });
        setShowConfirmButton(false);
      } else {
        throw new Error('Error al guardar la planta');
      }
    } catch (error) {
      console.error('Error al guardar la planta:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar la planta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Modo Investigador (Admin)</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MoreVertical size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Menú desplegable */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Admin');
              }}
            >
              <Text style={styles.menuItemText}>Volver al Panel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLogout}
            >
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Contenido principal */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.keyboardAvoidingView}
        >
          {/* Formulario */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre de la planta:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Tomate" 
              value={plantName} 
              onChangeText={setPlantName} 
              placeholderTextColor="#A7C4A0"
            />
            
            <Text style={styles.label}>Especie:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Solanum lycopersicum" 
              value={species} 
              onChangeText={setSpecies} 
              placeholderTextColor="#A7C4A0"
            />
            
            <Text style={styles.label}>Ubicación:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Jardín trasero" 
              value={location} 
              onChangeText={setLocation} 
              placeholderTextColor="#A7C4A0"
            />
            
            <Text style={styles.label}>Descripción:</Text>
            <TextInput 
              style={[styles.input, styles.multilineInput]} 
              placeholder="Ej. La hoja se ve amarilla..." 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              numberOfLines={3}
              placeholderTextColor="#A7C4A0"
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={takePhoto}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Tomar Foto</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Área de la imagen */}
          <View style={styles.imageContainer}>
            {imageUri ? (
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: imageUri }} 
                  style={styles.image} 
                  resizeMode="contain"
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                  onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setImageLayout({ width, height });
                  }}
                />
                {selection.visible && (
                  <View style={[
                    styles.selectionBox,
                    {
                      left: selection.x,
                      top: selection.y,
                      width: selection.width,
                      height: selection.height
                    }
                  ]}>
                    <Text style={styles.selectionText}>Zona afectada</Text>
                  </View>
                )}
                <View 
                  style={styles.touchableImageArea}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={(e) => {
                    const { locationX, locationY } = e.nativeEvent;
                    setSelection({
                      x: locationX,
                      y: locationY,
                      width: 0,
                      height: 0,
                      visible: true
                    });
                    setShowConfirmButton(false);
                  }}
                  onResponderMove={(e) => {
                    const { locationX, locationY } = e.nativeEvent;
                    setSelection(prev => ({
                      ...prev,
                      width: Math.min(locationX - prev.x, imageLayout.width - prev.x),
                      height: Math.min(locationY - prev.y, imageLayout.height - prev.y)
                    }));
                  }}
                  onResponderRelease={() => {
                    if (selection.width > 10 && selection.height > 10) {
                      setShowConfirmButton(true);
                    } else {
                      setSelection({ ...selection, visible: false });
                    }
                  }}
                />
              </View>
            ) : (
              <Text style={styles.imagePlaceholder}>Aquí aparecerá la imagen</Text>
            )}
          </View>

          {showConfirmButton && (
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                setShowConfirmButton(false);
                Alert.alert(
                  'Área seleccionada', 
                  `Coordenadas: X:${selection.x.toFixed(0)}, Y:${selection.y.toFixed(0)}\nTamaño: ${selection.width.toFixed(0)}x${selection.height.toFixed(0)}`
                );
              }}
            >
              <Text style={styles.buttonText}>Confirmar selección</Text>
            </TouchableOpacity>
          )}

          {/* Botón de detección */}
          <TouchableOpacity 
            style={[styles.button, styles.detectButton]} 
            onPress={detectDisease}
            disabled={!imageUri || isLoading || !selection.visible}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Detectar Enfermedad</Text>
            )}
          </TouchableOpacity>

          {/* Botón para guardar */}
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={savePlantData}
            disabled={!plantName || !description || !imageUri || !selection.visible || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Guardar Planta</Text>
            )}
          </TouchableOpacity>

          {/* Resultados de la detección */}
          {disease && (
            <View style={styles.diseaseInfo}>
              <Text style={styles.diseaseTitle}>{disease.name}</Text>
              <Text style={styles.diseaseText}>{disease.description}</Text>
              {disease.affectedArea && (
                <Text style={styles.diseaseText}>
                  Área afectada: {disease.affectedArea.width.toFixed(0)}x{disease.affectedArea.height.toFixed(0)} px
                </Text>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#006400',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'android' ? 70 : 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#006400',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFF0',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#8B7765',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    color: '#4d4d4d',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#228B22',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  detectButton: {
    backgroundColor: '#006400',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#8B0000',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '90%',
    height: 250,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  touchableImageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  selectionBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectionText: {
    color: 'white',
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 2,
    fontSize: 12,
  },
  imagePlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  diseaseInfo: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 8,
  },
  diseaseText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
});