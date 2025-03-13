# 🌱 Aplicación de Detección de Enfermedades en Plantas

---

## 📝 **Instalación y Ejecución**
Sigue estos pasos para instalar y ejecutar la aplicación en tu dispositivo o emulador.

### 1️⃣ **Clonar el repositorio**
```sh
git clone https://github.com/Jared091/app.git
cd app
```

### 2️⃣ **Instalar dependencias**
```sh
npm install
```

### 3️⃣ **Instalar Expo CLI (si no lo tienes instalado)**
```sh
npm install -g expo-cli
```

### 4️⃣ **Ejecutar la aplicación**
```sh
npx expo start
```
Esto abrirá la interfaz de Expo en tu navegador. Desde ahí puedes:  
- **Presionar `w`** para abrir la app en el navegador.  
- **Escanear el código QR** con Expo Go en tu teléfono.  

---

## 💁 **Estructura del Proyecto**
```bash
💚 app/
│-- 📂 assets/            # Imágenes y recursos estáticos
│-- 📂 components/        # Componentes reutilizables
│   ├── LoginForm.js      # Formulario de inicio de sesión
│-- 📂 navigation/        # Configuración de navegación
│   ├── Navigation.js     # Definición de las pantallas y rutas
│-- 📂 screens/           # Pantallas principales de la app
│   ├── ClientScreen.js   # Pantalla del Cliente
│   ├── ResearcherScreen.js # Pantalla del Investigador
│   ├── AdminScreen.js    # Pantalla del Administrador
│   ├── RegisterScreen.js # Pantalla de Registro
│-- 📂 node_modules/      # Dependencias de Node.js (se genera con npm install)
│-- 📄 App.js             # Punto de entrada de la aplicación
│-- 📄 package.json       # Configuración de dependencias y scripts
│-- 📄 README.md          # Documentación del proyecto
```

---

## 🛠 **Tecnologías utilizadas**
- **React Native** - Framework principal  
- **Expo** - Plataforma para desarrollo en React Native  
- **React Navigation** - Manejo de pantallas y navegación  
- **React Native SVG** - Para dibujar el rectángulo en la imagen  
- **Expo Image Picker** - Para tomar fotos o seleccionar imágenes  

### 📆 **Dependencias**
Si necesitas instalar las dependencias manualmente, usa:
```sh
npm install react-native-svg expo-image-picker @react-navigation/native @react-navigation/stack
```


