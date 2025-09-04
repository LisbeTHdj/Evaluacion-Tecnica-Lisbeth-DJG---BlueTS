<template>
  <div id="app">
    <header>
      <h1>To Do List "Lisbeth DJG"</h1>
      <p>Aplicación desarrollada con Vue.js + Node.js + MongoDB</p>
    </header>

    <main class="main-content">
      <!-- Formulario -->
      <section class="form-section">
        <div class="form-container">
          <h2>{{ editandoId ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
          
          <form @submit.prevent="crearTodo">
            <div>
              <label for="titulo">Título:</label>
              <input 
                type="text"
                id="titulo"
                v-model="titulo"
                placeholder="Ingresa el título de la tarea"
                required 
              />
            </div>

            <div>
              <label for="contenido">Contenido:</label>
              <textarea 
                id="contenido"
                v-model="contenido"
                placeholder="Describe tu tarea..."
                rows="3"
                required
              />
            </div>

            <div>
              <label for="fecha">Fecha:</label>
              <input 
                type="date"
                id="fecha"
                v-model="fecha"
              />
            </div>

            <div class="form-buttons">
              <button type="submit">
                {{ editandoId ? 'Actualizar' : 'Crear' }} Tarea
              </button>
              <button v-if="editandoId" type="button" @click="cancelarEdicion">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Lista de tareas -->
      <section class="todos-section">
        <div class="todos-container">
          <h2>Mis Tareas ({{ todos.length }})</h2>
          
          <p v-if="todos.length === 0"> ¡No hay tareas! Crea tu primera tarea arriba.</p>
          
          <div v-else class="todos-list">
            <div 
              v-for="todo in todos" 
              :key="todo._id" 
              :class="['todo-item', { completed: todo.completado }]"
            >
              <div class="todo-header">
                <h3 :class="{ 'completed-text': todo.completado }">
                  {{ todo.titulo }}
                </h3>
                <span class="todo-date">
                  {{ formatearFecha(todo.fecha) }}
                </span>
              </div>
              
              <div class="todo-content">
                <p :class="{ 'completed-text': todo.completado }">
                  {{ todo.contenido }}
                </p>
              </div>

              <div class="todo-actions">
                <button 
                  @click="cambiarEstado(todo._id)"
                  :class="['btn-toggle', todo.completado ? 'completed' : '']"
                >
                  {{ todo.completado ? 'Completado' : ' Pendiente' }}
                </button>
                
                <button 
                  @click="editarTodo(todo)"
                  class="btn-edit"
                  :disabled="todo.completado"
                >
                   Editar
                </button>
                
                <button 
                  @click="eliminarTodo(todo._id)"
                  class="btn-delete"
                >
                   Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      todos: [],
      titulo: '',
      contenido: '',
      fecha: '',
      editandoId: null
    };
  },
  mounted() {
    this.cargarTodos();
  },
  methods: {
    async cargarTodos() {
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        this.todos = response.data;
      } catch (error) {
        alert('Error al cargar tareas');
      }
    },

    async crearTodo() {
      if (!this.titulo || !this.contenido) {
        alert('Título y contenido son obligatorios');
        return;
      }

      try {
        let fechaFinal;
        if (this.fecha) {
          // Zona horaria 
          fechaFinal = new Date(this.fecha + 'T12:00:00');
        } else {
          fechaFinal = new Date();
        }

        const todoData = {
          titulo: this.titulo,
          contenido: this.contenido,
          fecha: fechaFinal
        };

        if (this.editandoId) {
          // Actualizar
          await axios.put(`http://localhost:5000/api/todos/${this.editandoId}`, todoData);
        } else {
          // Crear nuevo
          await axios.post('http://localhost:5000/api/todos', todoData);
        }
        
        // Limpiar formulario
        this.titulo = '';
        this.contenido = '';
        this.fecha = '';
        this.editandoId = null;
        
        // Recargar lista
        this.cargarTodos();
      } catch (error) {
        alert('Error al guardar tarea');
      }
    },

    editarTodo(todo) {
      this.titulo = todo.titulo;
      this.contenido = todo.contenido;
      // Corregir la fecha para mostrar correctamente en el input
      if (todo.fecha) {
        const fechaObj = new Date(todo.fecha);
        // Ajustar para zona horaria local
        const fechaAjustada = new Date(fechaObj.getTime() + fechaObj.getTimezoneOffset() * 60000);
        this.fecha = fechaAjustada.toISOString().split('T')[0];
      } else {
        this.fecha = '';
      }
      this.editandoId = todo._id;
    },

    async eliminarTodo(id) {
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        try {
          await axios.delete(`http://localhost:5000/api/todos/${id}`);
          this.cargarTodos();
        } catch (error) {
          alert('Error al eliminar');
        }
      }
    },

    async cambiarEstado(id) {
      try {
        await axios.patch(`http://localhost:5000/api/todos/${id}/toggle`);
        this.cargarTodos();
      } catch (error) {
        alert('Error al cambiar estado');
      }
    },

    cancelarEdicion() {
      this.titulo = '';
      this.contenido = '';
      this.fecha = '';
      this.editandoId = null;
    },

    formatearFecha(fecha) {
      // formateo de fecha 
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Santo_Domingo'
      });
    }
  }
};
</script>

