# Relatório — Página Cauã & Rayssa

Escopo: acompanha a construção e a evolução da página estática de presente (`index.html` + CSS/JS próprios), incluindo conteúdo, design, efeitos e acessibilidade.

## 2026-08-27T09:58-03:00 — Remodelagem completa: de carta única para linha do tempo em 11 seções

- Agente: Claude (Opus 5)
- Estado: concluído

- Alterações:
  - `index.html` — reescrito. Passou de uma carta única (27 linhas) para 11 seções: abertura em envelope, hero, carta original preservada, contador ao vivo, faixa curva, linha do tempo de 10 capítulos, galeria com lightbox, motivos, versículo, promessas empilhadas e final com assinatura. Idioma corrigido para `pt-BR`, adicionados favicon SVG inline, `preconnect` de fontes e `<audio>` opcional.
  - `style.css` — reescrito mantendo o papel de folha principal. Agora concentra tokens de design (cor, tipografia, espaço, sombra, movimento), reset, tipografia e o bloco de movimento reduzido.
  - `src/css/components.css` — novo. Componentes reutilizáveis: revelação no scroll, texto dividido, botões, papel/selo de cera, moldura polaroid com inclinação 3D e brilho, cartão com holofote, borda animada, texto circular, marquee curvo, barra de progresso, cursor, faíscas de coração, pétalas, lightbox e ornamentos.
  - `src/css/sections.css` — novo. Layout de cada seção.
  - `src/js/historia.js` — novo. **Único arquivo de conteúdo**: data do namoro, nomes, os 10 capítulos (foto, foco do recorte, proporção, legenda, título, parágrafos), 6 motivos, 5 promessas e o versículo.
  - `src/js/aurora.js` — novo. Fundo animado em WebGL2 puro.
  - `src/js/efeitos.js` — novo. Biblioteca de 15 efeitos em JS simples.
  - `src/js/main.js` — novo. Monta as seções a partir de `historia.js` e liga os efeitos.
  - `public/` — as 10 fotos já existiam; nenhuma foi alterada, movida ou renomeada.

- Decisões:
  - **Manter HTML/CSS/JS puro, sem etapa de build.** O projeto não tinha `package.json` nem bundler. Scripts clássicos (não módulos ES) para que o arquivo continue abrindo por duplo clique — `type="module"` seria bloqueado por CORS em `file://`.
  - **Componentes do ReactBits foram portados, não instalados.** Aurora, CurvedLoop, ScrollStack, TiltedCard, GlareHover, SpotlightCard, ClickSpark, CircularText, CountUp, SplitText/ScrollReveal e PixelTransition foram reescritos em JS simples, porque o original depende de React, `ogl`, `gsap`, `lenis` e `framer-motion`.
  - **Sistema de design** vindo da skill `ui-ux-pro-max`: padrão "Scroll-Triggered Storytelling", estilo "Soft UI Evolution", paleta rosa (`#DB2777`) + dourado (`#A16207`) sobre fundo `#FFF8FA`, tipografia Cormorant Infant + Great Vibes + Jost.
  - **Nomes das fotos preservados** (`FOTO 1.jpeg` etc., com espaço), referenciados com `%20`. Renomear quebraria a reposição de arquivos pelo usuário.
  - **Shader da Aurora adaptado para fundo claro.** No componente original a cor é multiplicada pela intensidade, o que sobre fundo rosa vira uma mancha acinzentada. A cor passou a manter o matiz e o alfa desenha a forma; o hero ganhou um fundo blush para a aurora ter sobre o que brilhar.
  - **Números do contador em Jost, não Cormorant.** A Cormorant só oferece algarismos antigos: o "1" sai como "I" e "14" era lido como "I4". `font-variant-numeric: lining-nums` não resolveu porque a fonte não traz o recurso.
  - Textos do usuário revisados só na gramática, preservando a voz (inclusive "KKKKKKK" e "KWKWKWKW").
  - Música é opcional e por detecção: o botão só aparece se existir `public/musica.mp3`.

