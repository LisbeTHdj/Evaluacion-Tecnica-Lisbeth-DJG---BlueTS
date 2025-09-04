Todo List - Evaluación Técnica
Desarrollado por: Lisbeth De Jesús
Fecha: 4 Septiembre 2025
Evaluación técnica: Aplicación completa con React, Vue.js, Node.js y MongoDB
Descripción
Aplicación completa de lista de tareas (To-Do List) que demuestra el dominio de tecnologías full-stack modernas. El proyecto incluye dos frontends independientes (React y Vue.js) que consumen la misma API REST desarrollada con Node.js y MongoDB.
Tecnologías Utilizadas
Backend

Node.js - Entorno de ejecución de JavaScript
Express.js - Framework web para crear la API REST
MongoDB Atlas - Base de datos NoSQL en la nube
Mongoose - ODM para MongoDB
CORS - Configuración para peticiones cross-origin
dotenv - Gestión de variables de entorno

Frontend React

React 18 - Biblioteca de JavaScript para interfaces de usuario
Axios - Cliente HTTP para peticiones a la API
CSS3 - Estilos modernos con gradientes y colores rosa pastel

Frontend Vue.js

Vue 3 - Framework progresivo de JavaScript
Axios - Cliente HTTP para peticiones a la API
CSS3 - Estilos modernos con gradientes y colores pastel

Funcionalidades
Cada tarea (To-Do) incluye:

Título (obligatorio)
Contenido (obligatorio)
Fecha (opcional, por defecto fecha actual)
Estado (pendiente/completado)

Operaciones disponibles:

Crear nuevas tareas
Leer/Visualizar todas las tareas
Modificar tareas existentes
Eliminar tareas con confirmación
Marcar como completada o cambiar a pendiente
Validaciones de campos obligatorios
Interfaz responsiva para móviles y desktop

Estructura del Proyecto
evaluacion-tecnica-lisbeth/
├── backend/                 # API REST con Node.js + Express + MongoDB
│   ├── server.js           # Servidor principal con todas las rutas
│   ├── package.json        # Dependencias del backend
│   └── .env               # Variables de entorno (MongoDB URI)
├── frontend-react/         # Aplicación React
│   ├── src/
│   │   ├── App.js         # Componente principal React
│   │   └── App.css        # Estilos rosa pastel
│   └── package.json       # Dependencias React
├── frontend-vue/           # Aplicación Vue.js  
│   ├── src/
│   │   └── App.vue        # Componente principal Vue
│   └── package.json       # Dependencias Vue
└── README.md              # Documentación del proyecto
Prerrequisitos

Node.js (versión 16 o superior)
npm (viene con Node.js)
Conexión a internet para MongoDB Atlas

Instrucciones de Instalación y Ejecución
1. Clonar el repositorio
bashgit clone https://github.com/LisbeTHdj/Evaluacion-Tecnica-Lisbeth-DJG---BlueTS.git
cd evaluacion-tecnica-lisbeth
2. Configurar y ejecutar el Backend
bash# Navegar al backend
cd backend

# Instalar dependencias
npm install

# El archivo .env ya está configurado con MongoDB Atlas
# Ejecutar en modo desarrollo
npm run dev
El servidor estará disponible en: http://localhost:5000
3. Ejecutar Frontend React
bash# Nueva terminal - navegar a React
cd frontend-react

# Instalar dependencias
npm install

# Ejecutar aplicación
npm start
React estará disponible en: http://localhost:3000
4. Ejecutar Frontend Vue.js
bash# Nueva terminal - navegar a Vue
cd frontend-vue

# Instalar dependencias
npm install

# Ejecutar aplicación
npm run dev
Vue.js estará disponible en: http://localhost:5173
URLs de la Aplicación

Backend API: http://localhost:5000/api/health
React Frontend: http://localhost:3000
Vue.js Frontend: http://localhost:5173

API Endpoints
MétodoEndpointDescripciónGET/api/todosObtener todas las tareasGET/api/todos/:idObtener tarea específicaPOST/api/todosCrear nueva tareaPUT/api/todos/:idActualizar tarea completaPATCH/api/todos/:id/toggleCambiar estado completadoDELETE/api/todos/:idEliminar tarea
Estructura de datos:
json{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "titulo": "Completar evaluación técnica",
  "contenido": "Terminar la aplicación con React, Vue, Node.js y MongoDB",
  "fecha": "2024-09-06T12:00:00.000Z",
  "completado": false,
  "createdAt": "2024-09-04T10:00:00.000Z",
  "updatedAt": "2024-09-04T10:00:00.000Z"
}
Características Técnicas
Backend (Node.js + MongoDB)

API REST completa con Express.js
Conexión a MongoDB Atlas (base de datos en la nube)
Manejo de errores y validaciones
CORS configurado para desarrollo
Corrección de zona horaria para fechas

Frontend React

Componentes funcionales con Hooks
Estado local con useState y useEffect
Formularios controlados
Manejo de peticiones HTTP con Axios
Diseño con colores rosa pastel

Frontend Vue.js

Composition API con Options API
Reactividad de datos con v-model
Directivas Vue (v-for, v-if, v-show)
Manejo de eventos con @click
Diseño con colores pastel diferenciados

Diferencias Visuales

React: Paleta de colores rosa pastel suave
Vue.js: Paleta de colores pastel naranja-rosa-amarillo
Ambas: Misma funcionalidad y estructura, diferente identidad visual

Pruebas
Verificar Backend:
bash# Probar que la API responde
curl http://localhost:5000/api/health
Verificar Frontends:

Abrir React en http://localhost:3000
Abrir Vue.js en http://localhost:5173
Crear tareas en ambas aplicaciones
Verificar que comparten la misma base de datos

Conventional Commits
Este proyecto utiliza conventional commits para mantener un historial claro:
bashfeat: add todo creation functionality
feat: implement todo editing and deletion  
feat: add toggle completed status
fix: resolve timezone issues with dates
style: implement pink pastel color scheme
docs: create comprehensive documentation
refactor: improve error handling
Solución de Problemas
Error de conexión MongoDB:

Verificar conexión a internet
La URI de MongoDB Atlas está preconfigurada

Puerto ocupado:
bash# Verificar procesos en puertos
netstat -ano | findstr :5000
netstat -ano | findstr :3000  
netstat -ano | findstr :5173
CORS Error:

Verificar que el backend esté corriendo en puerto 5000
Reiniciar los servidores si es necesario

Información del Desarrollador
Lisbeth De Jesús
Evaluación técnica desarrollada con:

React.js para frontend moderno
Vue.js para demostrar versatilidad
Node.js + Express para backend robusto
MongoDB Atlas para persistencia de datos

Fecha de desarrollo: 4Septiembre 2025
Entrega: Sábado 6 de septiembre, 11:30 AM

Notas de Evaluación
Este proyecto demuestra:

Dominio completo de React y Vue.js
Desarrollo de APIs REST con Node.js
Integración con bases de datos MongoDB
Manejo de estados y peticiones HTTP
Diseño responsivo y experiencia de usuario
Conventional commits y documentación profesional
Estructura de proyecto organizada y escalable