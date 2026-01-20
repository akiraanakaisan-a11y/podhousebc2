// Sistema de Carrinho
class Carrinho {
    constructor() {
        this.itens = this.carregarCarrinho();
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
        this.atualizarContador();
    }

    adicionarItem(produtoId, sabor, quantidade, preco, nome, imagem) {
        const item = {
            id: Date.now(),
            produtoId,
            nome,
            sabor,
            quantidade: parseInt(quantidade),
            preco: parseFloat(preco),
            imagem
        };

        this.itens.push(item);
        this.salvarCarrinho();
        return item;
    }

    removerItem(itemId) {
        this.itens = this.itens.filter(item => item.id !== itemId);
        this.salvarCarrinho();
    }

    atualizarQuantidade(itemId, novaQuantidade) {
        const item = this.itens.find(i => i.id === itemId);
        if (item) {
            item.quantidade = parseInt(novaQuantidade);
            this.salvarCarrinho();
        }
    }

    limparCarrinho() {
        this.itens = [];
        this.salvarCarrinho();
    }

    getTotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    getTotalComFrete() {
        return this.getTotal() + 18.90;
    }

    atualizarContador() {
        const totalItens = this.itens.reduce((sum, item) => sum + item.quantidade, 0);
        const contador = document.getElementById('cart-count');
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'block' : 'none';
        }
    }
}

const carrinho = new Carrinho();

// Atualizar contador ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => carrinho.atualizarContador());
} else {
    carrinho.atualizarContador();
}
