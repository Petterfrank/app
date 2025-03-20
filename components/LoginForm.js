import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginForm({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      if (username === 'investigador') {
        navigation.navigate('Researcher');
      } else if (username === 'cliente') {
        navigation.navigate('Client');
      } else if (username === 'admin') {
        navigation.navigate('Admin');
      } else {
        Alert.alert('Error', 'Usuario no válido.');
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Inicio de Sesión</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu usuario"
            placeholderTextColor="#A7C4A0"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#A7C4A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // Beige suave
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
    borderRadius: 50,
  },
  title: {
    color: '#8B7765', // Marrón tierra
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#FFFFF0', // Marfil claro
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#8B7765', // Marrón tierra
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    color: '#9CA88F', // Verde salvia
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D4A76A', // Amarillo mostaza
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
  registerButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#C7875D', // Terracota suave
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
