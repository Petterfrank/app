import React from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from "react-native";

// Componente NavBar que puede ser reutilizado en otras pantallas
const NavBar = ({ title, onLogout, navigation }) => {
  return (
    <View style={styles.container}>
      {/* Establecer el color de la barra de notificaciones según el color de fondo de la nav */}
      <StatusBar barStyle="light-content" backgroundColor="#088F44" />

      <View style={styles.navBar}>
        {/* Título de la barra de navegación */}
        <Text style={styles.navTitle}>{title}</Text>
        
        {/* Botón de Cerrar Sesión */}
        {onLogout && (
          <TouchableOpacity style={styles.navButton} onPress={onLogout}>
            <Text style={styles.navButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: "#088F44", // Color de fondo para la barra de navegación
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 5, // Sombra para el efecto de la barra de navegación
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  navButton: {
    padding: 10,
    backgroundColor: "#D32F2F", // Color del botón (rojo para cerrar sesión)
    borderRadius: 5,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default NavBar;
