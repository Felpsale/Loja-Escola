const formularioCheckout = document.querySelector("#checkoutForm");
const layoutCheckout = document.querySelector("#checkoutLayout");
const avisoCheckout = document.querySelector("#checkoutIndisponivel");
const campoCep = document.querySelector("#cep");
const botaoBuscarCep = document.querySelector("#buscarCep");
const feedbackCep = document.querySelector("#cepFeedback");
const feedbackCheckout = document.querySelector("#checkoutFeedback");
const campoTelefone = document.querySelector("#telefone");
const campoEstado = document.querySelector("#estado");
const campoQuantidadeCheckout = document.querySelector("#quantidadeCheckout");

let selecao = null;
try {
  selecao = JSON.parse(sessionStorage.getItem("produtoSelecionado"));
} catch (erro) {
  console.error("Não foi possível ler o produto selecionado:", erro);
}

const produtoCheckout = selecao
  ? window.catalogoProdutos.find((produto) => produto.id === Number(selecao.id))
  : null;
let quantidadeCheckout = Number(selecao?.quantidade);

if (!produtoCheckout || !Number.isInteger(quantidadeCheckout) || quantidadeCheckout < 1 || quantidadeCheckout > 10) {
  layoutCheckout.hidden = true;
  avisoCheckout.hidden = false;
} else {
  iniciarCheckout();
}

function somenteNumeros(valor) {
  return valor.replace(/\D/g, "");
}

function moeda(valor) {
  return window.formatarMoeda(valor);
}

function atualizarResumo() {
  const subtotal = produtoCheckout.preco * quantidadeCheckout;
  const frete = subtotal >= 250 ? 0 : 14.90;
  const total = subtotal + frete;

  document.querySelector("#resumoProduto").textContent = `${produtoCheckout.codigo} // ${produtoCheckout.nome}`;
  campoQuantidadeCheckout.value = String(quantidadeCheckout);

  const thumbContainer = document.querySelector("#resumoThumb");
  thumbContainer.innerHTML = `
    <img src="${produtoCheckout.imagem}" alt="${produtoCheckout.alt}" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">
    <div class="summary-thumb-fallback" hidden>${produtoCheckout.codigo}</div>
  `;

  document.querySelector("#resumoSubtotal").textContent = moeda(subtotal);
  document.querySelector("#resumoFrete").textContent = frete === 0 ? "Grátis (Drone Fixer)" : moeda(frete);
  document.querySelector("#resumoTotal").textContent = moeda(total);

  return { subtotal, frete, total };
}

function formatarCep(valor) {
  const numeros = somenteNumeros(valor).slice(0, 8);
  return numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
}

function formatarTelefone(valor) {
  const numeros = somenteNumeros(valor).slice(0, 11);
  if (numeros.length <= 2) return numeros.length ? `(${numeros}` : "";
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

async function buscarEnderecoPorCep() {
  const cep = somenteNumeros(campoCep.value);
  feedbackCep.textContent = "";
  campoCep.setCustomValidity("");
  campoCep.classList.remove("is-invalid");

  if (cep.length !== 8) {
    campoCep.setCustomValidity("Informe um CEP com oito números.");
    campoCep.classList.add("is-invalid");
    feedbackCep.textContent = "ERRO // Digite os oito números do CEP antes de consultar.";
    campoCep.focus();
    return;
  }

  botaoBuscarCep.disabled = true;
  botaoBuscarCep.textContent = "Rastreando...";
  feedbackCep.textContent = "NET-LINK // Consultando coordenadas na ViaCEP...";

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) {
      throw new Error("O serviço ViaCEP respondeu com um erro.");
    }

    const dados = await resposta.json();
    if (dados.erro) {
      feedbackCep.textContent = "CEP não localizado na rede. Confira os dígitos ou preencha manualmente.";
      return;
    }

    document.querySelector("#logradouro").value = dados.logradouro || "";
    document.querySelector("#bairro").value = dados.bairro || "";
    document.querySelector("#cidade").value = dados.localidade || "";
    campoEstado.value = (dados.uf || "").toUpperCase();
    feedbackCep.textContent = "COORDENADAS CONFIRMADAS // Confira os dados e informe o número.";
  } catch (erro) {
    console.error("Falha ao consultar ViaCEP:", erro);
    feedbackCep.textContent = "FALHA DE CONEXÃO // Preencha o endereço manualmente.";
  } finally {
    botaoBuscarCep.disabled = false;
    botaoBuscarCep.textContent = "Buscar CEP";
  }
}

