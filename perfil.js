//profile itens
function toggleProfileMenu(event) {
    const profileMenu = document.querySelector('.profile-menu');

    // Alterna a visibilidade do menu de perfil
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    event.stopPropagation(); // Impede a propagação do clique para a janela
}