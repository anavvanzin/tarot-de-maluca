# Entrega: O Tarô do Nunca

O jogo web **O Tarô do Nunca** foi totalmente desenvolvido e está pronto para jogar! Ele reúne a diversão social do estilo "Eu Nunca" com o mistério e a estética marcante de cartas de Tarô medieval impressas em xilogravura.

## O Que Foi Desenvolvido

1. **Ilustrações de Xilogravura Personalizadas:**
   Geramos ilustrações exclusivas em estilo xilogravura (tinta preta e textura de papel algodão envelhecido) para o verso das cartas e para cinco dos Arcanos Maiores principais (O Louco, O Diabo, A Morte, A Torre e A Lua).
2. **Visual Premium & Design System:**
   - Paleta de cores rústica e elegante com creme de pergaminho, tinta de carvão, ouro e vermelho-sangue.
   - Bordas e botões envelhecidos com efeito de corte de madeira irregular usando filtros SVG de distorção de borda.
   - Animação de flip 3D fluida ao revelar as cartas.
3. **Mecânica do Jogo (Personalização Sáfica & Temperamento):**
   - **Escala Labrador vs. Gato Preto:** Ao invocar uma jogadora, é possível selecionar seu temperamento (🐕 Labrador: agitada, expansiva e fofa; ou 🐈 Gato Preto: brava, reservada e protetora). Isso altera os ícones visuais no placar e gera títulos dinâmicos hilários no final (como "Labrador Celestial" para a vencedora ou "Gato Preto Caótico" para a derrotada).
   - **Confissões Temáticas Sáficas:** O baralho de 22 Arcanos Maiores foi customizado com perguntas divertidas, leves e super relacionáveis para o público sáfico (lésbico e bissexual), abordando piadas clássicas como U-Haul (morar junto cedo), playlists gigantes no início da paquera, DRs mentais no espelho e cortes de cabelo após términos.
   - Placar de vidas representadas por Cálices de Vinho/Sangue (`🍷`).
   - Sistema de cartas de eventos especiais (como a Roda da Fortuna).
4. **Efeitos Sonoros Místicos (Web Audio API):**
   - Sintetizador nativo para reproduzir sons de cliques em madeira, chocalho de correntes e ventos mágicos ao virar a carta.
   - Não depende de downloads de áudio externos, funcionando 100% offline.
5. **Acessibilidade e Usabilidade:**
   - Suporte completo a rotas de foco para leitores de tela (`tabindex="-1"` gerenciado por máquina de estados).
   - Transições fluidas usando a View Transitions API para navegadores modernos com degradação suave.

---

## Galeria de Ilustrações das Cartas (Carrossel)

````carousel
![Verso das Cartas](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/card_back_1782503239978.png)
<!-- slide -->
![O Louco (0)](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/arcana_fool_1782503259381.png)
<!-- slide -->
![O Diabo (XV)](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/arcana_devil_1782503282573.png)
<!-- slide -->
![A Morte (XIII)](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/arcana_death_1782503309782.png)
<!-- slide -->
![A Torre (XVI)](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/arcana_tower_1782503344756.png)
<!-- slide -->
![A Lua (XVIII)](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/arcana_moon_1782503385142.png)
````

---

## Código do Projeto

Os arquivos foram criados no diretório do seu workspace:
- Estrutura HTML: [index.html](file:///Users/ana/Documents/antigravity/excited-newton/index.html)
- Estilos e Texturas: [style.css](file:///Users/ana/Documents/antigravity/excited-newton/style.css)
- Regras e Lógica: [app.js](file:///Users/ana/Documents/antigravity/excited-newton/app.js)

## Demonstração do Fluxo de Jogo (Vídeos e Screenshots)

Veja o screenshot da tela do lobby inicial com o círculo de amigas já pré-carregado e o rodapé perfeitamente renderizado (sem clipping):
![Lobby Inicial Corrigido](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/lobby_fixed_screen.png)

A gravação do teste de layout no lobby está disponível aqui:
![Vídeo de Teste de Layout](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/recording_lobby_fixed.webm)

E o screenshot da mesa de tiragem atualizada após a perda de cálice de essência vital no teste de gameplay:
![Scoreboard Atualizado](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/final_gameplay_screen.png)

A gravação completa do fluxo de tiragem e confissões sáficas está disponível aqui:
![Vídeo de Teste de Tiragem](/Users/ana/.gemini/antigravity/brain/d934bb10-5fe1-4c07-8476-0326486a52f1/recording.webm)

## Como Jogar

O jogo foi hospedado com sucesso e está disponível online!

- **URL de Produção:** [https://anavanzin.com/tarot-de-maluca/](https://anavanzin.com/tarot-de-maluca/)
- **Repositório GitHub:** [/Users/ana/Documents/GitHub/tarot-de-maluca](file:///Users/ana/Documents/GitHub/tarot-de-maluca)

O deploy foi executado de forma automatizada usando a ferramenta da skill `/vai-com-forca` (`release.py`), que realizou o commit de todas as modificações visuais e de lógica e fez o push para a branch `master`, ativando o build no GitHub Actions.