<style>
/* Reset y estilos base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #333;
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fd79a8, #fdcb6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

header p {
  opacity: 0.7;
  font-size: 1.1rem;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Form section */
.form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(253, 121, 168, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.form-container h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

form {
  display: grid;
  gap: 1.5rem;
}

form > div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-container label {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.form-container input,
.form-container textarea {
  padding: 1rem;
  border: 2px solid #fab1a0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.9);
}

.form-container input:focus,
.form-container textarea:focus {
  outline: none;
  border-color: #fd79a8;
  box-shadow: 0 0 0 3px rgba(253, 121, 168, 0.1);
  transform: translateY(-2px);
}

.form-container textarea {
  resize: vertical;
  min-height: 100px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

/* Buttons */
.form-buttons button,
.todo-actions button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-buttons button[type="submit"] {
  background: linear-gradient(135deg, #fd79a8, #fdcb6e);
  color: white;
  box-shadow: 0 4px 15px rgba(253, 121, 168, 0.4);
}

.form-buttons button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(253, 121, 168, 0.6);
}

.form-buttons button[type="button"] {
  background: #a29bfe;
  color: white;
}

.form-buttons button[type="button"]:hover {
  background: #6c5ce7;
  transform: translateY(-2px);
}

/* Todos section */
.todos-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(253, 203, 110, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.todos-container h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
}

.todos-container > p {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.3rem;
  opacity: 0.8;
}

/* Todos grid */
.todos-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Todo card */
.todo-item {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(250, 177, 160, 0.15);
  border: 1px solid #fab1a0;
  transition: all 0.3s ease;
}

.todo-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(250, 177, 160, 0.25);
}

.todo-item.completed {
  opacity: 0.7;
  background: #d1f2eb;
  border-color: #a3e4d7;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.todo-header h3 {
  color: #333;
  font-size: 1.3rem;
  flex: 1;
  word-break: break-word;
}

.todo-date {
  font-size: 0.85rem;
  color: #666;
  background: #ffeaa7;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}

.todo-content {
  margin-bottom: 1.5rem;
}

.todo-content p {
  color: #555;
  line-height: 1.6;
  font-size: 1rem;
}

.completed-text {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Todo actions */
.todo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.todo-actions button {
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
}

.btn-toggle {
  background: #fdcb6e;
  color: #e17055;
}

.btn-toggle.completed {
  background: #55efc4;
  color: #00b894;
}

.btn-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 203, 110, 0.4);
}

.btn-toggle.completed:hover {
  box-shadow: 0 4px 12px rgba(85, 239, 196, 0.4);
}

.btn-edit {
  background: #fd79a8;
  color: white;
}

.btn-edit:hover:not(:disabled) {
  background: #e84393;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 121, 168, 0.4);
}

.btn-edit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #ddd;
  color: #999;
}

.btn-delete {
  background: #fab1a0;
  color: #e17055;
}

.btn-delete:hover {
  background: #e17055;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(250, 177, 160, 0.4);
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  header {
    padding: 1.5rem;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  .todos-list {
    grid-template-columns: 1fr;
  }
  
  .form-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .todo-actions {
    flex-direction: column;
  }
  
  .todo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .form-container,
  .todos-container {
    padding: 1.5rem;
    margin: 0 0.5rem 1rem 0.5rem;
  }
  
  .form-buttons button,
  .todo-actions button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>