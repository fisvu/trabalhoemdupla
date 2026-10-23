document.getElementById('formCadastro').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;
    const msgErro = document.getElementById('mensagemErro');

    msgErro.textContent = '';

    // 1. Validação de E-mail (Regex)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        msgErro.textContent = 'Por favor, insira um e-mail válido.';
        return;
    }

    // 2. Validação de CPF
    if (!validarCPF(cpf)) {
        msgErro.textContent = 'CPF inválido. Digite um CPF válido com 11 dígitos.';
        return;
    }

    // 3. Verificação dupla de senha
    if (senha !== confirmaSenha) {
        msgErro.textContent = 'As senhas não coincidem.';
        return;
    }

    // Objeto para enviar para o back-end
    const dadosUsuario = { nome, email, cpf, senha };

    try {
        // Rota da API (ajustar conforme a rota definida pela sua dupla)
        const resposta = await fetch('http://localhost:3000/api/usuarios/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        });

        if (!resposta.ok) {
            const erroData = await resposta.json();
            throw new Error(erroData.mensagem || 'Erro ao realizar o cadastro.');
        }

        alert('Cadastro realizado com sucesso!');
        // Redireciona para o login (index.html)
        window.location.href = 'index.html';

    } catch (erro) {
        // Mensagem de erro amigável na tela
        msgErro.textContent = erro.message;
    }
});

// Função completa de validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}