const { Router } = require('express');
const router = Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'esme123',
    database: 'movil2'
});
// Ruta para obtener todos los pacientes con detalles de usuario
router.get('/info', (req, res) => {
    pool.query('SELECT u.id, u.nombre, u.apellido, u.correo, p.id_paciente, p.edad, p.tipo_sangre, p.enfermedades, p.alergias, p.medicamentos FROM usuarios_registro u INNER JOIN paciente p ON u.id = p.id_paciente', (error, results) => {
        if (error) {
            console.error('Error al obtener los pacientes con detalles de usuario:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los pacientes con detalles de usuario.' });
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
        res.json(results);
    });
});

/// Ruta para actualizar un paciente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { edad, tipo_sangre, enfermedades, alergias, medicamentos } = req.body;
    pool.query(
        'UPDATE Paciente SET edad = ?, tipo_sangre = ?, enfermedades = ?, alergias = ?, medicamentos = ? WHERE id_paciente = ?', 
        [edad, tipo_sangre, enfermedades, alergias, medicamentos, id], 
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
        }
    );
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
    const { nombre, apellido, correo, contrasena } = req.body;
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



// Ruta para eliminar un paciente y su información de usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Consulta SQL para obtener los datos del paciente y su información de usuario
    const query = `
        SELECT u.id AS usuario_id, p.id_paciente 
        FROM usuarios_registro u 
        INNER JOIN paciente p ON u.id = p.id_paciente 
        WHERE p.id_paciente = ?`;

    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener los datos del paciente y su información de usuario:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los datos del paciente y su información de usuario.' });
            return;
        }

        // Verifica si se encontraron datos
        if (results.length === 0) {
            res.status(404).json({ message: 'Paciente no encontrado.' });
            return;
        }

        // Extrae los IDs de usuario y paciente
        const { usuario_id, id_paciente } = results[0];

        // Elimina el paciente
        pool.query('DELETE FROM paciente WHERE id_paciente = ?', [id_paciente], (error, _) => {
            if (error) {
                console.error('Error al eliminar el paciente:', error);
                res.status(500).json({ message: 'Hubo un error al eliminar el paciente.' });
                return;
            }

            // Elimina la información de usuario asociada al paciente
            pool.query('DELETE FROM usuarios_registro WHERE id = ?', [usuario_id], (error, _) => {
                if (error) {
                    console.error('Error al eliminar la información de usuario asociada al paciente:', error);
                    res.status(500).json({ message: 'Hubo un error al eliminar la información de usuario asociada al paciente.' });
                    return;
                }

                // Ambas eliminaciones fueron exitosas
                res.json({ message: 'Paciente y su información de usuario eliminados exitosamente.' });
            });
        });
    });
});




//Funcion de los doctores

// Ruta para obtener todos los doctores
router.get('/doctores', (req, res) => {
    pool.query('SELECT * FROM Doctor', (error, results) => {
        if (error) {
            console.error('Error al obtener los doctores:', error);
            res.status(500).json({ message: 'Hubo un error al obtener los doctores.' });
            return;
        }
        res.json(results);
    });
});

// Ruta para crear un nuevo doctor
router.post('/doctor', (req, res) => {
    const { nombre, apellido, cedula_profesional, correo, contrasena } = req.body;
    pool.query('INSERT INTO Doctor (nombre, apellido, cedula_profesional, correo, contrasena) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, cedula_profesional, correo, contrasena],
        (error, results) => {
            if (error) {
                console.error('Error al crear el doctor:', error);
                res.status(500).json({ message: 'Hubo un error al crear el doctor.' });
                return;
            }
            res.status(200).json({ message: 'Doctor creado exitosamente.', id: results.insertId });
        });
});



module.exports = router;
