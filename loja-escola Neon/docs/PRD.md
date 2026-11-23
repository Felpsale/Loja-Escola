# PRD — Neon Bazar // Night Market
## Mercado clandestino de artefatos do amanhã

**Versão:** 3.0 (Edição Cyberpunk RPG & Game HUD)  
**Tipo:** Projeto acadêmico de front-end  
**Tecnologias:** HTML5, CSS3, Bootstrap 5.3 e JavaScript  
**API externa:** ViaCEP

---

## 1. Visão do produto

O **Neon Bazar** é uma loja virtual fictícia inspirada na estética de *Cyberpunk 2077* e no RPG de mesa *Cyberpunk RED*. Seu catálogo apresenta seis invenções originais que atendem às regras criativas do desafio acadêmico, combinando telemetria de jogo (raridade, fabricante corporativo, slots de mídia para capturas do jogo) e atributos de RPG de mesa (Custo de Humanidade e Disponibilidade no Mercado Noturno).

A aplicação simula uma jornada de compra completa no navegador, sem backend, cobrança ou envio real.

## 2. Catálogo de produtos e regras criativas

| Código | Produto | Fabricante fictício | Raridade | Regra criativa |
|---|---|---|---|---|
| NB-01 | Zumbilume | Kiroshi Sub-Setor | Épico | Começa com Z e é de uso único |
| NB-02 | Microdrone Sussurro | Kang Tao Recon | Raro | Precisa caber em um bolso |
| NB-03 | Núcleo Colosso | Petrochem / Biotecnica | Icônico | Não pode caber em um avião |
| NB-04 | Ninho-01 | MicroTech Labs | Comum | Precisa servir em uma formiga |
| NB-05 | Capacete Órbita Zero | Orbital Air | Épico | É usado no espaço sideral |
| NB-06 | Véu Fantasma | Arasaka Black-Ops | Raro | É de uso único |

Os dados ficam centralizados em `web/js/products.js`, incluindo o caminho da imagem do jogo (`assets/img/produtos/...`) com fallback automático caso o arquivo ainda não tenha sido adicionado na pasta.

## 3. Regras funcionais

- Busca textual por nome, fabricante, categoria ou descrição;
- Filtros por categoria, regra criativa e raridade RPG;
- Ordenação por destaque, nome (A–Z), menor preço e maior preço;
- Detalhes dinâmicos via `URLSearchParams` (`produto.html?id=...`) com tratamento de ID inválido;
- Quantidade inteira de 1 a 10 unidades;
- Frete demonstrativo grátis para subtotal a partir de R$ 250,00 (abaixo disso, R$ 14,90);
- Consulta de CEP via API ViaCEP (`https://viacep.com.br/ws/{cep}/json/`);
- Proteção da página `sucesso.html` via `sessionStorage`.
