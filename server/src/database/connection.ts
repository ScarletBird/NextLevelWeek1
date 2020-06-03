import knex from 'knex'; // Query builder
import path from 'path'; // Usado para padronização dos caminhos (windows/apple/linux)

const connection = knex({
    client: 'sqlite3', // Será usado o sqlite3 para a aplicação
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') 
        // __dirname retorna o caminho para o diretório atual
    },
    useNullAsDefault: true // sqlite3 does not support default values and asks to use this format
});

export default connection;