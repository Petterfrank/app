import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const initialUsers = [
  { id: '1', name: 'Usuario 1', type: 'cliente' },
  { id: '2', name: 'Usuario 2', type: 'investigador' },
  { id: '3', name: 'Usuario 3', type: 'cliente' },
  { id: '4', name: 'Usuario 4', type: 'investigador' },
];

export default function AdminScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleChangeUserType = (newType) => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, type: newType } : user
    );
    setUsers(updatedUsers);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleEditUser(item)}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userType}>Tipo: {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Panel de Administrador</Text>

      <FlatList data={users} renderItem={renderItem} keyExtractor={(item) => item.id} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Usuario</Text>
            <Button title="Cliente" onPress={() => handleChangeUserType('cliente')} />
            <Button title="Investigador" onPress={() => handleChangeUserType('investigador')} />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#D32F2F" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#046205' },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 50 },
  userItem: {
    backgroundColor: '#04CE03',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  userName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  userType: { color: '#FFFFFF', fontSize: 14 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
