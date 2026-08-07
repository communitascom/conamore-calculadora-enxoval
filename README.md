# Calculadora de Enxoval | Conamore Hotelaria

Ferramenta web que dimensiona a quantidade de enxoval (cama, banho, proteção e volumosos) que um meio de hospedagem precisa manter em estoque, pelo método PAR ajustado ao giro real da operação.

Protótipo navegável, arquivo único, sem dependência de build ou servidor de aplicação.

**No ar:** https://communitascom.github.io/conamore-calculadora-enxoval/

## Como funciona o cálculo

O piso é o **PAR**: cada leito precisa de N jogos para a operação nunca parar (1 em uso, 1 na lavanderia, 1 em descanso). Sobre esse piso entram o giro real, o ciclo da lavanderia e uma margem de segurança.

```
Cama       jogos = máx( leitos × PAR ,  leitos × trocas/dia × dias de ciclo ) × (1 + margem)
Banho      peças = hóspedes/dia × trocas/dia × dias de ciclo × (1 + margem)
Proteção   peças = leitos (ou travesseiros) × 2      não gira no ciclo de lavagem
Volumosos  capa = leitos × PAR × (1 + margem)        enchimento = leitos × 1,5
```

`dias de ciclo = TAT da lavanderia + 1 dia de descanso`

Quando o giro supera o PAR, a tela avisa qual das duas regras mandou no número. É o que sustenta a confiança no resultado.

## Coeficientes por segmento

| Segmento | PAR | Volumosos | Margem | Motor do giro |
|---|---|---|---|---|
| Hotel / Pousada | 3 | 2 | 10% | ocupação média |
| Airbnb / Temporada | 4 | 2 | 15% | ocupação média |
| Motel | 5 | 2,5 | 20% | locações por dia |
| Hospitalar / Clínica | 5 | 2,5 | 25% | ocupação média |

Motel não usa ocupação: o giro vem do número de locações por suíte por dia, e cada locação exige troca completa de cama e banho.

## Onde mexer

Tudo em `index.html`, num bloco isolado no topo do script:

- `SEG` | coeficientes por segmento
- `CAMA` | tipos de cama e travesseiros por cama
- `PADRAO` | linhas do catálogo por faixa (fio e gramatura)
- `FREQ`, `TAT`, `DESCANSO` | política de troca e ciclo de lavanderia

A interface não precisa ser tocada para ajustar número nenhum.

## Pendências antes de publicar para o cliente

- [ ] Validar os coeficientes da tabela acima com o comercial da Conamore
- [ ] Confirmar em qual faixa cada linha entra. Existem também Harmony 160, Confort 180 e Serenity 400, fora dos três cartões atuais
- [ ] Definir o destino do lead (CRM, planilha ou automação) e quem faz o follow-up
- [ ] Gerar de fato o relatório em PDF prometido na tela de captação
- [ ] Confirmar o número de WhatsApp do consultor

## Decisões de produto registradas

**Sem preço na tela.** A Conamore vende por atacado e por volume. Qualquer valor exibido ou fica errado ou vira âncora contra o comercial. A ferramenta entrega quantidade e linha recomendada, e o preço é o motivo de falar com o consultor.

**O resultado só aparece no fim.** Número atualizando durante o preenchimento gera ancoragem: a pessoa passa a ajustar o input para chegar ao número em vez de responder a verdade, e o dado é justamente o que qualifica o lead. O painel lateral explica cada passo, o número fica para a revelação.

**Captação híbrida.** O resultado completo aparece sem cadastro. O formulário só aparece depois, para receber a lista de compras. Menos atrito, lead mais qualificado.

## Stack

HTML, CSS e JavaScript puros num arquivo. Material Symbols Rounded e Figtree via Google Fonts. Logo embutido em base64. O estado do cálculo vive na URL, então o link pode ser compartilhado e sobrevive a um refresh.
