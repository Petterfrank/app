# 🌱 Aplicación de Detección de Enfermedades en Plantas

---

## 📖 **Descripción del Proyecto**
Esta aplicación móvil permite a los usuarios identificar enfermedades en plantas mediante el análisis de imágenes. Los usuarios pueden tomar fotos de las plantas, seleccionar áreas afectadas y recibir información sobre posibles enfermedades y tratamientos. Además, incluye funcionalidades específicas para administradores, investigadores y clientes.

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
│   ├── RegisterScreen.js # Pantalla de registro de usuarios
│   ├── ForgotPassword.js # Recuperación de contraseñas
│   ├── NavBar.js         # Barra de navegación reutilizable
│-- 📂 navigation/        # Configuración de navegación
│   ├── Navigation.js     # Definición de las pantallas y rutas
│-- 📂 screens/           # Pantallas principales de la app
│   ├── cliente/          # Pantallas para clientes
│   │   ├── ClientScreen.js
│   ├── investigador/     # Pantallas para investigadores
│   │   ├── ResearcherScreen.js
│   ├── administrador/    # Pantallas para administradores
│       ├── AdminScreen.js
│       ├── AdminResearcherScreen.js
│       ├── DiseasesScreen.js
│       ├── TreatmentScreen.js
│-- 📂 api/               # Configuración de la API
│   ├── index.js          # Configuración de Axios y autenticación
│-- 📂 styles/            # Estilos globales
│   ├── styles.js
│-- 📄 App.js             # Punto de entrada de la aplicación
│-- 📄 package.json       # Configuración de dependencias y scripts
│-- 📄 README.md          # Documentación del proyecto
```

---

## 🛠 **Tecnologías utilizadas**
- **React Native** - Framework principal para desarrollo móvil.
- **Expo** - Plataforma para desarrollo y ejecución de aplicaciones React Native.
- **React Navigation** - Manejo de pantallas y navegación.
- **Axios** - Cliente HTTP para comunicación con la API.
- **Expo Image Picker** - Para tomar fotos o seleccionar imágenes.
- **AsyncStorage** - Almacenamiento local para tokens y datos de usuario.

---

## 🚀 **Funcionalidades Principales**

### 🔑 **Autenticación**
- **Inicio de sesión**: Los usuarios pueden iniciar sesión con su correo y contraseña.
- **Registro**: Los nuevos usuarios pueden registrarse proporcionando su información.
- **Recuperación de contraseña**: Los usuarios pueden recuperar su contraseña mediante su correo electrónico.

### 🧑‍🌾 **Clientes**
- **Detección de enfermedades**: Los clientes pueden tomar fotos de plantas, seleccionar áreas afectadas y recibir información sobre enfermedades detectadas.
- **Guardar datos de plantas**: Los clientes pueden guardar información sobre las plantas analizadas.

### 🔬 **Investigadores**
- **Modo investigador**: Los investigadores tienen acceso a funcionalidades avanzadas para analizar plantas y detectar enfermedades.

### 🛠 **Administradores**
- **Gestión de usuarios**: Los administradores pueden ver y modificar roles de usuarios.
- **Modo investigador**: Los administradores pueden acceder al modo investigador.
- **Gestión de enfermedades**: Los administradores pueden ver enfermedades registradas y sus tratamientos.

### 📤 **Subida de Imágenes**
La aplicación permite subir imágenes a la API para su análisis. Asegúrate de que el backend esté configurado para recibir imágenes en formato `multipart/form-data`. Si utilizas Expo, instala las siguientes dependencias

```sh
npm install expo-image-picker axios
---

## 📂 **Pantallas y Componentes**

### **Pantallas**
1. **LoginForm.js**: Pantalla de inicio de sesión.
2. **RegisterScreen.js**: Pantalla de registro de usuarios.
3. **ForgotPassword.js**: Pantalla para recuperación de contraseñas.
4. **ClientScreen.js**: Pantalla principal para clientes.
5. **ResearcherScreen.js**: Pantalla principal para investigadores.
6. **AdminScreen.js**: Panel de administración.
7. **AdminResearcherScreen.js**: Modo investigador para administradores.
8. **DiseasesScreen.js**: Listado de enfermedades.
9. **TreatmentScreen.js**: Información sobre tratamientos.

### **Componentes Reutilizables**
- **NavBar.js**: Barra de navegación reutilizable.
- **styles.js**: Estilos globales para la aplicación.

---

## 🌐 **API**
La aplicación se comunica con una API REST alojada en `http://192.168.100.13:8000/api/`.  
### **Endpoints principales:**
- **`/login/`**: Inicio de sesión.
- **`/signup/`**: Registro de usuarios.
- **`/verify-email/`**: Verificación de correo electrónico.
- **`/change-password/`**: Cambio de contraseña.
- **`/plantas/`**: Gestión de datos de plantas.
- **`/enfermedades/`**: Listado de enfermedades.
- **`/tratamientos/`**: Información sobre tratamientos.

---

## 🛡 **Seguridad**
- **Tokens de acceso**: Se utilizan tokens JWT para autenticar las solicitudes.
- **Almacenamiento seguro**: Los tokens se almacenan en `AsyncStorage` y se eliminan al cerrar sesión.

---

## 🛠 **Scripts Disponibles**
En el archivo `package.json`, se encuentran los siguientes scripts:
- **`npm start`**: Inicia el servidor de desarrollo de Expo.
- **`npm run android`**: Ejecuta la aplicación en un emulador o dispositivo Android.
- **`npm run ios`**: Ejecuta la aplicación en un emulador o dispositivo iOS.
- **`npm run web`**: Ejecuta la aplicación en un navegador web.

---

## 🧪 **Pruebas**
Actualmente, no se han implementado pruebas automatizadas. Se recomienda utilizar herramientas como Jest y React Native Testing Library para agregar pruebas unitarias y de integración.

---

## 📄 **Licencia**
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 👨‍💻 **Contribuciones**
Las contribuciones son bienvenidas. Si deseas contribuir, por favor:
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza un pull request con tus cambios.

---

## 📧 **Contacto**
Si tienes preguntas o sugerencias, no dudes en contactarme en [correo@example.com](mailto:correo@example.com).