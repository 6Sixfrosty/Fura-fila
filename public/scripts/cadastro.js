document.querySelector('.cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!nome || !matricula || !senha || !confirmarSenha) {
        alert('Preencha todos os campos.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    try {
        const res = await fetch('https://fura-fila-api-production.up.railway.app/api/Cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, matricula, senha })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'https://6sixfrosty.github.io/Fura-fila/public/index.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
});