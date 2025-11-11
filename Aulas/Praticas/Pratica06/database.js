const {MongoClient} = require('mongodb');
const url = "mongodb+srv://jsilva18_db_user:<db_password>@joaovitords.bkavg2k.mongodb.net/"
const client = new MongoClient(url);

async function conectarDb() {
    try {
        await client.connect(); 
        console.log("Conectado ao MongoDB Atlas!");
        return client.db('agenda'); 
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1); 
    }
}

module.exports = { conectarDb };