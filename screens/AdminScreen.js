import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, Platform } from 'react-native'; // Asegúrate de importar Platform
import { MoreVertical } from 'lucide-react-native';
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
  const [menuVisible, setMenuVisible] = useState(false);

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
      <View style={styles.header}>
        <Text style={styles.headerText}>Panel de Administrador</Text>
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

      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Usuario</Text>
            <Button title="Cliente" onPress={() => handleChangeUserType('cliente')} color="#228B22" />
            <Button title="Investigador" onPress={() => handleChangeUserType('investigador')} color="#006400" />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#8B0000" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige suave
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#006400', // Verde oscuro
    padding: 15,
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
  listContainer: {
    padding: 20,
  },
  userItem: {
    backgroundColor: '#2E7D32', // Verde oscuro
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#66BB6A', // Verde claro
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userType: {
    color: '#BDBDBD',
    fontSize: 14,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});