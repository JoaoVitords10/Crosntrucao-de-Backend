const readline = require('readline-sync');
const controlador = require('./controlador');

function menu() {
    console.log("\n--- MENU DE TAREFAS ---");
    console.log("1. Adicionar tarefa"); 
    console.log("2. Buscar tarefa"); 
    console.log("3. Atualizar tarefa");
    console.log("4. Remover tarefa"); 
    console.log("5. Sair");
}

async function escolherOpcao(opcao) {
    let nome, concluida, tarefa;

    switch (opcao) {
        case '1': 
            nome = readline.question("Digite o nome da tarefa: ");
            await controlador.adicionarTarefa(nome);
            break;
        case '2': 
            nome = readline.question("Digite o nome da tarefa: ");
            tarefa = await controlador.buscarTarefa(nome);
            if (tarefa && tarefa.id) {
                console.log("Tarefa encontrada:", {
                    id: tarefa.id,
                    nome: tarefa.nome,
                    concluida: tarefa.concluida
                });
            } else {
                console.log("Tarefa não encontrada.");
            }
            break;
        case '3': 
            nome = readline.question("Digite o nome da tarefa para atualizar: ");
            concluidaStr = readline.question("A tarefa foi concluída? (true/false): ");
            concluida = (concluidaStr.toLowerCase() === 'true');
            await controlador.atualizarTarefa(nome, concluida);
            break;
        case '4': 
            nome = readline.question("Digite o nome da tarefa para remover: ");
            await controlador.removerTarefa(nome);
            break;
        case '5':
            console.log("Saindo...");
            process.exit(0);
        default:
            console.log("Opção inválida. Tente novamente.");
    }
}

async function main() {
    while (true) {
        menu();
        const opcao = readline.question("Escolha uma opção: ");
        await escolherOpcao(opcao);
    }
}

main();