document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    try {
        const res = await fetch('https://fura-fila-api-production.up.railway.app/api/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, senha })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'https://6sixfrosty.github.io/Fura-fila/main/';
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
});