import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, PanResponder, Dimensions } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Rect } from 'react-native-svg';

export default function ClienteScreen({ navigation }) {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [disease, setDisease] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rectangle, setRectangle] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const { width } = Dimensions.get('window');
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
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para acceder a la cámara.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDisease(null);
      setRectangle(null);
    }
  };

  const detectDisease = () => {
    if (!imageUri) {
      alert('Primero debes tomar una foto.');
      return;
    }

    setDisease({
      name: 'Moho gris',
      description: 'Infección fúngica que afecta las hojas y tallos.',
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cliente</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MoreVertical size={24} color="white" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.menuItem}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre de la planta:</Text>
          <TextInput style={styles.input} placeholder="Ej. Tomate" value={plantName} onChangeText={setPlantName} />
          
          <Text style={styles.label}>Descripción:</Text>
          <TextInput style={styles.input} placeholder="Ej. La hoja se ve amarilla..." value={description} onChangeText={setDescription} multiline />
          
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer} onLayout={(event) => setImageLayout(event.nativeEvent.layout)} {...panResponder.panHandlers}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
              <Svg style={StyleSheet.absoluteFill}>
                {rectangle && (
                  <Rect
                    x={rectangle.x}
                    y={rectangle.y}
                    width={rectangle.width}
                    height={rectangle.height}
                    stroke="red"
                    strokeWidth="3"
                    fill="transparent"
                  />
                )}
              </Svg>
            </>
          ) : (
            <Text style={styles.imagePlaceholder}>Aquí aparecerá la imagen</Text>
          )}
        </View>

        <TouchableOpacity style={styles.detectButton} onPress={detectDisease}>
          <Text style={styles.buttonText}>Detectar Enfermedad</Text>
        </TouchableOpacity>

        {disease && (
          <View style={styles.diseaseInfo}>
            <Text style={styles.diseaseTitle}>{disease.name}</Text>
            <Text style={styles.diseaseText}>{disease.description}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige suave
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#006400', // Verde oscuro
    paddingTop: Platform.OS === 'android' ? 40 : 15, 
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 5,
    fontSize: 16,
    color: '#004d00',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#FFFFF0', // Marfil claro
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#8B7765', // Marrón tierra
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#4d4d4d',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#228B22', // Verde de bosque
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '90%',
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#666',
  },
  detectButton: {
    backgroundColor: '#006400', // Verde oscuro
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  diseaseInfo: {
    width: '90%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 20,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#228B22',
  },
  diseaseText: {
    fontSize: 16,
    color: '#555',
  },
});