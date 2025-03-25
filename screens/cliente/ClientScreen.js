import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput,  TouchableOpacity,  StyleSheet,  Alert,  Image,  KeyboardAvoidingView,  Platform,  ScrollView,  PanResponder,  Dimensions, Modal } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ClientScreen({ navigation }) {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [disease, setDisease] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rectangle, setRectangle] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef();

  // Optimización del PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (!imageUri || !imageLayout) return;
        const touchX = gestureState.x0 - imageLayout.x;
        const touchY = gestureState.y0 - imageLayout.y;
        setStartPos({ x: touchX, y: touchY });
        setRectangle({ x: touchX, y: touchY, width: 0, height: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!startPos || !imageLayout) return;
        const newWidth = gestureState.moveX - imageLayout.x - startPos.x;
        const newHeight = gestureState.moveY - imageLayout.y - startPos.y;
        setRectangle({
          x: startPos.x,
          y: startPos.y,
          width: newWidth > 0 ? newWidth : 0,
          height: newHeight > 0 ? newHeight : 0,
        });
      },
      onPanResponderRelease: () => setStartPos(null),
    })
  ).current;

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la cámara.');
      }
    };
    
    requestPermissions();
    
    // Limpieza al desmontar
    return () => {
      setImageUri(null);
      setDisease(null);
    };
  }, []);

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Reducir calidad para mejor rendimiento
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setDisease(null);
        setRectangle(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsLoading(false);
    }
  };

  const detectDisease = () => {
    if (!imageUri) {
      Alert.alert('Error', 'Primero debes tomar una foto.');
      return;
    }

    // Simulación de detección
    setIsLoading(true);
    setTimeout(() => {
      setDisease({
        name: 'Moho gris',
        description: 'Infección fúngica que afecta las hojas y tallos.',
      });
      setIsLoading(false);
      
      // Desplazamiento automático a la sección de resultados
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cliente</Text>
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
              <Text style={styles.buttonText}>
                {isLoading ? 'Procesando...' : 'Tomar Foto'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Área de la imagen */}
          <View 
            style={styles.imageContainer} 
            onLayout={(event) => setImageLayout(event.nativeEvent.layout)}
            {...panResponder.panHandlers}
          >
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.image} 
                resizeMode="contain"
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
              />
            ) : (
              <Text style={styles.imagePlaceholder}>Aquí aparecerá la imagen</Text>
            )}
          </View>

          {/* Botón de detección */}
          <TouchableOpacity 
            style={[styles.button, styles.detectButton]} 
            onPress={detectDisease}
            disabled={!imageUri || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Analizando...' : 'Detectar Enfermedad'}
            </Text>
          </TouchableOpacity>

          {/* Resultados de la detección */}
          {disease && (
            <View style={styles.diseaseInfo}>
              <Text style={styles.diseaseTitle}>{disease.name}</Text>
              <Text style={styles.diseaseText}>{disease.description}</Text>
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
  image: {
    width: '100%',
    height: '100%',
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