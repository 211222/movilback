const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    port: '3306', // Reemplaza 'tu_puerto' con el puerto real de MySQL si es diferente al predeterminado (3306)
    user: 'root',
    password: '12@3456a',
    database: 'movildentista'
});

// Función para conectar a la base de datos MySQL
async function connect() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }
        console.log('Base de datos conectada');

        connection.release();
    });

    // Cerrar la piscina al finalizar el script
    process.on('SIGINT', () => {
        pool.end((err) => {
            if (err) {
                console.error('Error al cerrar la piscina de conexiones:', err);
                return;
            }
            console.log('Piscina de conexiones cerrada');
            process.exit();
        });
    });
}

module.exports = { connect };
