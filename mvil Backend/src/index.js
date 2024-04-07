const app = require('./app');
const { connect } = require('./database');

async function main() {
    try {
        await connect();
        await app.listen(4000);
        console.log('Server running on port 4000');
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

main();
