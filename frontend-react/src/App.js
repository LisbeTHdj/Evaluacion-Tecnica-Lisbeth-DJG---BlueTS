import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fecha, setFecha] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    cargarTodos();
  }, []);

  const cargarTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      alert('Error al cargar tareas');
    }
  };

  const crearTodo = async (e) => {
    e.preventDefault();
    
    if (!titulo || !contenido) {
      alert('Título y contenido son obligatorios');
      return;
    }

    try {
      let fechaFinal;
      if (fecha) {
        // Corregir problema de zona horaria agregando las 12:00 al mediodía
        fechaFinal = new Date(fecha + 'T12:00:00');
      } else {
        fechaFinal = new Date();
      }

      const todoData = {
        titulo,
        contenido,
        fecha: fechaFinal
      };

      if (editandoId) {
        // Actualizar
        await axios.put(`http://localhost:5000/api/todos/${editandoId}`, todoData);
      } else {
        // Crear nuevo
        await axios.post('http://localhost:5000/api/todos', todoData);
      }
      
      // Limpiar formulario
      setTitulo('');
      setContenido('');
      setFecha('');
      setEditandoId(null);
      
      // Recargar lista
      cargarTodos();
    } catch (error) {
      alert('Error al guardar tarea');
    }
  };

  const editarTodo = (todo) => {
    setTitulo(todo.titulo);
    setContenido(todo.contenido);
    // Corregir la fecha para mostrar correctamente en el input
    if (todo.fecha) {
      const fechaObj = new Date(todo.fecha);
      // Ajustar para zona horaria local
      const fechaAjustada = new Date(fechaObj.getTime() + fechaObj.getTimezoneOffset() * 60000);
      setFecha(fechaAjustada.toISOString().split('T')[0]);
    } else {
      setFecha('');
    }
    setEditandoId(todo._id);
  };

  const eliminarTodo = async (id) => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      try {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
        cargarTodos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}/toggle`);
      cargarTodos();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const cancelarEdicion = () => {
    setTitulo('');
    setContenido('');
    setFecha('');
    setEditandoId(null);
  };

  // Función para formatear fecha correctamente
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Santo_Domingo'
    });
  };

  return (
    <div className="App">
      <h1>To Do List "Lisbeth DJG"</h1>
      <p>React + Node.js + MongoDB</p>

      {/* Formulario */}
      <div className="form-container">
        <h2>{editandoId ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        
        <form onSubmit={crearTodo}>
          <div>
            <label>Título:</label>
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la tarea"
              required 
            />
          </div>

          <div>
            <label>Contenido:</label>
            <textarea 
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Descripción de la tarea"
              required
            />
          </div>

          <div>
            <label>Fecha:</label>
            <input 
              type="date" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button type="submit">
              {editandoId ? 'Actualizar' : 'Crear'} Tarea
            </button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de tareas */}
      <div className="todos-container">
        <h2>Mis Tareas ({todos.length})</h2>
        
        {todos.length === 0 ? (
          <p>¡No hay tareas! Crea la primera.</p>
        ) : (
          <div className="todos-list">
            {todos.map((todo) => (
              <div 
                key={todo._id} 
                className={`todo-item ${todo.completado ? 'completed' : ''}`}
              >
                <div className="todo-info">
                  <h3>{todo.titulo}</h3>
                  <p>{todo.contenido}</p>
                  <small>
                    Fecha: {formatearFecha(todo.fecha)}
                  </small>
                </div>
                
                <div className="todo-buttons">
                  <button 
                    onClick={() => cambiarEstado(todo._id)}
                    className={todo.completado ? 'btn-completed' : 'btn-pending'}
                  >
                    {todo.completado ? ' Completada' : ' Pendiente'}
                  </button>
                  
                  <button 
                    onClick={() => editarTodo(todo)}
                    disabled={todo.completado}
                  >
                     Editar
                  </button>
                  
                  <button onClick={() => eliminarTodo(todo._id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;