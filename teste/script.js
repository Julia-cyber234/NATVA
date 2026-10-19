/* =====================================
   JANELA DE DETALHES DO PERFUME
===================================== */
const modal = document.getElementById("modalProduto");
const fecharModal = document.getElementById("fecharModal");

const modalImagem = document.getElementById("modalImagem");
const modalCategoria = document.getElementById("modalCategoria");
const modalNome = document.getElementById("modalNome");
const modalDescricao = document.getElementById("modalDescricao");
const modalPreco = document.getElementById("modalPreco");

const adicionarSacola = document.getElementById("adicionarSacola");
const mensagemSacola = document.getElementById("mensagemSacola");

/* =====================================
   ELEMENTOS DA SACOLA DE COMPRAS
===================================== */
const abrirSacola = document.getElementById("abrirSacola");
const modalSacola = document.getElementById("modalSacola");
const fecharSacola = document.getElementById("fecharSacola");
const itensSacola = document.getElementById("itensSacola");
const contadorSacola = document.getElementById("contadorSacola");
const totalSacola = document.getElementById("totalSacola");
const finalizarPedido = document.getElementById("finalizarPedido");

/* =====================================
   DADOS DOS PRODUTOS E DA SACOLA
===================================== */
let produtoSelecionado = null;
const sacola = [];

/* CONVERTE PREÇO BRASILEIRO EM NÚMERO */
function converterPreco(preco) {
    return Number(
        preco.replace(/[^\d,]/g, "").replace(",", ".")
    );
}

/* FORMATA VALORES EM REAIS */
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/* =====================================
   ABRIR DETALHES DOS PERFUMES
===================================== */
document.querySelectorAll(".cartao-produto").forEach((cartao) => {
    const botao = cartao.querySelector(".botao-comprar");

    botao.addEventListener("click", () => {
        const imagem = cartao.querySelector(".imagem-produto img");

        produtoSelecionado = {
            nome: cartao.querySelector("h3").textContent.trim(),
            categoria: cartao.querySelector(".categoria-produto").textContent.trim(),
            descricao: cartao.querySelector(".descricao-produto").textContent.trim(),
            preco: cartao.querySelector(".preco-produto").textContent.trim(),
            imagem: imagem.getAttribute("src"),
            alt: imagem.getAttribute("alt")
        };

        modalImagem.src = produtoSelecionado.imagem;
        modalImagem.alt = produtoSelecionado.alt;
        modalCategoria.textContent = produtoSelecionado.categoria;
        modalNome.textContent = produtoSelecionado.nome;
        modalDescricao.textContent = produtoSelecionado.descricao;
        modalPreco.textContent = produtoSelecionado.preco;
        mensagemSacola.textContent = "";

        modal.classList.add("ativo");
        modal.setAttribute("aria-hidden", "false");
    });
});

/* =====================================
   ABRIR E FECHAR JANELAS
===================================== */
function fecharJanela() {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
}

function fecharJanelaSacola() {
    modalSacola.classList.remove("ativo");
    modalSacola.setAttribute("aria-hidden", "true");
}

fecharModal.addEventListener("click", fecharJanela);
fecharSacola.addEventListener("click", fecharJanelaSacola);

modal.addEventListener("click", (evento) => {
    if (evento.target === modal) fecharJanela();
});

modalSacola.addEventListener("click", (evento) => {
    if (evento.target === modalSacola) fecharJanelaSacola();
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        fecharJanela();
        fecharJanelaSacola();
    }
});

/* =====================================
   ADICIONAR PERFUME À SACOLA
===================================== */
adicionarSacola.addEventListener("click", () => {
    if (!produtoSelecionado) return;

    const existente = sacola.find(
        (item) => item.nome === produtoSelecionado.nome
    );

    if (existente) {
        existente.quantidade++;
    } else {
        sacola.push({
            ...produtoSelecionado,
            valor: converterPreco(produtoSelecionado.preco),
            quantidade: 1
        });
    }

    mensagemSacola.textContent =
        `${produtoSelecionado.nome} foi adicionado à sacola!`;

    atualizarSacola();
});

/* =====================================
   ATUALIZAR PRODUTOS, CONTADOR E TOTAL
===================================== */
function atualizarSacola() {
    const quantidadeTotal = sacola.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    const valorTotal = sacola.reduce(
        (total, item) => total + item.valor * item.quantidade,
        0
    );

    contadorSacola.textContent = quantidadeTotal;
    totalSacola.textContent = formatarMoeda(valorTotal);

    if (sacola.length === 0) {
        itensSacola.innerHTML = "<p>Sua sacola está vazia.</p>";
        return;
    }

    itensSacola.innerHTML = sacola.map((item, indice) => `
        <div class="item-sacola">
            <img src="${item.imagem}" alt="${item.alt}">

            <div>
                <h3>${item.nome}</h3>
                <p>${formatarMoeda(item.valor)} cada</p>

                <div class="controles-quantidade">
                    <button type="button"
                            data-acao="diminuir"
                            data-indice="${indice}"
                            aria-label="Diminuir quantidade">
                        −
                    </button>

                    <span>${item.quantidade}</span>

                    <button type="button"
                            data-acao="aumentar"
                            data-indice="${indice}"
                            aria-label="Aumentar quantidade">
                        +
                    </button>
                </div>
            </div>

            <button type="button"
                    class="remover-item"
                    data-acao="remover"
                    data-indice="${indice}">
                Remover
            </button>
        </div>
    `).join("");
}

/* =====================================
   BOTÕES DE QUANTIDADE E REMOÇÃO
===================================== */
itensSacola.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) return;

    const indice = Number(botao.dataset.indice);
    const acao = botao.dataset.acao;
    const item = sacola[indice];

    if (!item) return;

    if (acao === "aumentar") {
        item.quantidade++;
    }

    if (acao === "diminuir") {
        item.quantidade--;

        if (item.quantidade <= 0) {
            sacola.splice(indice, 1);
        }
    }

    if (acao === "remover") {
        sacola.splice(indice, 1);
    }

    atualizarSacola();
});

/* =====================================
   ABRIR A SACOLA PELO CABEÇALHO
===================================== */
abrirSacola.addEventListener("click", () => {
    atualizarSacola();
    modalSacola.classList.add("ativo");
    modalSacola.setAttribute("aria-hidden", "false");
});

/* =====================================
   FINALIZAÇÃO DO PEDIDO
===================================== */
finalizarPedido.addEventListener("click", () => {
    if (sacola.length === 0) {
        alert("Sua sacola está vazia. Adicione um perfume antes de continuar!");
        return;
    }

    alert("Sua sacola está pronta! No próximo passo, vamos conectar a finalização ao WhatsApp.");
});

/* ATUALIZA A SACOLA AO CARREGAR A PÁGINA */
atualizarSacola();