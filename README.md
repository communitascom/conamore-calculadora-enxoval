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

O piso é o **PAR**: cada leito precisa de N jogos para a operação nunca parar (1 em uso, 1 na lavanderia, 1 em descanso). Sobre esse piso entram o giro real, o ciclo da lavanderia e uma margem de segurança, que a pessoa liga ou desliga no passo 3.

```
Cama       jogos por cama = máx( PAR ,  trocas/dia × dias de ciclo );  por tamanho: camas × jogos por cama × (1 + margem)
Banho      peças = máx( hóspedes/dia × trocas/dia × dias de ciclo × (1 + margem) ,  banheiros × PAR ,  ⌈hóspedes/dia⌉ )   (mínimo de 1 toalha por hóspede, decisão de 09/10/2026)
Piso       toalha de piso = máx( banheiros ,  banheiros × trocas/dia × dias de ciclo × (1 + margem) )   (mínimo de 1 por banheiro, decisão de 09/10/2026)
Complementos (fora do total)  protetores = camas (ou travesseiros) × 2;  capa = camas × 3 × (1 + margem)  (PAR 3 em todos os segmentos: a capa não troca a cada locação; decisão de 09/10/2026);  enchimento = camas × 1,5
```

Entradas da etapa 2: camas no total, banheiros e a distribuição das camas por tamanho (solteiro 1 pessoa e 1 travesseiro; casal, queen e king 2 e 2). Camas sem tamanho escolhido contam como casal. Hóspedes por dia = capacidade das camas × ocupação. O total do topo é só cama e banho; os complementos são recomendados, marcados e editados pela pessoa, e entram à parte.

Fora da metodologia original (decisão de 30/09/2026): mínimo de toalhas de banho e rosto por banheiro (banheiros × PAR) e ocupação padrão de 50% para hotel, pousada e Airbnb. Na explicação do resultado esse mínimo só aparece quando ele passa o giro ("Vale o mínimo"); quando o giro é maior, o texto fala só de hóspedes × trocas × ciclo. A palavra "piso" fica reservada à toalha de piso (tapete de banheiro), para não confundir com o mínimo.

`dias de ciclo = TAT da lavanderia + 1 dia de descanso`

**Hóspedes por dia não é arredondado na conta** (capacidade × ocupação, ex.: 1 casal a 70% = 1,4). Só as peças finais arredondam para cima. **"Só na saída" vale 0,34 troca por dia ocupado**, hipótese equivalente a uma estadia de cerca de 3 noites; a tela não pergunta a duração da estadia e o valor não foi validado com o cliente.

**Margem (decisão de 06/10/2026).** O passo 3 tem duas opções: *com margem* (metodologia: 10% hotel e pousada, 15% Airbnb, 20% motel, 25% hospitalar) e *sem margem* (mínimo: PAR ou giro, sem folga). O resultado mostra o outro cenário ao lado ("Só o mínimo, sem margem: N peças") com um botão para alternar. Padrão: com margem.

**PAR 3 para hotel, pousada e Airbnb** (um em uso, um na lavanderia, um em reposição). Motel e hospitalar seguem em 5.

**Troca diária.** O PAR é o piso e vale para qualquer frequência de troca. A frequência só empurra a cama acima do PAR quando `trocas/dia × ciclo` passa de 3 (ocupação alta com lavanderia terceirizada, por exemplo 100% e troca diária dá 3,5 jogos por cama). Já nas toalhas a frequência muda o número direto, porque o piso é por banheiro e o giro é por hóspede.

**Linha no resultado (seletor por dado técnico).** Acima da lista há dois seletores, lençol e fronha por fios (padrão 180 fios | Confort) e toalhas por gramatura (padrão 410 g/m² | Quality). O menu abre ao passar o mouse, focar ou tocar, e lista as linhas do site: lençol Harmony 160, Confort 180, Essence 180, Classic 200, Prime 200, Supreme 300, Serenity 400; toalha Smart 340, Fit 350, Sense 380, Quality 410, Select 440, Lined 445, Frame 450, Confort 500, Prime 500, Giant 580, Imperial 600. A linha muda o produto, não a quantidade, e acompanha o WhatsApp e o Excel (`LENCOIS`, `TOALHAS`).

