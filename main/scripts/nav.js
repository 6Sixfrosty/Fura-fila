let paginaAtual = null;

document.addEventListener('DOMContentLoaded', async () => {
    configurarNavegacao();
    await trocarPagina('cardapio');
});

function esperarProximoFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

async function esperarRenderizacao() {
    await esperarProximoFrame();
    await esperarProximoFrame();
}

function obterBotoesNav() {
    return document.querySelectorAll('.menu-btn[data-page]');
}

function obterSecoes() {
    return document.querySelectorAll('main > section[id]');
}

function ocultarTodasPaginas() {
    obterSecoes().forEach(secao => {
        secao.style.display = 'none';
    });
}

function mostrarPagina(idPagina) {
    ocultarTodasPaginas();

    const pagina = document.getElementById(idPagina);
    if (pagina) {
        pagina.style.display = 'block';
        paginaAtual = idPagina;
    }
}

function marcarMenuAtivo(idPagina) {
    obterBotoesNav().forEach(botao => {
        botao.classList.toggle('active', botao.dataset.page === idPagina);
    });
}

async function trocarPagina(idPagina) {
    if (!idPagina) return;

    mostrarPagina(idPagina);
    marcarMenuAtivo(idPagina);

    await esperarRenderizacao();

    switch (idPagina) {
        case 'cardapio':
            if (typeof renderizarCardapio === 'function') {
                await renderizarCardapio();
            }
            break;

        case 'carrinho':
            if (typeof renderizarCarrinho === 'function') {
                await renderizarCarrinho();
            }
            break;

        case 'pedidos':
            if (typeof renderizarPedidos === 'function') {
                await renderizarPedidos();
            }
            break;
    }
}

function configurarNavegacao() {
    obterBotoesNav().forEach(botao => {
        botao.addEventListener('click', async e => {
            e.preventDefault();
            const idPagina = botao.dataset.page;
            await trocarPagina(idPagina);
        });
    });
}