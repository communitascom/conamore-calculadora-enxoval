# Calculadora de Enxoval | Conamore Hotelaria

Landing page com a calculadora de enxoval (cama, banho, proteção e volumosos) da Conamore Hotelaria, seguida de um artigo de SEO sobre o mesmo tema. Pensada para funcionar como a pillar page da campanha: capta lead qualificado e serve de destino para os artigos satélites do blog.

Arquivo único, sem dependência de build ou servidor de aplicação.

**No ar:** https://communitascom.github.io/conamore-calculadora-enxoval/

## Estrutura da página

1. Topo: logo, título e chamada à esquerda; calculadora em 3 passos (Operação, Estrutura, Rotina) ao lado, com resultado revelado só no fim do fluxo.
2. Faixa "Como a conta é feita": três cartões explicando PAR, ciclo da peça e giro real.
3. Artigo de SEO sobre roupa de cama de hotel: método PAR, tipos de lençol, gramatura, gestão de estoque, FAQ.
4. Banner de CTA e "Continue lendo", com 3 posts reais do blog (marcado com `ItemList` em JSON-LD para SEO) e rodapé com logo e redes sociais.

## Como funciona o cálculo

O piso é o **PAR**: cada leito precisa de N jogos para a operação nunca parar (1 em uso, 1 na lavanderia, 1 em descanso). Sobre esse piso entram o giro real, o ciclo da lavanderia e uma margem de segurança.

```
Cama       jogos = máx( leitos × PAR ,  leitos × trocas/dia × dias de ciclo ) × (1 + margem)
Banho      peças = hóspedes/dia × trocas/dia × dias de ciclo × (1 + margem)
Proteção   peças = leitos (ou travesseiros) × 2      não gira no ciclo de lavagem
Volumosos  capa = leitos × PAR × (1 + margem)        enchimento = leitos × 1,5
```

`dias de ciclo = TAT da lavanderia + 1 dia de descanso`

Quando o giro supera o PAR, a tela avisa qual das duas regras mandou no número.

## Coeficientes por segmento

| Segmento | PAR | Volumosos | Margem | Motor do giro |
|---|---|---|---|---|
| Hotel / Pousada | 3 | 2 | 10% | ocupação média |
| Airbnb / Temporada | 4 | 2 | 15% | ocupação média |
| Motel | 5 | 2,5 | 20% | locações por dia |
| Hospitalar / Clínica | 5 | 2,5 | 25% | ocupação média |

Motel não usa ocupação: o giro vem do número de locações por suíte por dia.

## Casos de regressão

Hotel, casal, 2 hóspedes, 65% de ocupação, lavanderia terceirizada, troca diária, salvo indicação:

| Cenário | Total |
|---|---|
| Hotel, 1 quarto (padrão inicial da tela) | 41 |
| Hotel, 2 quartos | 85 |
| Hotel, 20 quartos | 777 |
| Airbnb, 1 unidade, 55%, só na saída | 41 |
| Hotel, 50 quartos, queen, 80%, lavanderia própria | 1.750 |
| Motel, 10 suítes, 3 locações/dia | 1.299 |

Rodar esses seis cenários contra o motor (bloco `<script>`, coeficientes no topo) antes de publicar qualquer mudança de fórmula.

## Onde mexer

Tudo em `index.html`, num bloco isolado no topo do script:

- `SEG` | coeficientes por segmento
- `CAMA` | tipos de cama e travesseiros por cama
- `LINHA` | linha de catálogo recomendada (hoje fixa em Prime / Prime Plus para todos os segmentos)
- `FREQ`, `TAT`, `DESCANSO` | política de troca e ciclo de lavanderia
- `WHATS` | número de WhatsApp usado em todos os CTAs

A interface (CSS, HTML) não precisa ser tocada para ajustar número nenhum.

## Pendências conhecidas

