const BASE_URL = 'https://fura-fila-api-production.up.railway.app/api';

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'https://6sixfrosty.github.io/Fura-fila/public/index.html';
}

function authHeader() {
    return {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

function sair() {
    localStorage.removeItem('token');
    window.location.href = 'https://6sixfrosty.github.io/Fura-fila/public/index.html';
}