const { Tarefa } = require('./modelo');


    async function adicionarTarefa(nome) {
        const tarefa = new Tarefa(nome);
        await tarefa.init();
        await tarefa.inserir();
    }

async function buscarTarefa(nome) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    await tarefa.buscar();
    return tarefa;
}

async function atualizarTarefa(nome, concluida) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    const encontrou = await tarefa.buscar();

    if (encontrou) {
        tarefa.concluida = concluida;
        await tarefa.alterar();
        console.log(`Tarefa "${nome}" atualizada para concluída: ${concluida}`);
    } else {
        console.log(`Tarefa "${nome}" não encontrada.`);
    }
}

async function removerTarefa(nome) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    const encontrou = await tarefa.buscar();

    if (encontrou) {
        await tarefa.deletar();
    } else {
        console.log(`Tarefa "${nome}" não encontrada.`);
    }
}

    module.exports = {
        adicionarTarefa,
        buscarTarefa,
        atualizarTarefa,
        removerTarefa
    };