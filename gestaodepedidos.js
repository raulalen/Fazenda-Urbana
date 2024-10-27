const produtos = [
    { nome: 'Alface', preco: 2.00 },
    { nome: 'Couve', preco: 1.50 },
    { nome: 'Brócolis', preco: 1.80 },
    { nome: 'Tomate', preco: 3.00 },
    { nome: 'Cenoura', preco: 2.50 },
    { nome: 'Limão', preco: 2.20 },
    { nome: 'Maçã', preco: 4.00 },
    { nome: 'Banana', preco: 3.00 },
    { nome: 'Batata', preco: 1.20 },
    { nome: 'Berinjela', preco: 2.30 }
];

let carrinho = [];
let total = 0;
let compraAtual = null;

// Evento para alternar entre abas
document.getElementById('tab1').addEventListener('click', function() {
    showTab('carrinho');
});

document.getElementById('tab2').addEventListener('click', function() {
    showTab('visualizacao');
    atualizarTabelaVisualizacao(); // Atualiza a tabela ao abrir a aba
});

// Função para mostrar a aba 
function showTab(tabName) {
    // Remover a classe 'active' de todos os conteúdos das abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Adicionar a classe 'active' ao conteúdo da aba atual
    document.getElementById(tabName).classList.add('active');

    // Remover a classe 'active' de todos os botões das abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    // Adicionar a classe 'active' ao botão correspondente à aba atual
    if (tabName === 'carrinho') {
        document.getElementById('tab1').classList.add('active');
    } else if (tabName === 'visualizacao') {
        document.getElementById('tab2').classList.add('active');
    }
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

    if (compraAtual) {
        const linhaParaEditar = visualizacaoTabelaBody.querySelector(`tr[data-id="${compraAtual}"]`);
        if (linhaParaEditar) {
            const itensComprados = carrinho.map(item => `${item.nome} (x${item.quantidade})`).join(', ');
            linhaParaEditar.cells[2].innerText = itensComprados;
            total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
            linhaParaEditar.cells[3].innerText = `R$ ${total.toFixed(2)}`; // Atualiza o valor total
            updateTotal();
            updatePrevisaoList();

            compraAtual = null;
            restaurarBotaoFinalizar();
            limparCampos();
            return;
        }
    }

    const compraId = gerarIdAleatorio();
    const dataCompra = new Date().toLocaleDateString('pt-BR');
    const itensComprados = carrinho.map(item => `${item.nome} (x${item.quantidade})`).join(', ');
    const valorTotal = total.toFixed(2); // Calcula o valor total do pedido

    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>#${compraId}</td>
        <td>${dataCompra}</td>
        <td>${itensComprados}</td>
        <td>R$ ${valorTotal}</td> <!-- Exibe o valor total -->
        <td>
            <button class="acao-button editar" onclick="editarCompra('${compraId}')">Editar</button>
            <button class="acao-button excluir" onclick="excluirCompra('${compraId}')">Excluir</button>
        </td>
    `;
    novaLinha.setAttribute('data-id', compraId);
    visualizacaoTabelaBody.appendChild(novaLinha);

    carrinho = [];
    total = 0;
    updateTotal();
    updatePrevisaoList();

    produtos.forEach((_, index) => {
        document.getElementById(`quantidade-${index}`).innerText = '0';
    });

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

    const itens = linhaParaEditar.cells[2].innerText.split(', ');

    carrinho = [];

    itens.forEach(item => {
        const [nome, quantidadeStr] = item.split(' (x');
        const quantidade = parseInt(quantidadeStr);
        const produto = produtos.find(p => p.nome === nome);
        
        if (produto) {
            carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade });
            const index = produtos.indexOf(produto);
            document.getElementById(`quantidade-${index}`).innerText = quantidade;
        }
    });

    total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    updateTotal();
    updatePrevisaoList();

    const finalizarButton = document.getElementById('finalizar');
    finalizarButton.innerText = 'Editar Compra';
    finalizarButton.style.backgroundColor = '#ffc107';
    

    compraAtual = id;
    showTab('carrinho');
}

// Função para restaurar o botão de finalizar compra
function restaurarBotaoFinalizar() {
    const finalizarButton = document.getElementById('finalizar');
    finalizarButton.innerText = 'Finalizar Compra';
    finalizarButton.style.backgroundColor = '#28a745';
}

// Função para limpar campos após a edição
function limparCampos() {
    carrinho = [];
    total = 0;
    updateTotal();
    updatePrevisaoList();

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

    const quantidade = parseInt(quantidadeSpan.innerText) + 1;
    quantidadeSpan.innerText = quantidade;

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

        const itemExistente = carrinho.find(item => item.nome === produto.nome);
        if (itemExistente) {
            itemExistente.quantidade--;
            total -= produto.preco;

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

// Atualizar lista de previsão
function updatePrevisaoList() {
    const previsaoList = document.getElementById('previsao-list');
    previsaoList.innerHTML = '';

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.nome} - R$ ${item.preco.toFixed(2)} (x${item.quantidade})`;
        previsaoList.appendChild(li);
    });
}

// Função para filtrar a tabela com base na busca e no filtro selecionado
function filtrarTabela() {
    const buscaInput = document.getElementById('busca').value.toLowerCase();
    const filtroSelect = document.getElementById('filtro').value;
    const visualizacaoTabelaBody = document.querySelector('#visualizacao-tabela tbody');

    // Obter todas as linhas da tabela
    const linhas = visualizacaoTabelaBody.querySelectorAll('tr');

    linhas.forEach(linha => {
        const id = linha.cells[0].innerText.toLowerCase();
        const data = linha.cells[1].innerText.toLowerCase();
        const itens = linha.cells[2].innerText.toLowerCase();
        const valor = linha.cells[3].innerText.toLowerCase();

        let textoParaBuscar;
        switch (filtroSelect) {
            case 'id':
                textoParaBuscar = id;
                break;
            case 'data':
                textoParaBuscar = data;
                break;
            case 'itens':
                textoParaBuscar = itens;
                break;
            case 'valor':
                textoParaBuscar = valor;
                break;
            default:
                textoParaBuscar = '';
        }

        // Verificar se a linha deve ser exibida
        if (textoParaBuscar.includes(buscaInput)) {
            linha.style.display = ''; // Exibir linha
        } else {
            linha.style.display = 'none'; // Ocultar linha
        }
    });
}

// Inicializa o sistema ao carregar
window.onload = function() {
    carregarProdutos();
};

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Esconder a sidebar
        mainContent.style.marginLeft = '0'; // Ajustar o conteúdo principal
    } else {
        sidebar.style.left = '0'; // Mostrar a sidebar
        mainContent.style.marginLeft = '150px'; // Ajustar o conteúdo principal
    }
}

// Fechar o menu ao clicar fora dele
window.onclick = function(event) {
    const sidebar = document.querySelector('.sidebar');
    if (!event.target.matches('.menu-icon') && sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Esconder a sidebar
        document.querySelector('.main-content').style.marginLeft = '0'; // Ajustar o conteúdo principal
    }
};

//profile itens
function toggleProfileMenu(event) {
    const profileMenu = document.querySelector('.profile-menu');

    // Alterna a visibilidade do menu de perfil
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    event.stopPropagation(); // Impede a propagação do clique para a janela
}