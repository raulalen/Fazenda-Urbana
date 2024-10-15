const produtos = [
    { nome: 'Maçã', preco: 2.00 },
    { nome: 'Banana', preco: 1.50 },
    { nome: 'Laranja', preco: 1.80 },
    { nome: 'Tomate', preco: 3.00 },
    { nome: 'Cenoura', preco: 2.50 },
    { nome: 'Pera', preco: 2.20 },      // Novo item
    { nome: 'Manga', preco: 4.00 },     // Novo item
    { nome: 'Kiwi', preco: 3.00 },      // Novo item
    { nome: 'Batata', preco: 1.20 },    // Novo item
    { nome: 'Berinjela', preco: 2.30 }   // Novo item
];

let carrinho = [];
let total = 0;
let compraAtual = null; // Para armazenar a compra que está sendo editada

// Evento para alternar entre abas
document.getElementById('tab1').addEventListener('click', function() {
    showTab('carrinho');
});

document.getElementById('tab2').addEventListener('click', function() {
    showTab('visualizacao');
});

// Função para mostrar a aba 
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Carregar produtos na lista
function carregarProdutos() {
    const produtosList = document.getElementById('produtos');
    produtos.forEach((produto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${produto.nome} - R$ ${produto.preco.toFixed(2)} 
            <div>
                <button onclick="addItem(${index})">+</button>
                <span id="quantidade-${index}" class="quantidade">0</span>
                <button onclick="removeItem(${index})">-</button>
            </div>
        `;
        produtosList.appendChild(li);
    });
}

// Gerar ID aleatório
function gerarIdAleatorio() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Finalizar ou editar compra
function finalizarCompra() {
    const visualizacaoTabelaBody = document.querySelector('#visualizacao-tabela tbody');

    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de finalizar a compra.');
        return;
    }

    // Se a compra atual já existir, atualiza a linha correspondente
    if (compraAtual) {
        const linhaParaEditar = visualizacaoTabelaBody.querySelector(`tr[data-id="${compraAtual}"]`);
        if (linhaParaEditar) {
            const itensComprados = carrinho.map(item => `${item.nome} (x${item.quantidade})`).join(', ');
            linhaParaEditar.cells[2].innerText = itensComprados;
            total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
            updateTotal();
            updatePrevisaoList();

            // Redefinir a compra atual
            compraAtual = null; // Redefinir para evitar modificações em compras já finalizadas
            restaurarBotaoFinalizar();
            limparCampos(); // Limpar campos após a edição
            return;
        }
    }

    const compraId = gerarIdAleatorio(); // Sempre gerar um novo ID para cada compra
    const dataCompra = new Date().toLocaleDateString('pt-BR');
    const itensComprados = carrinho.map(item => `${item.nome} (x${item.quantidade})`).join(', ');

    // Criar nova linha na tabela de visualização
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>#${compraId}</td>
        <td>${dataCompra}</td>
        <td>${itensComprados}</td>
        <td>
            <button class="acao-button editar" onclick="editarCompra('${compraId}')">Editar</button>
            <button class="acao-button excluir" onclick="excluirCompra('${compraId}')">Excluir</button>
        </td>
    `;
    novaLinha.setAttribute('data-id', compraId);
    visualizacaoTabelaBody.appendChild(novaLinha);

    // Limpar carrinho e total
    carrinho = [];
    total = 0;
    updateTotal();
    updatePrevisaoList();

    // Redefinir quantidades
    produtos.forEach((_, index) => {
        document.getElementById(`quantidade-${index}`).innerText = '0';
    });

    // Restaurar o botão para "Finalizar Compra"
    restaurarBotaoFinalizar();
}

// Função de edição da compra
function editarCompra(id) {
    const visualizacaoTabelaBody = document.querySelector('#visualizacao-tabela tbody');
    const linhaParaEditar = visualizacaoTabelaBody.querySelector(`tr[data-id="${id}"]`);

    if (!linhaParaEditar) {
        alert(`Compra com ID: ${id} não encontrada.`);
        return;
    }

    // Preencher o carrinho com os itens da compra selecionada
    const itens = linhaParaEditar.cells[2].innerText.split(', ');

    carrinho = []; // Limpar o carrinho atual

    itens.forEach(item => {
        const [nome, quantidadeStr] = item.split(' (x');
        const quantidade = parseInt(quantidadeStr);
        const produto = produtos.find(p => p.nome === nome);
        
        if (produto) {
            carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade });
            // Atualizar a quantidade na interface
            const index = produtos.indexOf(produto);
            document.getElementById(`quantidade-${index}`).innerText = quantidade;
        }
    });

    total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    updateTotal();
    updatePrevisaoList();

    // Mudar o botão para "Editar Compra"
    const finalizarButton = document.getElementById('finalizar');
    finalizarButton.innerText = 'Editar Compra';
    finalizarButton.style.backgroundColor = '#ffc107'; // Cor laranja

    // Definir a compra atual
    compraAtual = id;

    // Mostrar a aba de carrinho
    showTab('carrinho');
}

