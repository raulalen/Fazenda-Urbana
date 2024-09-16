const pedidoForm = document.getElementById('pedidoForm');
const pedidoTableBody = document.querySelector('#pedidoTable tbody');
const searchInput = document.getElementById('searchInput');
const filterColumn = document.getElementById('filterColumn');
const successNotification = document.getElementById('successNotification');
const editNotification = document.getElementById('editNotification');
const deleteNotification = document.getElementById('deleteNotification');
const valorTotalInput = document.getElementById('valorTotal');
const comissaoInput = document.getElementById('comissao');
const submitButton = document.getElementById('submitButton');
let editingRow = null;

// Gera um código aleatório alfanumérico de 5 dígitos
function gerarCodigo() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Define a data atual no campo de data de compra
document.addEventListener('DOMContentLoaded', function () {
    // Exibe a aba de visualização por padrão
    showTab('adicionar');
});

// Função para mostrar a notificação de sucesso
function showNotification(type) {
    let notification;
    switch(type) {
        case 'success':
            notification = successNotification;
            break;
        case 'edit':
            notification = editNotification;
            break;
        case 'delete':
            notification = deleteNotification;
            break;
    }
    notification.classList.remove('hidden');
    notification.classList.add('visible');

    // Esconde a notificação automaticamente após 3 segundos
    setTimeout(function () {
        notification.classList.remove('visible');
        notification.classList.add('hidden');
    }, 3000);
}

// Formatação do valor total e cálculo da comissão
valorTotalInput.addEventListener('input', function () {
    let valor = valorTotalInput.value.replace('R$', '').trim(); // Remove o 'R$' antes de formatar

    // Remove qualquer caractere que não seja número, vírgula ou ponto
    valor = valor.replace(/[^\d,\.]/g, '');

    // Evita que o usuário insira mais de uma vírgula ou ponto
    if ((valor.match(/,/g) || []).length > 1 || (valor.match(/\./g) || []).length > 1) {
        valor = valor.slice(0, -1); // Remove o último caractere inválido
    }

    // Converte para número após a formatação, mas não altera o campo enquanto o usuário digita
    const valorNumerico = parseFloat(valor.replace(',', '.'));

    // Verifica se o valor é válido e se é um número
    if (!isNaN(valorNumerico)) {
        calcularComissao(valorNumerico);
    }

    // Mantém o valor sem formatação de moeda, mas com 'R$' no início
    valorTotalInput.value = `R$ ${valor}`;
});

// Calcula a comissão automaticamente (5% do valor total)
function calcularComissao(valorTotal) {
    const comissao = valorTotal * 0.05;
    comissaoInput.value = `R$ ${comissao.toFixed(2).replace('.', ',')}`;
}

// Função para adicionar um novo pedido na tabela
pedidoForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = gerarCodigo();
    const dataCompra = new Date().toISOString().split('T')[0]; // Data de hoje
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const valorTotal = valorTotalInput.value;
    const cliente = document.getElementById('cliente').value;
    const vendedor = document.getElementById('vendedor').value;
    const comissao = comissaoInput.value;

    if (editingRow) {
        // Atualiza a linha existente
        editingRow.innerHTML = 
            `<td data-label="Código">${codigo}</td>
            <td data-label="Data da Compra">${dataCompra}</td>
            <td data-label="Produto">${produto}</td>
            <td data-label="Quantidade">${quantidade}</td>
            <td data-label="Valor Total">${valorTotal}</td>
            <td data-label="Cliente">${cliente}</td>
            <td data-label="Vendedor">${vendedor}</td>
            <td data-label="Comissão">${comissao}</td>
            <td data-label="Ações">
                <button class="editar" onclick="editarPedido(this)">Editar</button>
                <button class="excluir" onclick="excluirPedido(this)">Excluir</button>
            </td>`;

        // Limpa a variável de edição
        editingRow = null;
        submitButton.textContent = 'Adicionar Pedido';
        submitButton.classList.remove('edit-button');
        showNotification('edit');
        showTab('visualizacao');
    } else {
        // Adiciona uma nova linha
        const newRow = document.createElement('tr');
        newRow.innerHTML = 
            `<td data-label="Código">${codigo}</td>
            <td data-label="Data da Compra">${dataCompra}</td>
            <td data-label="Produto">${produto}</td>
            <td data-label="Quantidade">${quantidade}</td>
            <td data-label="Valor Total">${valorTotal}</td>
            <td data-label="Cliente">${cliente}</td>
            <td data-label="Vendedor">${vendedor}</td>
            <td data-label="Comissão">${comissao}</td>
            <td data-label="Ações">
                <button class="editar" onclick="editarPedido(this)">Editar</button>
                <button class="excluir" onclick="excluirPedido(this)">Excluir</button>
            </td>`;

        pedidoTableBody.appendChild(newRow);
        pedidoForm.reset();
        showNotification('success');
    }
});

// Função para editar um pedido
function editarPedido(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll('td');

    document.getElementById('codigo').value = cells[0].textContent;
    document.getElementById('dataCompra').value = cells[1].textContent;
    document.getElementById('produto').value = cells[2].textContent;
    document.getElementById('quantidade').value = cells[3].textContent;
    document.getElementById('valorTotal').value = cells[4].textContent.replace('R$', '').trim().replace(',', '.');
    document.getElementById('cliente').value = cells[5].textContent;
    document.getElementById('vendedor').value = cells[6].textContent;

    const valorTotal = parseFloat(cells[4].textContent.replace('R$', '').trim().replace(',', '.'));
    calcularComissao(valorTotal);

    // Define a linha que está sendo editada
    editingRow = row;

    // Atualiza o botão para edição
    submitButton.textContent = 'Editar Pedido';
    submitButton.classList.add('edit-button');
    
    showTab('adicionar');
}

// Função para excluir um pedido sem confirmação
function excluirPedido(button) {
    const row = button.parentElement.parentElement;
    pedidoTableBody.removeChild(row);
    showNotification('delete');
}

// Função para pesquisar pedidos
function pesquisarPedido() {
    const filter = searchInput.value.toUpperCase();
    const selectedColumn = filterColumn.value;
    const rows = pedidoTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;

        switch (selectedColumn) {
            case 'codigo':
                match = cells[0].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'dataCompra':
                match = cells[1].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'produto':
                match = cells[2].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'quantidade':
                match = cells[3].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'valorTotal':
                match = cells[4].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'cliente':
                match = cells[5].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'vendedor':
                match = cells[6].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'comissao':
                match = cells[7].textContent.toUpperCase().indexOf(filter) > -1;
                break;
        }

        rows[i].style.display = match ? '' : 'none';
    }
}

// Função para mostrar uma aba
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.id === tabId) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('onclick').includes(tabId));
    });
}
