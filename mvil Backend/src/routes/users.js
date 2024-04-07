const { Router } = require('express');
const router = Router();
const mysql = require('mysql');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12@3456a',
    database: 'movildentista'
});

// Ruta para obtener todos los pacientes
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Paciente', (error, results) => {
        if (error) {
            console.error('Error al obtener los pacientes:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener todos los pacientes
router.get('/', (req, res) => {
    pool.query('SELECT * FROM Paciente', (error, results) => {
        if (error) {
            console.error('Error al obtener los pacientes:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los pacientes.' });
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener un paciente por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM Paciente WHERE id_paciente = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Paciente no encontrado.' });
            return;
        }
        res.json(results[0]);
    });
});

// Ruta para obtener un usuario_paciente_detalles por ID
router.get('/paciente/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM usuarios_registro WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al obtener el paciente.' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Paciente no encontrado.' });
            return;
        }
        res.json(results[0]);
    });
});

// Ruta para crear un nuevo paciente
router.post('/paciente', (req, res) => {
    const { id_usuario_registro, edad, tipo_sangre, enfermedades, alergias, medicamentos } = req.body;
    pool.query('INSERT INTO Paciente (id_usuario_registro, edad, tipo_sangre, enfermedades, alergias, medicamentos) VALUES (?, ?, ?, ?, ?, ?)', 
    [id_usuario_registro, edad, tipo_sangre, enfermedades, alergias, medicamentos], 
    (error, results) => {
        if (error) {
            console.error('Error al crear el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al crear el paciente.' });
            return;
        }
        res.status(200).json({ message: 'Paciente creado exitosamente.', id: results.insertId });
    });
});
// Ruta para crear un nuevo usuario-paciente
router.post('/', (req, res) => {
    const { nombre, apellido, correo, contrasena, } = req.body;
    pool.query('INSERT INTO usuarios_registro (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)', 
    [nombre, apellido, correo, contrasena], 
    (error, results) => {
        if (error) {
            console.error('Error al crear el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al crear el usuario.' });
            return;
        }
        console.log(res);
        res.status(200).json({ message: 'Paciente creado exitosamente.', id: results.insertId ,data: req.body });
    });
});

// Ruta para actualizar un paciente existente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo_electronico, contrasena, edad, tipo_sangre, enfermedades, alergias, medicamentos } = req.body;
    pool.query('UPDATE Paciente SET nombre = ?, apellido = ?, correo_electronico = ?, contrasena = ?, edad = ?, tipo_sangre = ?, enfermedades = ?, alergias = ?, medicamentos = ? WHERE id_paciente = ?', 
    [nombre, apellido, correo_electronico, contrasena, edad, tipo_sangre, enfermedades, alergias, medicamentos, id], 
    (error, results) => {
        if (error) {
            console.error('Error al actualizar el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al actualizar el paciente.' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Paciente no encontrado.' });
            return;
        }
        res.json({ message: 'Paciente actualizado exitosamente.' });
    });
});

// Ruta para eliminar un paciente
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM Paciente WHERE id_paciente = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el paciente:', error);
            res.status(500).json({ message: 'Hubo un error al eliminar el paciente.' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Paciente no encontrado.' });
            return;
        }
        res.json({ message: 'Paciente eliminado exitosamente.' });
    });
});

module.exports = router;
