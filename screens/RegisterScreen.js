import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (username && email && password && confirmPassword) {
      if (password === confirmPassword) {
        Alert.alert('Éxito', 'Cuenta creada correctamente.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
      }
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nombre"
          placeholderTextColor="#A7C4A0"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu correo"
          placeholderTextColor="#A7C4A0"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#A7C4A0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirma tu contraseña"
          placeholderTextColor="#A7C4A0"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // Beige suave
  },
  title: {
    color: '#8B7765', // Marrón tierra
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#D4A76A', // Amarillo mostaza
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#C7875D', // Terracota suave
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
});