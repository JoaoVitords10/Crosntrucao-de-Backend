const {conectarDb} = require('./database');
class Tarefa {
    db = null;
    collection = null;

    constructor(nome, concluida = false) {
        this.nome = nome;
        this.concluida = concluida;
        this.id = null; 
    }

    async init() {
        this.db = await conectarDb();
        this.collection = this.db.collection('tarefas');
    }

    async inserir() {
        
        const resultado = await this.collection.insertOne({
            nome: this.nome,
            concluida: this.concluida
        });

        this.id = resultado.insertedId;
        console.log(`Tarefa inserida com o ID: ${this.id}`);
    }

    async alterar() {
        if (!this.id) {
            throw new Error("Execute o método buscar() antes de alterar para definir o ID.");
        }

    await this.collection.updateOne(
            { _id: this.id }, 
            { $set: { nome: this.nome, concluida: this.concluida } }         );
        console.log(`Tarefa ${this.id} alterada.`);
    }

    async deletar() {
        
        await this.collection.deleteOne({ nome: this.nome });
        console.log(`Tarefa "${this.nome}" deletada.`);
    }

    async buscar() {
        
        const resultado = await this.collection.findOne({ nome: this.nome });

            if (resultado) {
            this.id = resultado._id;
            this.nome = resultado.nome;
            this.concluida = resultado.concluida;
            return true; 
        }
        return false; 
    }
}


module.exports = { Tarefa };