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