// Função para restaurar o botão de finalizar compra
function restaurarBotaoFinalizar() {
    const finalizarButton = document.getElementById('finalizar');
    finalizarButton.innerText = 'Finalizar Compra';
    finalizarButton.style.backgroundColor = '#007BFF'; // Cor original
}

// Função para limpar campos após a edição
function limparCampos() {
    carrinho = []; // Limpa o carrinho
    total = 0; // Zera o total
    updateTotal(); // Atualiza o total exibido
    updatePrevisaoList(); // Limpa a lista de previsão

    // Redefinir quantidades
    produtos.forEach((_, index) => {
        document.getElementById(`quantidade-${index}`).innerText = '0';
    });
}

// Função de exclusão da compra
function excluirCompra(id) {
    const visualizacaoTabelaBody = document.querySelector('#visualizacao-tabela tbody');
    const linhaParaRemover = visualizacaoTabelaBody.querySelector(`tr[data-id="${id}"]`);
    if (linhaParaRemover) {
        visualizacaoTabelaBody.removeChild(linhaParaRemover);
        alert(`Compra com ID: ${id} excluída com sucesso.`);
    } else {
        alert(`Compra com ID: ${id} não encontrada.`);
    }
}

// Adicionar item ao carrinho
function addItem(index) {
    const produto = produtos[index];
    const quantidadeSpan = document.getElementById(`quantidade-${index}`);

    // Atualizar quantidade no carrinho
    const quantidade = parseInt(quantidadeSpan.innerText) + 1;
    quantidadeSpan.innerText = quantidade;

    // Adicionar ao carrinho
    const itemExistente = carrinho.find(item => item.nome === produto.nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 });
    }

    total += produto.preco;
    updateTotal();
    updatePrevisaoList();
}

// Remover item do carrinho
function removeItem(index) {
    const produto = produtos[index];
    const quantidadeSpan = document.getElementById(`quantidade-${index}`);
    const quantidade = parseInt(quantidadeSpan.innerText);

    if (quantidade > 0) {
        quantidadeSpan.innerText = quantidade - 1;

        // Atualizar carrinho e total
        const itemExistente = carrinho.find(item => item.nome === produto.nome);
        if (itemExistente) {
            itemExistente.quantidade--;
            total -= produto.preco;

            // Remover item do carrinho se a quantidade for 0
            if (itemExistente.quantidade === 0) {
                carrinho = carrinho.filter(item => item.nome !== produto.nome);
            }
        }

        updateTotal();
        updatePrevisaoList();
    }
}

// Atualizar total exibido
function updateTotal() {
    document.getElementById('total').innerText = total.toFixed(2);
}

// Atualizar a lista de previsão
function updatePrevisaoList() {
    const previsaoList = document.getElementById('previsao-list');
    previsaoList.innerHTML = '';

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.nome} - R$ ${item.preco.toFixed(2)} (x${item.quantidade})`;
        previsaoList.appendChild(li);
    });
}

// Carregar produtos ao iniciar
carregarProdutos();