function validarFormulario() {
  const cepCorreto = somenteNumeros(campoCep.value).length === 8;
  campoCep.setCustomValidity(cepCorreto ? "" : "Informe um CEP com oito números.");
  campoEstado.value = campoEstado.value.toUpperCase();

  const campos = [...formularioCheckout.querySelectorAll("input, select")];
  campos.forEach((campo) => {
    if (campo.checkValidity()) {
      campo.classList.remove("is-invalid");
    } else {
      campo.classList.add("is-invalid");
    }
  });

  if (!formularioCheckout.checkValidity()) {
    formularioCheckout.querySelector(":invalid")?.focus();
    feedbackCheckout.textContent = "ALERTA // Revise os campos destacados antes de transmitir.";
    return false;
  }

  feedbackCheckout.textContent = "";
  return true;
}

function iniciarCheckout() {
  let valoresCompra = atualizarResumo();

  campoQuantidadeCheckout.addEventListener("change", () => {
    const novaQuantidade = Number(campoQuantidadeCheckout.value);
    if (!Number.isInteger(novaQuantidade) || novaQuantidade < 1 || novaQuantidade > 10) {
      campoQuantidadeCheckout.setCustomValidity("Escolha uma quantidade inteira entre 1 e 10.");
      campoQuantidadeCheckout.classList.add("is-invalid");
      feedbackCheckout.textContent = "A quantidade deve ser um número inteiro entre 1 e 10.";
      return;
    }

    campoQuantidadeCheckout.setCustomValidity("");
    campoQuantidadeCheckout.classList.remove("is-invalid");
    quantidadeCheckout = novaQuantidade;
    valoresCompra = atualizarResumo();
    feedbackCheckout.textContent = "TERMINAL ATUALIZADO // Valores recalculados.";
  });

  campoCep.addEventListener("input", () => {
    campoCep.value = formatarCep(campoCep.value);
    campoCep.setCustomValidity("");
    campoCep.classList.remove("is-invalid");
    feedbackCep.textContent = "";
  });

  campoTelefone.addEventListener("input", () => {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
  });

  campoEstado.addEventListener("input", () => {
    campoEstado.value = campoEstado.value.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase();
  });

  botaoBuscarCep.addEventListener("click", buscarEnderecoPorCep);

  formularioCheckout.addEventListener("submit", (evento) => {
    evento.preventDefault();
    formularioCheckout.classList.add("was-validated");

    const quantidadeInformada = Number(campoQuantidadeCheckout.value);
    if (!Number.isInteger(quantidadeInformada) || quantidadeInformada < 1 || quantidadeInformada > 10) {
      campoQuantidadeCheckout.setCustomValidity("Escolha uma quantidade inteira entre 1 e 10.");
      campoQuantidadeCheckout.classList.add("is-invalid");
      feedbackCheckout.textContent = "Corrija a quantidade no resumo da compra.";
      campoQuantidadeCheckout.focus();
      return;
    }
    campoQuantidadeCheckout.setCustomValidity("");
    quantidadeCheckout = quantidadeInformada;
    valoresCompra = atualizarResumo();

    if (!validarFormulario()) return;

    const nomeCliente = document.querySelector("#nome").value.trim();
    const numeroPedido = `NB-${Date.now().toString().slice(-8)}`;

    const compra = {
      numero: numeroPedido,
      nomeCliente,
      produtoId: produtoCheckout.id,
      quantidade: quantidadeCheckout,
      subtotal: valoresCompra.subtotal,
      frete: valoresCompra.frete,
      total: valoresCompra.total,
      data: new Date().toISOString()
    };

    try {
      sessionStorage.setItem("pedidoFinalizado", JSON.stringify(compra));
      sessionStorage.removeItem("produtoSelecionado");
      window.location.href = "sucesso.html";
    } catch (erro) {
      console.error("Não foi possível registrar a simulação:", erro);
      feedbackCheckout.textContent = "Não foi possível salvar o pedido nesta aba.";
    }
  });
}
