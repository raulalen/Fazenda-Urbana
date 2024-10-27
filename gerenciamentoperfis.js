const profileForm = document.getElementById('profileForm');
const profileTableBody = document.querySelector('#profileTable tbody');
const searchInput = document.getElementById('searchInput');
const filterColumn = document.getElementById('filterColumn');
const successNotification = document.getElementById('successNotification');
const editNotification = document.getElementById('editNotification');
const deleteNotification = document.getElementById('deleteNotification');
const submitButton = document.getElementById('submitButton');
let editingRow = null;

// Exibe a aba de visualização por padrão
showTab('adicionar');

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

// Função para adicionar um novo perfil na tabela
profileForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (editingRow) {
        // Atualiza a linha existente
        editingRow.querySelector('td[data-label="Nome de Usuário"]').textContent = usuario;
        editingRow.querySelector('td[data-label="E-mail"]').textContent = email;
        editingRow.setAttribute('data-senha', senha); // Armazena a senha na linha
        editingRow = null;
        submitButton.textContent = 'Adicionar Perfil';
        submitButton.classList.remove('edit-button');
        showNotification('edit');
        showTab('visualizacao');
    } else {
        // Adiciona uma nova linha sem exibir a senha
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-senha', senha); // Armazena a senha na linha
        newRow.innerHTML = 
            `<td data-label="Nome de Usuário">${usuario}</td>
            <td data-label="E-mail">${email}</td>
            <td data-label="Ações">
                <button class="editar" onclick="editarPerfil(this)">Editar</button>
                <button class="excluir" onclick="excluirPerfil(this)">Excluir</button>
            </td>`;
        
        profileTableBody.appendChild(newRow);
        profileForm.reset();
        showNotification('success');
    }
});

// Função para editar um perfil
function editarPerfil(button) {
    const row = button.parentElement.parentElement;
    const cells = row.querySelectorAll('td');

    document.getElementById('usuario').value = cells[0].textContent;
    document.getElementById('email').value = cells[1].textContent;
    document.getElementById('senha').value = row.getAttribute('data-senha'); // Recupera a senha

    // Define a linha que está sendo editada
    editingRow = row;

    // Atualiza o botão para edição
    submitButton.textContent = 'Editar Perfil';
    submitButton.classList.add('edit-button');
    
    showTab('adicionar');
}

// Função para excluir um perfil sem confirmação
function excluirPerfil(button) {
    const row = button.parentElement.parentElement;
    profileTableBody.removeChild(row);
    showNotification('delete');
}

// Função para pesquisar perfis
function pesquisarPerfil() {
    const filter = searchInput.value.toUpperCase();
    const selectedColumn = filterColumn.value;
    const rows = profileTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;

        switch (selectedColumn) {
            case 'usuario':
                match = cells[0].textContent.toUpperCase().indexOf(filter) > -1;
                break;
            case 'email':
                match = cells[1].textContent.toUpperCase().indexOf(filter) > -1;
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

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Esconder a sidebar
        mainContent.style.marginLeft = '0'; // Ajustar o conteúdo principal
    } else {
        sidebar.style.left = '0'; // Mostrar a sidebar
        mainContent.style.marginLeft = '250px'; // Ajustar o conteúdo principal
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
