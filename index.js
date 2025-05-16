import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Usuario from './models/usuario.model.js';

dotenv.config();

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexión a MongoDB antes de iniciar el servidor
const uri = process.env.uri; // Asegúrate de que en .env esté "uri=tu_string_de_conexión"

mongoose.connect(uri)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");

    // Iniciar servidor solo después de conectar a la DB
    app.listen(puerto, () => {
      console.log(`Servidor escuchando en http://localhost:${puerto}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Detener la aplicación si no hay conexión a la DB
  });

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a mi API CRUD');
});

app.post('/usuarios', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Ruta para GET /usuarios (¿faltaba esta?)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});