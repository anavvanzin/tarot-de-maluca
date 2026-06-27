# Implantacao: O Taro de Maluca — Sueca de Maluca

## Objetivo

Finalizar o jogo web como uma experiencia mobile-first de mesa: Sueca/iPuke com tarot, confissoes, prendas, votos, alvos, regras temporarias, retratos das jogadoras e pontuacao por `goles` + `pts`.

## Escopo Atual

- Um unico modo principal: `Sueca de Maluca`.
- Sem eliminacao por vidas.
- Placar com `goles` acumulados e pontos.
- Retratos reais para Sabrina, Shai, Andressa, Patricia e Ana.
- Convidadas sem retrato usam inicial tipografica.
- Temperamentos com efeito mecanico:
  - `Labrador`: reduz 1 gole quando bebe por carta.
  - `Gato Preto`: ganha +1 ponto quando bebe por carta.
- Manual rapido dentro do Grimorio.
- UI sem emoji estrutural em `index.html`, `app.js` e `style.css`.

## Arquivos Principais

- `index.html`: telas, dialogos, manual, controles de lobby e forge.
- `style.css`: tema visual, layout responsivo, tamanho dos retratos, modal, card reveal e botoes.
- `app.js`: baralho, estado, temperamentos, resolucao das cartas, pontuacao, grimorio e efeitos.
- `assets/`: assets usados em dev/runtime.
- `public/assets/`: copia servida pelo Vite para paths dinamicos `assets/*.png`.
- `.logs/work-2026-06-27.md`: diario tecnico da entrega.

## Assets

- `*-classic.png`: estado principal no lobby/cartas.
- `*-cosmic.png`: estado selecionado/ativo.
- `*-gold.png`: variante tematica disponivel, nao usada como estado principal de selecao.
- `arcana-*.png`: cartas de apoio e verso.

## Fluxo Implementado

1. Lobby mostra as cinco jogadoras padrao com retratos.
2. A mesa pode adicionar uma pessoa nomeada ou `Outra pessoa no role`.
3. O temperamento fica abaixo do circulo e se aplica a proxima pessoa adicionada.
4. A partida embaralha cartas de confissao, prenda, alvo, grupo, regra e voto.
5. Cada carta exibe resolver proprio.
6. `applyDrink()` aplica goles, reducao de Labrador e bonus de Gato Preto.
7. O Grimorio mostra manual e historico da sessao.
8. A tela de reveal/gameplay oculta o header grande para nao empurrar a carta para baixo no celular.

## Verificacao

- `npm run build`
- Playwright em `393x852`:
  - lobby com retratos `62x62`;
  - `assets/*-classic.png` no lobby;
  - `Outra pessoa no role` gera convidada com inicial;
  - manual abre no Grimorio centralizado;
  - Forge usa glifos tipograficos;
  - reveal nao fica baixa;
  - Labrador mostra `+0` em carta de 1 gole;
  - selecao troca retrato para `cosmic`.
- `rg -n -P "[\\x{1F300}-\\x{1FAFF}]" index.html app.js style.css` sem resultados.

## Evidencias

- `artifacts/tarot-temperamento-manual-mobile-2026-06-27.png`
- `artifacts/tarot-reveal-layout-assets-2026-06-27.png`
- `.logs/work-2026-06-27.md`
