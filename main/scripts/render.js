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

    document.getElementById('detalhe-id').textContent = pedido.grupo_pedido || `Pedido #${pedido.id_pedido}`;
    document.getElementById('detalhe-status').textContent = pedido.status || 'Recebido';
    document.getElementById('detalhe-total').textContent = `R$ ${Number(pedido.valor_total).toFixed(2)}`;
    document.getElementById('detalhe-quantidade').textContent = pedido.quantidade;
    document.getElementById('detalhe-pagamento').textContent = pedido.forma_pagamento || '-';
    document.getElementById('detalhe-data').textContent = pedido.criado_em;

    detalhe.style.display = 'block';
}

function obterFormaPagamentoSelecionada() {
    const selecionado = document.querySelector('input[name="forma_pagamento"]:checked');
    return selecionado ? selecionado.value : 'Dinheiro';
}

function configurarBotaoAdicionarCardapio() {
    const btnAdicionar = document.getElementById('btn-adicionar-cardapio');
    if (!btnAdicionar) return;

    btnAdicionar.onclick = async () => {
        try {
            const linhas = document.querySelectorAll('#cardapio tbody tr');
            const itensSelecionados = [];

            linhas.forEach(tr => {
                const quantidade = Number(tr.querySelector('.qty-value')?.textContent || 0);
                const id_cardapio = Number(tr.dataset.idCardapio);

                if (quantidade > 0) {
                    itensSelecionados.push({ id_cardapio, quantidade });
                }
            });

            if (itensSelecionados.length === 0) {
                alert('Selecione ao menos um item do cardápio.');
                return;
            }

            for (const item of itensSelecionados) {
                await adicionarAoCarrinho(item.id_cardapio, item.quantidade);
            }

            alert('Itens adicionados ao carrinho com sucesso!');
            await renderizarCardapio();
            await renderizarCarrinho();
        } catch (error) {
            alert(error.message);
        }
    };
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
        try {
            const forma_pagamento = obterFormaPagamentoSelecionada();

            const resposta = await finalizarPedido(forma_pagamento);

            alert(`Pedido finalizado com sucesso!\nCódigo: ${resposta.pedido.grupo_pedido}`);

            await renderizarCarrinho();
            await renderizarPedidos();

            if (typeof trocarPagina === 'function') {
                await trocarPagina('pedidos');
            }
        } catch (error) {
            alert(error.message);
        }
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
                        <span class="qty-value">0</span>
                        <button type="button" class="qty-btn btn-maior">+</button>
                    </div>
                </td>
                <td class="text-center">R$ ${Number(item.valor).toFixed(2)}</td>
                <td class="text-end total-item">R$ 0.00</td>
            `;

            const btnMenor = tr.querySelector('.btn-menor');
            const btnMaior = tr.querySelector('.btn-maior');
            const qtyValue = tr.querySelector('.qty-value');
            const totalItem = tr.querySelector('.total-item');

            function atualizarLinha(novaQuantidade) {
                const estoque = Number(tr.dataset.estoque);
                const valor = Number(tr.dataset.valor);

                if (novaQuantidade < 0) novaQuantidade = 0;
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

            tbody.appendChild(tr);
        });

        configurarBotaoAdicionarCardapio();
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

            clone.querySelector('.pedido-id').textContent = pedido.grupo_pedido || `Pedido #${pedido.id_pedido}`;
            clone.querySelector('.pedido-status').textContent = `${pedido.status} • ${pedido.forma_pagamento}`;
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