
let pedidoFinalizado = null;
try {
  pedidoFinalizado = JSON.parse(sessionStorage.getItem("pedidoFinalizado"));
} catch (erro) {
  console.error("Não foi possível ler os dados do pedido:", erro);
}

const produtoDoPedido = pedidoFinalizado
  ? window.catalogoProdutos.find((produto) => produto.id === Number(pedidoFinalizado.produtoId))
  : null;

if (!pedidoFinalizado || !produtoDoPedido || !pedidoFinalizado.numero) {
  window.location.replace("index.html?status=compra-ausente");
} else {
  document.querySelector("#mensagemCliente").textContent = `${pedidoFinalizado.nomeCliente}, sua transferência demonstrativa foi registrada no Data-Shard. Nenhum crédito real foi debitado.`;
  document.querySelector("#numeroPedido").textContent = pedidoFinalizado.numero;
  document.querySelector("#produtoPedido").textContent = `${produtoDoPedido.codigo} // ${produtoDoPedido.nome} (${produtoDoPedido.fabricante})`;
  document.querySelector("#quantidadePedido").textContent = `${pedidoFinalizado.quantidade} unidade(s)`;
  document.querySelector("#totalPedido").textContent = window.formatarMoeda(Number(pedidoFinalizado.total));
}
