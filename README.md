# 🌍 Traductor Universal

Una aplicación web moderna para traducción de texto entre múltiples idiomas, desarrollada con React, TypeScript y Node.js.

## ✨ Características

- **Traducción en tiempo real** entre 12 idiomas diferentes
- **Interfaz moderna y responsive** con diseño glassmorphism
- **API REST robusta** con validaciones y manejo de errores
- **Intercambio rápido de idiomas** con un solo clic
- **Contador de caracteres** en tiempo real
- **Funcionalidad de copiar** texto traducido
- **Diseño responsive** para móviles y tablets
- **Animaciones suaves** y feedback visual

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos con glassmorphism

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Seguridad HTTP
- **Translate** - Biblioteca de traducción

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd traductor
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Ejecución

### Backend
```bash
cd backend
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

### Frontend
```bash
cd frontend
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 📡 Endpoints de la API

### POST `/api/translate`
Traduce texto entre idiomas.

**Body:**
```json
{
  "text": "Hola mundo",
  "from": "es",
  "to": "en"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "Hello world",
  "originalText": "Hola mundo",
  "from": "es",
  "to": "en"
}
```

### GET `/api/languages`
Obtiene la lista de idiomas soportados.

**Response:**
```json
{
  "languages": [
    { "code": "es", "name": "Español" },
    { "code": "en", "name": "English" },
    // ... más idiomas
  ]
}
```

### GET `/health`
Verifica el estado del servidor.

## 🌍 Idiomas Soportados

- 🇪🇸 Español (es)
- 🇺🇸 English (en)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇨🇳 中文 (zh)
- 🇸🇦 العربية (ar)
- 🇮🇳 हिन्दी (hi)

## 🎨 Características de la UI

- **Diseño Glassmorphism** con efectos de blur y transparencia
- **Gradientes modernos** y sombras suaves
- **Animaciones fluidas** en hover y transiciones
- **Responsive design** para todos los dispositivos
- **Feedback visual** para todas las acciones
- **Contador de caracteres** en tiempo real
- **Botones de acción** intuitivos

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Ejecuta el servidor en modo desarrollo
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Ejecuta el servidor compilado

### Frontend
- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (480px - 767px)
- **Small Mobile** (< 480px)

## 🔒 Seguridad

- **CORS configurado** para permitir solo el frontend
- **Helmet.js** para headers de seguridad HTTP
- **Validación de entrada** en todos los endpoints
- **Límite de caracteres** (5000) para prevenir abuso
- **Manejo de errores** robusto

## 🐛 Solución de Problemas

### Error de CORS
Asegúrate de que el backend esté ejecutándose en el puerto 3001 y el frontend en el 5173.

### Error de traducción
Verifica que el texto no exceda 5000 caracteres y que los códigos de idioma sean válidos.

### Problemas de conexión
1. Verifica que ambos servidores estén ejecutándose
2. Revisa la consola del navegador para errores
3. Verifica que no haya conflictos de puertos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado con ❤️ usando React, TypeScript y Node.js.

---

**¡Disfruta traduciendo! 🌍✨** #   T r a d u c t o r  
 