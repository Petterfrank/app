import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MoreVertical } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/index.js";

export default function AdminResearcherScreen({ navigation }) {
  const [plantName, setPlantName] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [disease, setDisease] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const scrollViewRef = useRef();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Se necesitan permisos para acceder a la cámara."
        );
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

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setDisease(null);
        setSelection({ x: 0, y: 0, width: 0, height: 0, visible: false });
        setShowConfirmButton(false);
      }
    } catch (error) {
      console.error("Error al tomar foto:", error);
      Alert.alert(
        "Error",
        "No se pudo tomar la foto. Por favor intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectDisease = useCallback(() => {
    if (!imageUri) {
      Alert.alert("Error", "Primero debes tomar una foto.");
      return;
    }

    if (!selection.visible) {
      Alert.alert(
        "Error",
        "Por favor selecciona el área afectada en la imagen."
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setDisease({
        name: "Moho gris",
        description: "Infección fúngica que afecta las hojas y tallos.",
        affectedArea: selection,
      });
      setIsLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  }, [imageUri, selection]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_role",
        "user_id",
      ]);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión correctamente");
    }
  };

  const savePlantData = async () => {
    if (!plantName || !imageUri) {
      Alert.alert("Error", "Nombre e imagen son campos obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      const [userId, token] = await Promise.all([
        AsyncStorage.getItem("user_id"),
        AsyncStorage.getItem("access_token"),
      ]);

      if (!userId || !token) {
        throw new Error("No se encontraron credenciales de usuario");
      }

      const filename = imageUri.split("/").pop();
      const extension = filename.split(".").pop() || "jpg";
      const uniqueFilename = `planta_${Date.now()}.${extension}`;

      const formData = new FormData();
      formData.append("Nombre", plantName.trim());
      if (species) formData.append("Especie", species.trim());
      if (location) formData.append("Ubicacion", location.trim());
      formData.append("usuario", userId);

      // Agregar imagen con el área afectada marcada
      formData.append("imagen", {
        uri: imageUri,
        name: uniqueFilename,
        type: `image/${extension === "jpg" ? "jpeg" : extension}`,
      });

      const response = await api.post("/plantas/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.message) {
        Alert.alert("Éxito", response.data.message);
        // Resetear formulario
        setPlantName("");
        setSpecies("");
        setLocation("");
        setImageUri(null);
        setDisease(null);
        setSelection({ x: 0, y: 0, width: 0, height: 0, visible: false });
      }
      Alert.alert(
        "✅ Guardado exitoso",
        `Planta "${plantName}" registrada correctamente\n\n${
          response.data.message || ""
        }`,
        [
          {
            text: "Aceptar",
            onPress: () =>
              scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
          },
        ]
      );
    } catch (error) {
      console.error("Error:", {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert(
        "Error",
        error.response?.data?.error || error.message || "Error al guardar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Modo Investigador (Admin)</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MoreVertical size={24} color="white" />
        </TouchableOpacity>
      </View>

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
                navigation.navigate("Admin");
              }}
            >
              <Text style={styles.menuItemText}>Volver al Panel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuItemText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre de la planta*:</Text>
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

            <TouchableOpacity
              style={styles.button}
              onPress={takePhoto}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Tomar Foto*</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoad={(e) => {
                      const { width, height } = e.nativeEvent.source;
                      setImageLayout({ width, height });
                    }}
                  />
                  {selection.visible && (
                    <View
                      style={[
                        styles.selectionBox,
                        {
                          left: selection.x,
                          top: selection.y,
                          width: selection.width,
                          height: selection.height,
                        },
                      ]}
                    >
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
                        visible: true,
                      });
                      setShowConfirmButton(false);
                    }}
                    onResponderMove={(e) => {
                      const { locationX, locationY } = e.nativeEvent;
                      setSelection((prev) => ({
                        ...prev,
                        width: Math.max(
                          0,
                          Math.min(
                            locationX - prev.x,
                            imageLayout.width - prev.x
                          )
                        ),
                        height: Math.max(
                          0,
                          Math.min(
                            locationY - prev.y,
                            imageLayout.height - prev.y
                          )
                        ),
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
                <Text style={styles.imagePlaceholder}>
                  Aquí aparecerá la imagen
                </Text>
              )}
            </View>

            {showConfirmButton && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  setShowConfirmButton(false);
                  Alert.alert(
                    "Área seleccionada",
                    `Coordenadas: X:${selection.x.toFixed(
                      0
                    )}, Y:${selection.y.toFixed(
                      0
                    )}\nTamaño: ${selection.width.toFixed(
                      0
                    )}x${selection.height.toFixed(0)}`
                  );
                }}
              >
                <Text style={styles.buttonText}>Confirmar selección</Text>
              </TouchableOpacity>
            )}
          </View>

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

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={savePlantData}
            disabled={!plantName || !imageUri || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Guardar Planta</Text>
            )}
          </TouchableOpacity>

          {disease && (
            <View style={styles.diseaseInfo}>
              <Text style={styles.diseaseTitle}>{disease.name}</Text>
              <Text style={styles.diseaseText}>{disease.description}</Text>
              {disease.affectedArea && (
                <Text style={styles.diseaseText}>
                  Área afectada: {disease.affectedArea.width.toFixed(0)}x
                  {disease.affectedArea.height.toFixed(0)} px
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
    backgroundColor: "#F5F5DC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#006400",
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "android" ? 70 : 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    minWidth: 150,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: "#006400",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#FFFFF0",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#8B7765",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    color: "#4d4d4d",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#228B22",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  detectButton: {
    backgroundColor: "#006400",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#8B0000",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageSection: {
    width: "90%",
    alignSelf: "center",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  touchableImageArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  selectionBox: {
    position: "absolute",
    backgroundColor: "rgba(255, 0, 0, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(255, 0, 0, 0.8)",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 2,
  },
  selectionText: {
    color: "white",
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    padding: 2,
    fontSize: 12,
  },
  imagePlaceholder: {
    color: "#666",
    fontSize: 16,
  },
  diseaseInfo: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diseaseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#228B22",
    marginBottom: 8,
  },
  diseaseText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
});
