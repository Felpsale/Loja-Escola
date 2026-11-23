
const parametrosProduto = new URLSearchParams(window.location.search);
const idProduto = Number(parametrosProduto.get("id"));
const produtoEncontrado = window.catalogoProdutos.find((produto) => produto.id === idProduto);

const conteudoProduto = document.querySelector("#produtoConteudo");
const avisoProdutoInexistente = document.querySelector("#produtoInexistente");
const formularioProduto = document.querySelector("#formProduto");
const campoQuantidade = document.querySelector("#quantidade");
const feedbackProduto = document.querySelector("#produtoFeedback");

if (!produtoEncontrado) {
  conteudoProduto.hidden = true;
  avisoProdutoInexistente.hidden = false;
  document.title = "Sinal não encontrado | Neon Bazar";
} else {
  document.querySelector("#breadcrumbProduto").textContent = `${produtoEncontrado.codigo} // ${produtoEncontrado.nome}`;
  document.querySelector("#categoriaProduto").textContent = `${produtoEncontrado.fabricante} // ${produtoEncontrado.categoria}`;
  document.querySelector("#regraProduto").textContent = `REGRA: ${produtoEncontrado.regra}`;
  document.querySelector("#nomeProduto").textContent = produtoEncontrado.nome;
  document.querySelector("#descricaoProduto").textContent = produtoEncontrado.resumo;
  document.querySelector("#descricaoDetalhada").textContent = produtoEncontrado.descricao;
  document.querySelector("#precoProduto").textContent = window.formatarMoeda(produtoEncontrado.preco);
  document.querySelector("#eddiesProduto").textContent = `Equivalente Night City: €$ ${produtoEncontrado.eddies.toLocaleString("pt-BR")}`;

  document.querySelector("#rpgRaridade").textContent = produtoEncontrado.raridade;
  document.querySelector("#rpgHumanidade").textContent = produtoEncontrado.custoHumanidade;
  document.querySelector("#rpgDisponibilidade").textContent = produtoEncontrado.disponibilidade;
  document.querySelector("#rpgFabricante").textContent = produtoEncontrado.fabricante;

  const ilustracao = document.querySelector("#ilustracaoProduto");
  ilustracao.innerHTML = window.renderizarSlotImagem(produtoEncontrado);

  const listaEspecificacoes = document.querySelector("#listaEspecificacoes");
  Object.entries(produtoEncontrado.especificacoes).forEach(([rotulo, valor]) => {
    const termo = document.createElement("dt");
    const descricao = document.createElement("dd");
    termo.textContent = rotulo;
    descricao.textContent = valor;
    listaEspecificacoes.append(termo, descricao);
  });

  document.title = `${produtoEncontrado.nome} | Neon Bazar`;

  formularioProduto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const quantidade = Number(campoQuantidade.value);

    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 10) {
      feedbackProduto.textContent = "ERRO DE QUANTIDADE // Escolha um número inteiro entre 1 e 10.";
      campoQuantidade.focus();
      return;
    }

    sessionStorage.setItem("produtoSelecionado", JSON.stringify({ id: produtoEncontrado.id, quantidade }));
    window.location.href = "checkout.html";
  });
}
