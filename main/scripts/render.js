async function renderizarCardapio() {
    try {
        const itens = await fetchCardapio();
        const tbody = document.querySelector('#cardapio tbody');
        tbody.innerHTML = '';

        itens.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td class="text-center">
                        <div class="qty-control">
                            <button type="button" class="qty-btn">-</button>
                            <span class="qty-value">1</span>
                            <button type="button" class="qty-btn">+</button>
                        </div>
                    </td>
                    <td class="text-center">R$ ${Number(item.valor).toFixed(2)}</td>
                    <td class="text-end">R$ ${Number(item.valor).toFixed(2)}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('[renderizarCardapio]:', error.message);
    }
}

async function renderizarCarrinho() {
    try {
        const itens = await fetchCarrinho();
        const tbody = document.querySelector('#carrinho tbody');
        tbody.innerHTML = '';

        itens.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td class="text-center">${item.quantidade}</td>
                    <td class="text-end">R$ ${Number(item.valor).toFixed(2)}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('[renderizarCarrinho]:', error.message);
    }
}

function mostrarDetalhePedido(pedido) {
    const detalhe = document.getElementById('pedido-detalhe');

    document.getElementById('detalhe-id').textContent = `Pedido #${pedido.id_pedido}`;
    document.getElementById('detalhe-status').textContent = 'Pedido selecionado';
    document.getElementById('detalhe-total').textContent = `R$ ${Number(pedido.valor_total).toFixed(2)}`;
    document.getElementById('detalhe-quantidade').textContent = pedido.quantidade;
    document.getElementById('detalhe-data').textContent = pedido.criado_em;

    detalhe.style.display = 'block';
}

async function renderizarPedidos() {
    try {
        const pedidos = await fetchPedidos();
        const lista = document.querySelector('.pedidos-list');
        const template = document.getElementById('ticket');
        const detalhe = document.getElementById('pedido-detalhe');

        lista.innerHTML = '';
        detalhe.style.display = 'none';

        pedidos.forEach(pedido => {
            const clone = template.content.cloneNode(true);
            const card = clone.querySelector('.pedido-card');

            clone.querySelector('.pedido-id').textContent = `Pedido #${pedido.id_pedido}`;
            clone.querySelector('.pedido-status').textContent = `Criado em ${pedido.criado_em}`;
            clone.querySelector('.pedido-total').textContent = `R$ ${Number(pedido.valor_total).toFixed(2)}`;

            card.addEventListener('click', (e) => {
                e.preventDefault();
                mostrarDetalhePedido(pedido);
            });

            lista.appendChild(clone);
        });
    } catch (error) {
        console.error('[renderizarPedidos]:', error.message);
    }
}