- Estado do cálculo não vive mais na URL (o protótipo anterior tinha; esta versão ainda não).
- Sem seleção de grupos nem ajuste manual de item no resultado (quem só precisa repor toalhas recebe a lista completa).
- Escolha de linha do catálogo (Essencial/Conforto/Premium) ainda não existe; todo resultado recomenda Prime.
- Coeficientes da tabela acima seguem pendentes de validação final com o comercial.
- Integração do formulário de captação (modal "Receber por e-mail") com CRM ainda não existe; é só simulação.
- A página "Montar meu pedido na loja" (compra-rapida) ainda não recebe os produtos calculados via URL; é para decidir numa segunda fase.
- Popup condicional (mensagem diferente se a pessoa clicou em loja/WhatsApp/e-mail vs. não fez nada) ainda não existe; ideia registrada, sem data.

## Decisões de produto registradas

**Sem preço na tela.** A Conamore vende por atacado e por volume. Qualquer valor exibido ou fica errado ou vira âncora contra o comercial.

**O resultado só aparece no fim.** Evita que a pessoa ajuste os inputs para "acertar" um número em vez de responder a verdade sobre a operação, o que é justamente o que qualifica o lead.

**Captação híbrida.** O resultado completo aparece sem cadastro. O formulário só aparece depois, para receber a lista de compras.

**Container do artigo mais estreito que o do topo.** O bloco de texto (800px) é intencionalmente mais estreito que o grid da calculadora (1120px), para não sobrar vazio ao lado do texto em telas largas.

**"Copiar resumo" virou "Baixar lista completa".** Em vez de copiar texto para a área de transferência, o botão abre o mesmo modal de captação; ao enviar, a pessoa baixa a lista em Excel na hora (via SheetJS, carregado do cdnjs) além de "receber por e-mail" (simulado). Consolida em 1 CTA em vez de 2, e transforma uma ação de baixo valor (copiar) numa de captação de lead.

**Grades com `minmax(0,1fr)`, nunca `1fr` puro.** Toda `grid-template-columns` da página usa `minmax(0,1fr)` em vez de `1fr` sozinho, porque uma coluna `1fr` sem `minmax` não encolhe abaixo do conteúdo mínimo (min-content) — se o texto de um botão não couber, a grade força a página a ficar mais larga que o container e o `overflow:hidden` do card corta o texto. Foi exatamente esse bug que cortou "Hospitalar ou clínica" nos cards de opção.

**O tema do WordPress precisa de blindagem explícita.** O Hello Elementor carrega um `reset.css` em toda página do site (mesmo com o template Elementor Canvas), que define borda e cor `#CC3366` (magenta) padrão em `button`/`a` nos estados `:hover`/`:focus`, e também **`white-space:nowrap` em todo `button`**. A página tem um bloco de CSS "blindagem" logo no topo do `<style>` que reforça `border-color`/`color`/`white-space` com `!important` em cada componente próprio — sem isso, todo botão mostra um fio magenta ao passar o mouse ou clicar, e qualquer botão com texto de mais de uma palavra (como os cards de opção "Hospitalar ou clínica") transborda para fora da caixa em vez de quebrar linha, porque o `nowrap` do tema vence. Cuidado ao editar esse bloco: um `!important` genérico demais (ex.: `a{color:inherit!important}` sem exceções) quebra qualquer link que dependa de herdar uma cor diferente da do body, como o WhatsApp flutuante e os botões do CTA "Pronto para montar o pedido?" — sempre listar exceção por componente, nunca um seletor solto. Esse bug do `reset.css` do tema só aparece na página publicada de verdade no WordPress; nunca no GitHub Pages nem no artifact, porque nenhum dos dois carrega o tema. **Sempre conferir visualmente (ou por `getComputedStyle`) direto na URL pública do WordPress antes de considerar uma correção concluída.**

## Stack

HTML, CSS e JavaScript puros num arquivo. Varta via Google Fonts. Logo e as imagens (capas dos posts relacionados, foto de lençol) embutidos em base64, extraídos do próprio blog da Conamore Hotelaria.
