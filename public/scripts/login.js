const matriculas = [123];
const senha = "oimundo"

document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    console.log(matricula, senha);
    validarLogin(matricula, senha);
});

function validarLogin(n, p) {
    try {
        const matriculaValida = validarMatricula(n, matriculas);

        if (!matriculaValida) {
            throw new Error('Matrícula ou senha invalida');
        } else {
            if (p === senha) {
                window.location.href = 'https://6sixfrosty.github.io/Fura-fila/main/';
                return;
            }
            throw new Error('Matrícula ou senha invalida');
        }

        // continua aqui se for válida...

    } catch (err) {
        alert(err.message);
    }
}


function validarMatricula(a, b) {
    for (let i = 0; i < b.length; i++) {
        if (a == b[i]) {
            return true;
        }
    }
    return false;
}