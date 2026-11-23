
const listaProdutos = document.querySelector("#listaProdutos");
const inputFiltro = document.querySelector("#filtroProduto");
const filtroCategoria = document.querySelector("#filtroCategoria");
const filtroRegra = document.querySelector("#filtroRegra");
const filtroRaridade = document.querySelector("#filtroRaridade");
const ordenacao = document.querySelector("#ordenacao");
const mensagemFiltro = document.querySelector("#mensagemFiltro");

function preencherFiltros() {
  const categorias = [...new Set(window.catalogoProdutos.map((produto) => produto.categoria))];
  const regras = [...new Map(window.catalogoProdutos.map((produto) => [produto.regraId, produto.regra])).entries()];
  const raridades = [...new Set(window.catalogoProdutos.map((produto) => produto.raridade))];

  categorias.forEach((categoria) => {
    filtroCategoria.add(new Option(categoria, categoria));
  });

  regras.forEach(([id, descricao]) => {
    filtroRegra.add(new Option(descricao, id));
  });

  raridades.forEach((raridade) => {
    filtroRaridade.add(new Option(raridade, raridade));
  });
}

function criarCartaoProduto(produto) {
  const coluna = document.createElement("div");
  coluna.className = "col-sm-6 col-xl-4";

  coluna.innerHTML = `
    <div class="card-shadow-wrap">
      <article class="card product-card">
        <div class="product-media-slot">
          ${window.renderizarSlotImagem(produto)}
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center gap-2 mb-1">
            <span class="product-corp">${produto.fabricante}</span>
            <span class="product-category">${produto.categoria}</span>
          </div>
          <h3 class="h5">${produto.nome}</h3>
          <p class="product-summary mb-3">${produto.resumo}</p>
          <span class="rule-tag mb-3">REGRA: ${produto.regra}</span>
          <div class="rpg-card-stats">
            <div>
              <span>Humanidade (HL)</span>
              <strong>${produto.custoHumanidade}</strong>
            </div>
            <div>
              <span>Disponibilidade</span>
              <strong>${produto.disponibilidade}</strong>
            </div>
          </div>
          <div class="price-row">
            <p class="price">${window.formatarMoeda(produto.preco)}</p>
            <span class="eddies-tag">€$ ${produto.eddies.toLocaleString("pt-BR")}</span>
          </div>
          <a class="btn btn-neon mt-3" href="produto.html?id=${encodeURIComponent(produto.id)}" aria-label="Inspecionar ${produto.nome}">
            Inspecionar <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>`;
  return coluna;
}
function atualizarCatalogo() {
  const termo = inputFiltro.value.trim().toLocaleLowerCase("pt-BR");
  const categoriaSelecionada = filtroCategoria.value;
  const regraSelecionada = filtroRegra.value;
  const raridadeSelecionada = filtroRaridade.value;
  const ordem = ordenacao.value;

  const produtosFiltrados = window.catalogoProdutos.filter((produto) => {
    const textoProduto = `${produto.nome} ${produto.fabricante} ${produto.resumo} ${produto.descricao} ${produto.categoria} ${produto.codigo}`.toLocaleLowerCase("pt-BR");
    const correspondeBusca = textoProduto.includes(termo);
    const correspondeCategoria = !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    const correspondeRegra = !regraSelecionada || produto.regraId === regraSelecionada;
    const correspondeRaridade = !raridadeSelecionada || produto.raridade === raridadeSelecionada;
    return correspondeBusca && correspondeCategoria && correspondeRegra && correspondeRaridade;
  });

  if (ordem === "nome-asc") {
    produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } else if (ordem === "preco-asc") {
    produtosFiltrados.sort((a, b) => a.preco - b.preco);
  } else if (ordem === "preco-desc") {
    produtosFiltrados.sort((a, b) => b.preco - a.preco);
  }

  listaProdutos.replaceChildren(...produtosFiltrados.map(criarCartaoProduto));
  listaProdutos.setAttribute("aria-busy", "false");

  if (produtosFiltrados.length === 0) {
    mensagemFiltro.textContent = "SINAL PERDIDO // Nenhum artefato encontrado com esses parâmetros.";
  } else if (termo || categoriaSelecionada || regraSelecionada || raridadeSelecionada) {
    mensagemFiltro.textContent = `SCANNER // ${produtosFiltrados.length} artefato(s) localizado(s).`;
  } else {
    mensagemFiltro.textContent = `CATÁLOGO ATIVO // ${produtosFiltrados.length} artefatos disponíveis no Mercado Noturno.`;
  }
}

const parametrosPagina = new URLSearchParams(window.location.search);

preencherFiltros();
atualizarCatalogo();

if (parametrosPagina.get("status") === "compra-ausente") {
  mensagemFiltro.textContent = "ACESSO NEGADO // Conclua uma transação demonstrativa antes de abrir o recibo.";
}

inputFiltro.addEventListener("input", atualizarCatalogo);
filtroCategoria.addEventListener("change", atualizarCatalogo);
filtroRegra.addEventListener("change", atualizarCatalogo);
filtroRaridade.addEventListener("change", atualizarCatalogo);
ordenacao.addEventListener("change", atualizarCatalogo);
