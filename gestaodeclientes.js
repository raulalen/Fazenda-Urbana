const clienteForm = document.getElementById('clienteForm');
const clienteTableBody = document.querySelector('#clienteTable tbody');
const searchInput = document.getElementById('searchInput');
const filterColumn = document.getElementById('filterColumn');
const successNotification = document.getElementById('successNotification');
const editNotification = document.getElementById('editNotification');
const deleteNotification = document.getElementById('deleteNotification');
const dataNascimentoInput = document.getElementById('dataNascimento');
const submitButton = document.getElementById('submitButton');
let editingRow = null;

// Define a data atual no campo de data de nascimento
document.addEventListener('DOMContentLoaded', function () {
    const hoje = new Date().toISOString().split('T')[0];
    dataNascimentoInput.value = hoje;

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
        default:
            return;
    }
    notification.classList.remove('hidden');
    notification.classList.add('visible');

    setTimeout(function () {
        notification.classList.remove('visible');
        notification.classList.add('hidden');
    }, 3000);
}

// Função para adicionar um novo cliente na tabela
clienteForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const dataNascimento = dataNascimentoInput.value;
    const rua = document.getElementById('rua').value;
    const cep = document.getElementById('cep').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    if (!nomeCompleto || !email || !cpf || !telefone || !dataNascimento || !rua || !cep || !numero || !cidade || !estado) {
        alert('Todos os campos obrigatórios devem ser preenchidos.');
        return;
    }

    if (editingRow) {
        editingRow.innerHTML = 
            `<td data-label="Nome Completo">${nomeCompleto}</td>
            <td data-label="E-mail">${email}</td>
            <td data-label="CPF">${cpf}</td>
            <td data-label="Telefone">${telefone}</td>
            <td data-label="Data de Nascimento">${dataNascimento}</td>
            <td data-label="Rua">${rua}</td>
            <td data-label="CEP">${cep}</td>
            <td data-label="Número">${numero}</td>
            <td data-label="Bairro">${bairro}</td>
            <td data-label="Cidade">${cidade}</td>
            <td data-label="Estado">${estado}</td>
            <td data-label="Ações">
                <button class="editar" onclick="editarCliente(this)">Editar</button>
                <button class="excluir" onclick="excluirCliente(this)">Excluir</button>
            </td>`;

        editingRow = null;
        submitButton.textContent = 'Adicionar Cliente';
        submitButton.classList.remove('edit-button');
        showNotification('edit');
        showTab('visualizacao');
    } else {
        const newRow = document.createElement('tr');
        newRow.innerHTML = 
            `<td data-label="Nome Completo">${nomeCompleto}</td>
            <td data-label="E-mail">${email}</td>
            <td data-label="CPF">${cpf}</td>
            <td data-label="Telefone">${telefone}</td>
            <td data-label="Data de Nascimento">${dataNascimento}</td>
            <td data-label="Rua">${rua}</td>
            <td data-label="CEP">${cep}</td>
            <td data-label="Número">${numero}</td>
            <td data-label="Bairro">${bairro}</td>
            <td data-label="Cidade">${cidade}</td>
            <td data-label="Estado">${estado}</td>
            <td data-label="Ações">
                <button class="editar" onclick="editarCliente(this)">Editar</button>
                <button class="excluir" onclick="excluirCliente(this)">Excluir</button>
            </td>`;

        clienteTableBody.appendChild(newRow);
        clienteForm.reset();
        showNotification('success');
    }
});

// Função para editar um cliente
function editarCliente(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll('td');

    document.getElementById('nomeCompleto').value = cells[0].textContent;
    document.getElementById('email').value = cells[1].textContent;
    document.getElementById('cpf').value = cells[2].textContent;
    document.getElementById('telefone').value = cells[3].textContent;
    document.getElementById('dataNascimento').value = cells[4].textContent;
    document.getElementById('rua').value = cells[5].textContent;
    document.getElementById('cep').value = cells[6].textContent;
    document.getElementById('numero').value = cells[7].textContent;
    document.getElementById('bairro').value = cells[8].textContent;
    document.getElementById('cidade').value = cells[9].textContent;
    document.getElementById('estado').value = cells[10].textContent;

    editingRow = row;

    submitButton.textContent = 'Editar Cliente';
    submitButton.classList.add('edit-button');
    
    showTab('adicionar');
}

// Função para excluir um cliente sem confirmação
function excluirCliente(button) {
    const row = button.parentElement.parentElement;
    clienteTableBody.removeChild(row);
    showNotification('delete');
}

// Função para pesquisar clientes
function pesquisarCliente() {
    const filter = searchInput.value.toUpperCase();
    const selectedColumn = filterColumn.value;
    const rows = clienteTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;

        switch (selectedColumn) {
            case 'nomeCompleto':
                match = cells[0].textContent.toUpperCase().includes(filter);
                break;
            case 'email':
                match = cells[1].textContent.toUpperCase().includes(filter);
                break;
            case 'cpf':
                match = cells[2].textContent.toUpperCase().includes(filter);
                break;
            case 'telefone':
                match = cells[3].textContent.toUpperCase().includes(filter);
                break;
            case 'dataNascimento':
                match = cells[4].textContent.toUpperCase().includes(filter);
                break;
            case 'rua':
                match = cells[5].textContent.toUpperCase().includes(filter);
                break;
            case 'cep':
                match = cells[6].textContent.toUpperCase().includes(filter);
                break;
            case 'numero':
                match = cells[7].textContent.toUpperCase().includes(filter);
                break;
            case 'bairro':
                match = cells[8].textContent.toUpperCase().includes(filter);
                break;
            case 'cidade':
                match = cells[9].textContent.toUpperCase().includes(filter);
                break;
            case 'estado':
                match = cells[10].textContent.toUpperCase().includes(filter);
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