Quando o giro supera o PAR, a tela avisa qual das duas regras mandou no número.

## Coeficientes por segmento

| Segmento | PAR | Volumosos | Margem | Motor do giro |
|---|---|---|---|---|
| Hotel / Pousada | 3 | 2 | 10% | ocupação média (padrão 50%) |
| Airbnb / Temporada | 3 | 2 | 15% | ocupação média (padrão 50%) |
| Motel | 5 | 2,5 | 20% | locações por dia |
| Hospitalar / Clínica | 5 | 2,5 | 25% | ocupação média |

Motel não usa ocupação: o giro vem do número de locações por suíte por dia.

## Casos de regressão

Camas de casal, lavanderia terceirizada, troca diária, ocupação padrão do segmento (50%), salvo indicação. Total com margem (padrão) e sem margem (mínimo):

| Cenário | Com margem | Sem margem |
|---|---|---|
| Hotel, 1 cama, 1 banheiro (padrão inicial da tela) | 25 | 22 |
| Hotel, 2 camas, 1 banheiro | 46 | 40 |
| Hotel, 20 camas, 20 banheiros | 457 | 415 |
| Airbnb, 1 cama, 1 banheiro, só na saída (55% de ocupação) | 22 | 19 |
| Hotel, 50 camas queen, 50 banheiros, 80%, lavanderia própria | 1.100 | 1.000 |
| Motel, 10 suítes (10 camas, 10 banheiros), 3 locações/dia | 1.134 | 945 |

Rodar esses seis cenários, com e sem margem, contra o motor (bloco `<script>`, coeficientes no topo) antes de publicar qualquer mudança de fórmula.

**Hospitalar** não tem opção de frequência de troca: a troca de cama e de toalhas é sempre diária (exigência sanitária), com legenda na tela (decisão de 09/10/2026).

## Simulação
`node testes/simulacao.js` roda o motor do `index.html` em ~900 mil combinações (grade amostrada, não todos os inteiros) e confere invariantes: totais inteiros, soma, monotonicidade, textos sem NaN, plural e "0 hóspedes". Sem falhas abertas em 09/10/2026. O teste não cobre interface, Excel nem WhatsApp.

## Onde mexer

Tudo em `index.html`, num bloco isolado no topo do script:

- `SEG` | coeficientes por segmento
- `CAMA` | tipos de cama e travesseiros por cama
- `LENCOIS`, `TOALHAS` | linhas do catálogo no seletor do resultado (padrões em `state.lencol` e `state.toalha`)
- `FREQ`, `TAT`, `DESCANSO` | política de troca e ciclo de lavanderia
- `WHATS` | número de WhatsApp usado em todos os CTAs

A interface (CSS, HTML) não precisa ser tocada para ajustar número nenhum.

## Pendências conhecidas

- Estado do cálculo não vive mais na URL (o protótipo anterior tinha; esta versão ainda não).
- Sem seleção de grupos nem ajuste manual de item no resultado (quem só precisa repor toalhas recebe a lista completa).
- Escolha de linha do catálogo ainda não existe; o seletor do resultado só muda o texto, sem preço. A tabela de lençóis do artigo ainda lista só Classic, Prime e Supreme.
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

## Pendências (30/09/2026)

- RD Station: o formulário já monta a conversão (campos `cf_calc_*` e tags `calculadora-enxoval`, `segmento-*`, `porte-*`, `calculadora-enviar-lista`), mas `RD.chave` está vazia. Falta a chave pública da conta e criar os campos personalizados no RD.
- Republicar no WordPress (página 3303) e no artifact público.
