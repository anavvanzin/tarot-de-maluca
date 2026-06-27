# Entrega: O Taro de Maluca — Sueca de Maluca

O jogo web **O Taro de Maluca** agora funciona como uma rodada social de Sueca/iPuke: a mesa tira uma carta, resolve a ordem e passa a vez. Nao ha eliminacao por vidas.

## Como Jogar

1. Confirme as jogadoras no lobby.
2. Escolha o temperamento da proxima pessoa adicionada.
3. Use `Outra pessoa no role` quando aparecer alguem sem carta propria.
4. Inicie a leitura.
5. Na vez de cada jogadora, compre uma carta e resolva a acao da tela.
6. O placar soma `goles` e `pts`.
7. Quando o baralho termina, vence quem tiver mais pontos; em empate, fica melhor quem bebeu menos.

## Tipos de Carta

- **Eu nunca...**: marque quem ja fez. Marcadas bebem e ganham ponto.
- **Prenda**: a jogadora da vez escolhe cumprir, beber, ou cumprir e beber.
- **Reviravolta**: a jogadora da vez escolhe quem paga a carta.
- **Mesa inteira**: todo mundo resolve junto.
- **Regra**: cria uma regra temporaria para a mesa.
- **Votacao**: a roda escolhe quem bebe.

## Temperamentos

- **Labrador**: protege. Toda vez que beber por carta, reduz 1 gole, minimo 0.
- **Gato Preto**: transforma caos em gloria. Toda vez que beber por carta, ganha +1 ponto extra.

Os efeitos aparecem no lobby, no manual do Grimorio e nos botoes de resolucao da carta.

## Retratos e Estados

- As jogadoras principais usam as artes `classic` no lobby e nas cartas.
- Ao selecionar uma jogadora, a imagem muda para `cosmic`.
- Convidadas sem arte propria usam inicial tipografica.
- A interface evita emoji estrutural; os simbolos de carta usam glifos tipograficos.

## Controles

- `Iniciar a Leitura`: comeca a partida.
- Clique ou toque no baralho para comprar carta.
- `Enter` ou `Space` tambem compra carta quando a tela de gameplay esta ativa.
- `Forjar Arcano`: cria carta customizada.
- `Grimorio`: abre o manual rapido e o historico da sessao.

## Evidencia de Validacao

- `npm run build` passou.
- Playwright mobile `393x852` validou:
  - retratos maiores no lobby;
  - painel de temperamento visivel abaixo do circulo;
  - convidada com inicial;
  - Grimorio centralizado com manual;
  - gameplay/reveal sem header grande;
  - Labrador mostrando `+0` em carta de 1 gole;
  - selecao trocando retrato para `cosmic`;
  - UI sem emoji-range glyphs no lobby/forge.
- Screenshot final: `artifacts/tarot-temperamento-manual-mobile-2026-06-27.png`.
