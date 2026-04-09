async function fetchPerfil() {
    const res = await fetch(`${BASE_URL}/Perfil`, {
        headers: authHeader()
    });

    if (!res.ok) {
        throw new Error('Erro ao buscar perfil do usuário.');
    }

    return await res.json();
}

async function fetchCardapio() {
    const res = await fetch(`${BASE_URL}/Cardapio`, {
        headers: authHeader()
    });

    if (!res.ok) {
        throw new Error('Erro ao buscar cardápio.');
    }

    return await res.json();
}

async function fetchCarrinho() {
    const res = await fetch(`${BASE_URL}/Carrinho`, {
        headers: authHeader()
    });

    if (!res.ok) {
        throw new Error('Erro ao buscar carrinho.');
    }

    return await res.json();
}

async function fetchPedidos() {
    const res = await fetch(`${BASE_URL}/Pedidos`, {
        headers: authHeader()
    });

    if (!res.ok) {
        throw new Error('Erro ao buscar pedidos.');
    }

    return await res.json();
}

async function adicionarAoCarrinho(id_cardapio, quantidade) {
    const res = await fetch(`${BASE_URL}/Carrinho`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ id_cardapio, quantidade })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Erro ao adicionar ao carrinho.');
    }

    return data;
}

async function finalizarPedido(forma_pagamento) {
    const res = await fetch(`${BASE_URL}/Pedidos/Finalizar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ forma_pagamento })
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Erro ao finalizar pedido.');
    }

    return data;
}