- Verificações:
  - `python -m http.server 8777` + Playwright (Chromium) — página carregada e percorrida por inteiro.
  - Console — apenas um 404 esperado de `public/musica.mp3` (arquivo opcional, ainda não fornecido). Nenhum erro de JavaScript.
  - Renderização conferida por captura de tela em 1440px, 820px e 390px, seção por seção.
  - Rolagem horizontal — ausente em 390px, 820px e 1440px (`scrollWidth === clientWidth`).
  - Integridade do conteúdo — 10 capítulos, 11 itens de galeria, 6 motivos, 5 promessas renderizados.
  - Revelações — 0 elementos `[data-revelar]` presos invisíveis após percorrer a página.
  - `prefers-reduced-motion: reduce` — 0 elementos com opacidade diferente de 1; abertura fecha e é removida.
  - Lightbox — abre, navega, mostra legenda e fecha (clique, Esc e setas).
  - `position: sticky` das promessas — confirmado ativo depois da troca de `overflow-x`.

- Pendências e riscos:
  - **`DATA_DO_NAMORO` em `src/js/historia.js` está com um valor provisório (`2025-02-14T19:00:00`).** O contador de dias só fica correto quando o usuário puser a data real. Se a data for futura ou inválida, a seção do contador se remove sozinha.
  - As fotos são JPEG de câmera (33 KB–154 KB, até 1280px). Não foram convertidas para WebP/AVIF nem redimensionadas, para não alterar os arquivos originais do usuário. Há ganho de peso disponível caso a página vá para produção.
  - As fontes vêm do Google Fonts: sem internet, cai para Georgia e as fontes de sistema.
  - O 404 de `public/musica.mp3` é intencional (detecção de recurso opcional), mas aparece no console até o arquivo existir.
  - Não foi feito teste em navegador real além do Chromium do Playwright. `overflow-x: clip` exige Safari 16+; há `hidden` como reserva na linha anterior.

## 2026-08-27T10:34-03:00 — Versionamento em Git e publicação no GitHub

- Agente: Claude (Opus 5)
- Estado: concluído

- Alterações:
  - `.gitignore` — criado (lixo de sistema operacional, pastas de editor, temporários).
  - Repositório Git iniciado na raiz do projeto e vinculado a `github.com/caualorenzogm-sketch/Cau-para-Rayssa`.
  - Commit `861387b` publicado em `main`, somando 21 arquivos (3383 inserções). O remoto passou de 3 arquivos para 22.

- Decisões:
  - **A conta ativa do GitHub CLI era a `stgacessos` (da STG).** A pedido explícito do usuário de não envolver a STG, foi trocada para a conta pessoal `caualorenzogm-sketch` antes de qualquer operação de rede.
  - **Identidade de autoria configurada apenas neste repositório** (`git config` local, sem `--global`), como `caualorenzogm-sketch <caualorenzogm@gmail.com>` — o mesmo par usado no commit anterior do próprio usuário. O e-mail corporativo não foi usado em lugar nenhum.
  - **Histórico preservado, sem `--force`.** Em vez de iniciar um repositório do zero e sobrescrever o remoto, foi feito `git fetch` seguido de `git reset --soft FETCH_HEAD`, de modo que o novo commit fica sobre o `ef178e3` já existente.
  - Push direto na `main` (e não em um branch com PR) por ser repositório pessoal, de autor único, e porque a página precisa estar na branch padrão para servir de origem ao GitHub Pages.
  - Auxiliar de credenciais definido localmente como `!gh auth git-credential`, para o push usar o token da conta pessoal ativa.

- Verificações:
  - `git diff --cached --diff-filter=D` — 0 arquivos apagados; os 3 arquivos que já existiam no remoto foram mantidos (2 modificados, `euerayssa.jpg` intacto).
  - `git push -u origin main` — `ef178e3..861387b  main -> main`, sem erro.
  - `gh api .../commits/main` — confirma o commit `861387b` no remoto, autoria `caualorenzogm-sketch <caualorenzogm@gmail.com>`.
  - `gh api .../git/trees/main?recursive=1` — confirma os 22 arquivos, incluindo as 10 fotos em `public/`.

- Pendências e riscos:
  - **A conta ativa do GitHub CLI continua sendo a pessoal (`caualorenzogm-sketch`).** Para voltar ao trabalho: `gh auth switch --user stgacessos`. Enquanto não trocar, operações de Git em projetos da STG usarão a conta pessoal.
  - O GitHub Pages não foi habilitado. O repositório é público e tem `index.html` na raiz, então bastaria ligar Pages na branch `main` para gerar um link — não foi feito por ser uma ação de publicação externa, que depende da decisão do usuário.
  - O Git avisou que converterá LF para CRLF nos arquivos de texto (padrão do Windows). Não afeta o funcionamento da página.
