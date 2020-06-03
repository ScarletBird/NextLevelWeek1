import path from 'path'; // Usado para padronização dos caminhos (windows/apple/linux)

module.exports = {
    client: 'sqlite3', // Será usado o sqlite3 para a aplicação
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') 
        // __dirname retorna o caminho para o diretório atual
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true // sqlite3 does not support default values and asks to use this format
};