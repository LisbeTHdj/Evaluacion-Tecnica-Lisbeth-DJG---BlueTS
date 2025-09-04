const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB - Base de datos: EvaluacionTecnicaLisbeth
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/EvaluacionTecnicaLisbeth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB Atlas - Proyecto: Evaluacion Tecnica Lisbeth');
});

// Esquema del Todo
const todoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  contenido: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  completado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

// Rutas de la API

// GET - Obtener todos los todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los todos' });
  }
});

// GET - Obtener un todo por ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo no encontrado' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el todo' });
  }
});

// POST - Crear nuevo todo
app.post('/api/todos', async (req, res) => {
  try {
    const { titulo, contenido, fecha } = req.body;
    
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    }

    const nuevoTodo = new Todo({
      titulo,
      contenido,
      fecha: fecha || new Date()
    });

    const todoGuardado = await nuevoTodo.save();
    res.status(201).json(todoGuardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el todo' });
  }
});

// PUT - Actualizar todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { titulo, contenido, fecha, completado } = req.body;
    
    const todoActualizado = await Todo.findByIdAndUpdate(
      req.params.id,
      { titulo, contenido, fecha, completado },
      { new: true, runValidators: true }
    );

    if (!todoActualizado) {
      return res.status(404).json({ error: 'Todo no encontrado' });
    }

    res.json(todoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el todo' });
  }
});

// PATCH - Marcar como completado/no completado
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo no encontrado' });
    }

    todo.completado = !todo.completado;
    const todoActualizado = await todo.save();
    
    res.json(todoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

// DELETE - Eliminar todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todoEliminado = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todoEliminado) {
      return res.status(404).json({ error: 'Todo no encontrado' });
    }

    res.json({ mensaje: 'Todo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el todo' });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    mensaje: 'API funcionando correctamente',
    proyecto: 'Evaluacion Tecnica Lisbeth',
    baseDatos: 'EvaluacionTecnicaLisbeth'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Proyecto: Evaluacion Tecnica Lisbeth`);
});