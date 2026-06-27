# Implantação: O Tarô do Nunca (Eu Nunca Estilo Tarô/Xilogravura)

Este projeto consiste em um jogo web interativo estilo "Eu Nunca" adaptado para uma temática mística de Tarô e estética visual de xilogravura (woodcut). O jogo será otimizado para celulares e computadores, permitindo que amigas joguem juntas passando o celular ou jogando presencialmente na mesma tela.

## User Review Required

> [!IMPORTANT]
> **Estética Visual:** Utilizaremos um esquema de cores de alto contraste com inspiração mística (preto de tinta de xilogravura, creme de papel artesanal envelhecido `#f4f1ea`, dourado místico `#c5a059` e vermelho carmesim `#8b0000` para destaques).
> Usaremos efeitos de textura e desgaste nas bordas dos elementos usando CSS Masks (conforme o guia `visually-texture-content`) para simular impressão manual de bloco de madeira.

> [!TIP]
> **Gerador de Imagens:** Usaremos a ferramenta `generate_image` para criar ilustrações exclusivas no estilo xilogravura para o verso das cartas e para os arcanos principais (O Louco, O Diabo, A Morte, A Torre, A Lua). As demais cartas usarão uma moldura decorada com ícones místicos estilizados gerados por CSS/SVG.

## Proposta de Mecânica do Jogo

O jogo se chamará **"O Tarô do Nunca"** e funcionará da seguinte maneira:

1. **Configuração de Jogadoras:** As jogadoras inserem seus nomes e escolhem um símbolo rúnico/místico (ex: O Corvo, A Serpente, O Crânio, O Cálice, O Sol, A Lua). Cada jogadora começa com **5 Cálices de Vida** (pontos de vida místico).
2. **O Baralho do Destino:** Um baralho contendo 22 cartas inspiradas nos Arcanos Maiores do Tarô.
3. **Turno de Jogo:**
   - A cada rodada, o jogo aponta a jogadora ativa: *"Ana, retire uma carta do seu destino..."*.
   - A jogadora clica ou desliza o baralho para sacar uma carta.
   - A carta realiza uma transição suave 3D, revelando sua ilustração e uma afirmação de "Eu Nunca" baseada em seu arquétipo (ex: *O Diabo* revela pecados e tentações; *A Torre* revela desastres e caos).
4. **Confissão e Punição:**
   - A jogadora lê a carta: *"Eu nunca stalkeei um ex com conta fake."*
   - O jogo exibe a lista de jogadoras na tela. Aquelas que **já fizeram** aquilo devem clicar nos seus nomes ("Confessar").
   - Cada confissão consome **1 Cálice de Vida** daquela jogadora.
5. **Cartas Especiais de Destino:** Algumas cartas (como *A Roda da Fortuna* ou *O Julgamento*) desencadeiam eventos especiais em vez de perguntas normais, alterando as vidas das jogadoras de forma imprevisível.
6. **Fim do Jogo:** O jogo termina quando as vidas de alguém chegam a zero ou o baralho acaba. É revelado quem é a alma mais "Pura" (menos pecados) e quem é a mais "Caótica".

---

## Estrutura do Projeto

Criaremos uma Single Page Application (SPA) estática de alto desempenho e excelente fidelidade visual.

```
/Users/ana/Documents/antigravity/excited-newton/
├── index.html          # Estrutura HTML5 semântica e acessível
├── style.css           # Design System, variáveis HSL, efeitos de xilogravura, animações 3D
├── app.js              # Lógica do jogo (estado, baralho, turnos, interações)
└── assets/             # Imagens das cartas geradas e texturas
    ├── card-back.png   # Verso das cartas (xilogravura geométrica mística)
    ├── arcana-fool.png # Carta O Louco
    ├── arcana-devil.png# Carta O Diabo
    ├── arcana-death.png# Carta A Morte
    ├── arcana-tower.png# Carta A Torre
    └── arcana-moon.png # Carta A Lua
```

---

## Proposed Changes

### [excited-newton]

#### [NEW] [index.html](file:///Users/ana/Documents/antigravity/excited-newton/index.html)
- Tela Inicial com entrada de jogadoras.
- Tela da Mesa de Jogo com o deck, a jogadora ativa e o placar.
- Tela de Revelação da Carta em 3D.
- Tela de Fim de Jogo com rankings e títulos místicos.
- Uso de fontes do Google Fonts (`Cinzel` para títulos de tarô e `Almendra` para textos de xilogravura).

#### [NEW] [style.css](file:///Users/ana/Documents/antigravity/excited-newton/style.css)
- Implementação de CSS Custom Properties (Design Tokens de cores místicas).
- Estilização de xilogravura: bordas irregulares (`border-image` ou caminhos SVG complexos), filtros de textura (`mask-image` com texturas de grão).
- Animação 3D do flip de cartas usando `perspective`, `transform-style: preserve-3d` e `backface-visibility: hidden`.
- Responsividade absoluta (Mobile-first, focado em "passar o celular").
- Transição de estados do jogo usando a View Transitions API para transições de tela impecáveis.

#### [NEW] [app.js](file:///Users/ana/Documents/antigravity/excited-newton/app.js)
- Banco de dados local com as 22 cartas de Arcanos Maiores e suas confissões temáticas.
- Máquina de estados simples do jogo (`LOBBY`, `PLAYING`, `CARD_DRAWN`, `GAME_OVER`).
- Sistema de manipulação do DOM e eventos.
- Lógica de embaralhar (Fisher-Yates) e efeitos sonoros gerados por Web Audio API (som místico de transição de carta e cliques).

---

## Plano de Verificação

### Testes Manuais
- Testar a responsividade em tamanhos de tela mobile (ex: iPhone SE, iPhone 12 Pro) usando o inspetor do navegador.
- Verificar o fluxo completo do jogo:
  1. Adição de 3 jogadoras.
  2. Desenho de cartas sucessivas.
  3. Aplicação de penalidades de vida ("Cálices").
  4. Fim de jogo e tela de ranking.
- Validar se o efeito de flip 3D da carta e as transições de tela ocorrem sem quebras visuais.
- Testar o comportamento da View Transitions API e o fallback caso não seja suportada pelo navegador.
