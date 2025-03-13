import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, PanResponder, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Rect } from 'react-native-svg';

export default function ClientScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [disease, setDisease] = useState(null);
  const [rectangle, setRectangle] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [imageLayout, setImageLayout] = useState(null);
  const { width } = Dimensions.get('window');

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
      setImage(result.assets[0].uri);
      setDisease(null);
      setRectangle(null);
    }
  };

  const detectDisease = () => {
    if (!image) {
      alert('Primero debes tomar una foto.');
      return;
    }

    setDisease({
      name: 'Moho gris',
      description: 'Infección fúngica que afecta las hojas y tallos.',
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (!image || !imageLayout) return;

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
      onPanResponderRelease: () => {
        setStartPos(null);
      },
    })
  ).current;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Cliente</Text>
      </View>

      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la planta:</Text>
            <TextInput style={styles.input} placeholder="Ej. Tomate" value={plantName} onChangeText={setPlantName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción:</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Ej. La hoja se ve amarilla..." value={description} onChangeText={setDescription} multiline />
          </View>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <View style={styles.imageFrame} onLayout={(event) => setImageLayout(event.nativeEvent.layout)} {...panResponder.panHandlers}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.image} />
                <Svg style={StyleSheet.absoluteFill}>
                  {rectangle && (
                    <Rect x={rectangle.x} y={rectangle.y} width={rectangle.width} height={rectangle.height} stroke="red" strokeWidth="3" fill="transparent" />
                  )}
                </Svg>
              </>
            ) : (
              <Text style={styles.placeholderText}>Aquí aparecerá la imagen</Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={detectDisease}>
            <Text style={styles.buttonText}>Detectar Enfermedad</Text>
          </TouchableOpacity>

          {disease && (
            <View style={styles.diseaseInfo}>
              <Text style={styles.diseaseTitle}>{disease.name}</Text>
              <Text style={styles.diseaseText}>{disease.description}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#046205',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#04CE03',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
  },
  scrollView: {
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 80,
  },
  button: {
    backgroundColor: '#088F44',
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
  imageFrame: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#046205',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#777',
    fontSize: 16,
  },
});

