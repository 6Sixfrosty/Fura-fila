async function renderizarPerfilAluno() {
    try {
        const perfil = await fetchPerfil();

        const nomeEl = document.getElementById('student-name');
        const matriculaEl = document.getElementById('student-matricula');

        if (nomeEl) {
            nomeEl.textContent = perfil.nome;
        }

        if (matriculaEl) {
            matriculaEl.textContent = perfil.matricula;
        }
    } catch (error) {
        console.error('[renderizarPerfilAluno]:', error.message);
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

function obterFormaPagamentoSelecionada() {
    const selecionado = document.querySelector('input[name="forma_pagamento"]:checked');
    return selecionado ? selecionado.value : 'Dinheiro';
}

function renderizarBlocoPagamento(totalGeral) {
    const container = document.getElementById('pagamento-container');
    const template = document.getElementById('pagamento-template');

    container.innerHTML = '';

    const clone = template.content.cloneNode(true);
    container.appendChild(clone);

    const totalEl = document.getElementById('total-geral-carrinho');
    totalEl.textContent = `R$ ${totalGeral.toFixed(2)}`;

    const btnFinalizar = document.getElementById('btn-finalizar-pedido');

    btnFinalizar.addEventListener('click', async () => {
        const forma_pagamento = obterFormaPagamentoSelecionada();

        alert(`Pagamento selecionado: ${forma_pagamento}\nTotal geral: R$ ${totalGeral.toFixed(2)}\n\nPróximo passo: ligar esse botão ao backend de finalizar pedido.`);
    });
}

async function renderizarCardapio() {
    try {
        const itens = await fetchCardapio();
        const tbody = document.querySelector('#cardapio tbody');
        tbody.innerHTML = '';

        itens.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.idCardapio = item.id_cardapio;
            tr.dataset.valor = item.valor;
            tr.dataset.estoque = item.quantidade_atual;

            tr.innerHTML = `
                <td>${item.nome}</td>
                <td class="text-center">${item.quantidade_atual}</td>
                <td class="text-center">
                    <div class="qty-control">
                        <button type="button" class="qty-btn btn-menor">-</button>
                        <span class="qty-value">1</span>
                        <button type="button" class="qty-btn btn-maior">+</button>
                    </div>
                </td>
                <td class="text-center">R$ ${Number(item.valor).toFixed(2)}</td>
                <td class="text-end total-item">R$ ${Number(item.valor).toFixed(2)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-primary btn-adicionar">
                        Adicionar
                    </button>
                </td>
            `;

            const btnMenor = tr.querySelector('.btn-menor');
            const btnMaior = tr.querySelector('.btn-maior');
            const qtyValue = tr.querySelector('.qty-value');
            const totalItem = tr.querySelector('.total-item');
            const btnAdicionar = tr.querySelector('.btn-adicionar');

            function atualizarLinha(novaQuantidade) {
                const estoque = Number(tr.dataset.estoque);
                const valor = Number(tr.dataset.valor);

                if (novaQuantidade < 1) novaQuantidade = 1;
                if (novaQuantidade > estoque) novaQuantidade = estoque;

                qtyValue.textContent = novaQuantidade;
                totalItem.textContent = `R$ ${(valor * novaQuantidade).toFixed(2)}`;
            }

            btnMenor.addEventListener('click', () => {
                const atual = Number(qtyValue.textContent);
                atualizarLinha(atual - 1);
            });

            btnMaior.addEventListener('click', () => {
                const atual = Number(qtyValue.textContent);
                atualizarLinha(atual + 1);
            });

            btnAdicionar.addEventListener('click', async () => {
                try {
                    const quantidade = Number(qtyValue.textContent);
                    const id_cardapio = Number(tr.dataset.idCardapio);

                    await adicionarAoCarrinho(id_cardapio, quantidade);
                    alert('Item adicionado ao carrinho com sucesso!');
                    await renderizarCarrinho();
                } catch (error) {
                    alert(error.message);
                }
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('[renderizarCardapio]:', error.message);
    }
}

async function renderizarCarrinho() {
    try {
        const itens = await fetchCarrinho();
        const tbody = document.querySelector('#carrinho tbody');
        const pagamentoContainer = document.getElementById('pagamento-container');

        tbody.innerHTML = '';
        pagamentoContainer.innerHTML = '';

        let totalGeral = 0;

        itens.forEach(item => {
            const valorUnitario = Number(item.valor);
            const quantidade = Number(item.quantidade);
            const subtotal = valorUnitario * quantidade;

            totalGeral += subtotal;

            tbody.innerHTML += `
                <tr>
                    <td>${item.nome}</td>
                    <td class="text-center">${quantidade}</td>
                    <td class="text-center">R$ ${valorUnitario.toFixed(2)}</td>
                    <td class="text-end">R$ ${subtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        if (itens.length > 0) {
            renderizarBlocoPagamento(totalGeral);
        }
    } catch (error) {
        console.error('[renderizarCarrinho]:', error.message);
    }
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