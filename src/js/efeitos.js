/* =========================================================================
   Biblioteca de efeitos — HTML/CSS/JS puro
   Ports em JavaScript simples de componentes do ReactBits:
   ScrollReveal, SplitText, TiltedCard, GlareHover, SpotlightCard,
   ClickSpark, CountUp, CurvedLoop, ScrollStack e Particles.
   ========================================================================= */

(function (global) {
  'use strict';

  var Efeitos = {};

  var semMovimento = global.matchMedia &&
    global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var temMouse = global.matchMedia &&
    global.matchMedia('(hover: hover) and (pointer: fine)').matches;

  Efeitos.semMovimento = semMovimento;
  Efeitos.temMouse = temMouse;

  /* -----------------------------------------------------------------------
     1. REVELAÇÃO NO SCROLL  (ScrollReveal / FadeContent)
     ----------------------------------------------------------------------- */
  Efeitos.revelar = function (seletor, opcoes) {
    opcoes = opcoes || {};
    var elementos = typeof seletor === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(seletor))
      : [seletor];

    if (!global.IntersectionObserver) {
      elementos.forEach(function (el) { el.classList.add('visivel'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        if (opcoes.aoRevelar) opcoes.aoRevelar(entrada.target);
        if (!opcoes.repetir) observador.unobserve(entrada.target);
      });
    }, {
      threshold: opcoes.limiar || 0.15,
      rootMargin: opcoes.margem || '0px 0px -12% 0px'
    });

    elementos.forEach(function (el) { observador.observe(el); });
    return observador;
  };

  /* -----------------------------------------------------------------------
     2. TEXTO DIVIDIDO  (SplitText / BlurText)
     ----------------------------------------------------------------------- */
  Efeitos.dividirEmPalavras = function (el, escalonamento) {
    if (!el || el.dataset.dividido) return;
    // Com movimento reduzido não há o que escalonar: o texto fica inteiro,
    // o que também é melhor para leitores de tela.
    if (semMovimento) return;
    escalonamento = escalonamento || 42;

    var palavras = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    palavras.forEach(function (palavra, i) {
      var span = document.createElement('span');
      span.className = 'palavra';
      span.textContent = palavra;
      span.style.setProperty('--atraso', (i * escalonamento) + 'ms');
      el.appendChild(span);
      if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.dividido = 'palavras';
  };

  Efeitos.dividirEmLetras = function (el, escalonamento) {
    if (!el || el.dataset.dividido) return;
    if (semMovimento) return;
    escalonamento = escalonamento || 46;

    var letras = Array.prototype.slice.call(el.textContent.trim());
    el.textContent = '';
    letras.forEach(function (letra, i) {
      var span = document.createElement('span');
      span.className = 'letra' + (letra === ' ' ? ' letra--espaco' : '');
      span.textContent = letra === ' ' ? ' ' : letra;
      span.style.setProperty('--atraso', (i * escalonamento) + 'ms');
      el.appendChild(span);
    });
    el.dataset.dividido = 'letras';
  };

  Efeitos.animarLetras = function (el, atrasoInicial) {
    if (!el) return;
    var alvos = el.querySelectorAll('.letra, .palavra');
    Array.prototype.forEach.call(alvos, function (alvo) {
      global.setTimeout(function () { alvo.classList.add('visivel'); }, atrasoInicial || 0);
    });
  };

  /* -----------------------------------------------------------------------
     3. INCLINAÇÃO 3D  (TiltedCard)
     ----------------------------------------------------------------------- */
  Efeitos.inclinar = function (seletor, intensidade) {
    if (!temMouse || semMovimento) return;
    intensidade = intensidade || 7;

    Array.prototype.forEach.call(document.querySelectorAll(seletor), function (card) {
      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width;
        var py = (ev.clientY - r.top) / r.height;
        card.classList.add('inclinando');
        card.style.setProperty('--ry', ((px - 0.5) * intensidade * 2).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * intensidade * 2).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('inclinando');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* -----------------------------------------------------------------------
     4. HOLOFOTE QUE SEGUE O MOUSE  (SpotlightCard)
     ----------------------------------------------------------------------- */
  Efeitos.holofote = function (seletor) {
    if (!temMouse) return;
    Array.prototype.forEach.call(document.querySelectorAll(seletor), function (card) {
      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  };

  /* -----------------------------------------------------------------------
     5. CORAÇÕES AO CLICAR  (ClickSpark)
     ----------------------------------------------------------------------- */
  Efeitos.faiscasDeCoracao = function () {
    if (semMovimento) return;

    document.addEventListener('pointerdown', function (ev) {
      // Não dispara em cima de controles, para não atrapalhar o clique
      if (ev.target.closest && ev.target.closest('button, a, input, .lightbox')) return;

      var quantidade = 7;
      for (var i = 0; i < quantidade; i++) {
        (function (indice) {
          var faisca = document.createElement('span');
          faisca.className = 'faisca';
          faisca.textContent = indice % 2 ? '♥' : '✧';

          var angulo = (Math.PI * 2 * indice) / quantidade + Math.random() * 0.6;
          var raio = 34 + Math.random() * 46;

          faisca.style.left = ev.clientX + 'px';
          faisca.style.top = ev.clientY + 'px';
          faisca.style.setProperty('--dx', (Math.cos(angulo) * raio).toFixed(1) + 'px');
          faisca.style.setProperty('--dy', (Math.sin(angulo) * raio - 26).toFixed(1) + 'px');
          faisca.style.setProperty('--dr', (Math.random() * 220 - 110).toFixed(0) + 'deg');
          faisca.style.fontSize = (11 + Math.random() * 9).toFixed(0) + 'px';
          faisca.style.animationDelay = (indice * 14) + 'ms';

          document.body.appendChild(faisca);
          global.setTimeout(function () { faisca.remove(); }, 1100);
        })(i);
      }
    });
  };

  /* -----------------------------------------------------------------------
     6. CURSOR COM BRILHO
     ----------------------------------------------------------------------- */
  Efeitos.cursorBrilho = function () {
    if (!temMouse || semMovimento) return;

    var brilho = document.createElement('div');
    brilho.className = 'cursor-brilho';
    document.body.appendChild(brilho);

    var alvoX = 0, alvoY = 0, x = 0, y = 0;

    document.addEventListener('mousemove', function (ev) {
      alvoX = ev.clientX;
      alvoY = ev.clientY;
      var interativo = ev.target.closest &&
        ev.target.closest('a, button, .moldura, .galeria__item, .holofote');
      brilho.classList.toggle('grande', !!interativo);
    });

    (function seguir() {
      x += (alvoX - x) * 0.18;
      y += (alvoY - y) * 0.18;
      brilho.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      global.requestAnimationFrame(seguir);
    })();
  };

  /* -----------------------------------------------------------------------
     7. BARRA DE PROGRESSO DA LEITURA
     ----------------------------------------------------------------------- */
  Efeitos.barraDeProgresso = function (barra) {
    if (!barra) return;
    var pendente = false;

    function atualizar() {
      var altura = document.documentElement.scrollHeight - global.innerHeight;
      var pct = altura > 0 ? (global.scrollY / altura) * 100 : 0;
      barra.style.width = Math.min(100, Math.max(0, pct)).toFixed(2) + '%';
      pendente = false;
    }

    global.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      global.requestAnimationFrame(atualizar);
    }, { passive: true });

    atualizar();
  };

  /* -----------------------------------------------------------------------
     8. CONTADOR ANIMADO  (CountUp)
     ----------------------------------------------------------------------- */
  Efeitos.contarAte = function (el, valorFinal, duracao) {
    if (!el) return;
    if (semMovimento) { el.textContent = String(valorFinal); return; }

    duracao = duracao || 1600;
    var inicio = null;

    function passo(t) {
      if (inicio === null) inicio = t;
      var p = Math.min(1, (t - inicio) / duracao);
      var suave = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(valorFinal * suave));
      if (p < 1) global.requestAnimationFrame(passo);
    }

    global.requestAnimationFrame(passo);
  };

  /* -----------------------------------------------------------------------
     9. MARQUEE CURVO  (CurvedLoop)
     ----------------------------------------------------------------------- */
  Efeitos.lacoCurvo = function (svg, texto, opcoes) {
    if (!svg) return;
    opcoes = opcoes || {};

    var velocidade = opcoes.velocidade || 1.1;
    var curva = opcoes.curva != null ? opcoes.curva : 260;
    var idCaminho = 'curva-' + Math.random().toString(36).slice(2, 9);
    var frase = texto.replace(/\s+$/, '') + ' ';

    svg.setAttribute('viewBox', '0 0 1440 200');
    svg.innerHTML =
      '<defs><path id="' + idCaminho + '" d="M-100,60 Q720,' + (60 + curva) + ' 1540,60" fill="none"/></defs>' +
      '<text class="medidor" xml:space="preserve" visibility="hidden">' + frase + '</text>' +
      '<text xml:space="preserve"><textPath href="#' + idCaminho + '" startOffset="0px" xml:space="preserve"></textPath></text>';

    var medidor = svg.querySelector('.medidor');
    var textPath = svg.querySelector('textPath');

    function montar() {
      var largura = medidor.getComputedTextLength();
      if (!largura) { global.requestAnimationFrame(montar); return; }

      var repeticoes = Math.ceil(1900 / largura) + 2;
      textPath.textContent = new Array(repeticoes + 1).join(frase);

      var deslocamento = -largura;
      textPath.setAttribute('startOffset', deslocamento + 'px');

      var direcao = -1;
      var arrastando = false;
      var ultimoX = 0;

      function animar() {
        if (!arrastando) {
          deslocamento += velocidade * direcao;
          if (deslocamento <= -largura) deslocamento += largura;
          if (deslocamento > 0) deslocamento -= largura;
          textPath.setAttribute('startOffset', deslocamento.toFixed(1) + 'px');
        }
        global.requestAnimationFrame(animar);
      }
      if (!semMovimento) global.requestAnimationFrame(animar);

      // Arrastar com o dedo ou o mouse
      svg.addEventListener('pointerdown', function (ev) {
        arrastando = true;
        ultimoX = ev.clientX;
        svg.setPointerCapture(ev.pointerId);
      });
      svg.addEventListener('pointermove', function (ev) {
        if (!arrastando) return;
        var dx = ev.clientX - ultimoX;
        ultimoX = ev.clientX;
        direcao = dx > 0 ? 1 : -1;
        deslocamento += dx;
        if (deslocamento <= -largura) deslocamento += largura;
        if (deslocamento > 0) deslocamento -= largura;
        textPath.setAttribute('startOffset', deslocamento.toFixed(1) + 'px');
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (evento) {
        svg.addEventListener(evento, function () { arrastando = false; });
      });
    }

    montar();
  };

  /* -----------------------------------------------------------------------
     10. PÉTALAS E CORAÇÕES FLUTUANTES  (Particles)
     ----------------------------------------------------------------------- */
  Efeitos.petalas = function (canvas, quantidade) {
    if (!canvas || semMovimento) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var particulas = [];
    var total = quantidade || 26;
    var l = 0, a = 0;
    var pausado = false;

    var cores = ['rgba(247,168,196,', 'rgba(238,123,166,', 'rgba(231,207,156,', 'rgba(251,207,224,'];

    function redimensionar() {
      l = global.innerWidth;
      a = global.innerHeight;
      canvas.width = l * dpr;
      canvas.height = a * dpr;
      canvas.style.width = l + 'px';
      canvas.style.height = a + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function criarParticula(inicial) {
      return {
        x: Math.random() * l,
        y: inicial ? Math.random() * a : -30,
        tamanho: 4 + Math.random() * 9,
        velY: 0.18 + Math.random() * 0.55,
        velX: (Math.random() - 0.5) * 0.36,
        giro: Math.random() * Math.PI * 2,
        velGiro: (Math.random() - 0.5) * 0.016,
        opacidade: 0.16 + Math.random() * 0.34,
        cor: cores[Math.floor(Math.random() * cores.length)],
        coracao: Math.random() > 0.55,
        balanco: Math.random() * Math.PI * 2
      };
    }

    function desenharCoracao(p) {
      var t = p.tamanho;
      ctx.beginPath();
      ctx.moveTo(0, t * 0.32);
      ctx.bezierCurveTo(t * 0.02, t * 0.10, t * 0.42, -t * 0.28, 0, -t * 0.50);
      ctx.bezierCurveTo(-t * 0.42, -t * 0.28, -t * 0.02, t * 0.10, 0, t * 0.32);
      ctx.closePath();
      ctx.fill();
    }

    function desenharPetala(p) {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.tamanho * 0.44, p.tamanho * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function quadro() {
      global.requestAnimationFrame(quadro);
      if (pausado) return;

      ctx.clearRect(0, 0, l, a);

      for (var i = 0; i < particulas.length; i++) {
        var p = particulas[i];
        p.balanco += 0.012;
        p.y += p.velY;
        p.x += p.velX + Math.sin(p.balanco) * 0.34;
        p.giro += p.velGiro;

        if (p.y > a + 40) particulas[i] = criarParticula(false);
        if (p.x < -40) p.x = l + 30;
        if (p.x > l + 40) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.fillStyle = p.cor + p.opacidade + ')';
        if (p.coracao) desenharCoracao(p); else desenharPetala(p);
        ctx.restore();
      }
    }

    redimensionar();
    for (var i = 0; i < total; i++) particulas.push(criarParticula(true));
    global.addEventListener('resize', redimensionar);
    document.addEventListener('visibilitychange', function () { pausado = document.hidden; });
    global.requestAnimationFrame(quadro);
  };

  /* -----------------------------------------------------------------------
     11. TRILHO DA LINHA DO TEMPO
     ----------------------------------------------------------------------- */
  Efeitos.trilho = function (secao, preenchimento) {
    if (!secao || !preenchimento) return;
    var pendente = false;

    function atualizar() {
      var r = secao.getBoundingClientRect();
      var meio = global.innerHeight * 0.55;
      var pct = ((meio - r.top) / r.height) * 100;
      preenchimento.style.setProperty('--preenchido', Math.min(100, Math.max(0, pct)).toFixed(1) + '%');
      pendente = false;
    }

    global.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      global.requestAnimationFrame(atualizar);
    }, { passive: true });

    global.addEventListener('resize', atualizar);
    atualizar();
  };

  /* -----------------------------------------------------------------------
     12. CARTAS EMPILHADAS  (ScrollStack)
     Cada carta encolhe e desfoca conforme a próxima sobe por cima.
     ----------------------------------------------------------------------- */
  Efeitos.empilhar = function (seletor) {
    var cartas = Array.prototype.slice.call(document.querySelectorAll(seletor));
    if (!cartas.length) return;

    var pendente = false;

    function atualizar() {
      var topo = parseFloat(global.getComputedStyle(cartas[0]).top) || 120;

      cartas.forEach(function (carta, i) {
        var r = carta.getBoundingClientRect();
        var restantes = cartas.length - 1 - i;
        // Quanto a carta já "grudou" no topo, de 0 a 1
        var progresso = Math.min(1, Math.max(0, (topo - r.top) / (r.height * 0.85)));
        if (restantes === 0) progresso = 0;

        var escala = 1 - progresso * 0.09;
        var desfoque = progresso * 3.2;
        var deslocamento = progresso * -14;

        carta.style.transform = 'translateY(' + deslocamento.toFixed(1) + 'px) scale(' + escala.toFixed(3) + ')';
        carta.style.filter = desfoque > 0.15 ? 'blur(' + desfoque.toFixed(2) + 'px)' : '';
        carta.style.opacity = (1 - progresso * 0.28).toFixed(3);
      });

      pendente = false;
    }

    if (semMovimento) return;

    global.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      global.requestAnimationFrame(atualizar);
    }, { passive: true });

    global.addEventListener('resize', atualizar);
    atualizar();
  };

  /* -----------------------------------------------------------------------
     13. MÁQUINA DE ESCREVER  (TextType)
     ----------------------------------------------------------------------- */
  Efeitos.digitar = function (el, texto, velocidade) {
    if (!el) return;
    if (semMovimento) { el.textContent = texto; return; }

    velocidade = velocidade || 42;
    el.textContent = '';
    var i = 0;

    (function escrever() {
      if (i >= texto.length) return;
      el.textContent += texto.charAt(i);
      i++;
      // Pausa um pouco mais depois de pontuação, fica mais natural
      var pausa = /[.,!?…]/.test(texto.charAt(i - 1)) ? velocidade * 8 : velocidade;
      global.setTimeout(escrever, pausa);
    })();
  };

  /* -----------------------------------------------------------------------
     14. LIGHTBOX DA GALERIA
     ----------------------------------------------------------------------- */
  Efeitos.lightbox = function (itens) {
    if (!itens.length) return;

    var caixa = document.createElement('div');
    caixa.className = 'lightbox';
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-label', 'Foto ampliada');
    caixa.innerHTML =
      '<figure class="lightbox__figura">' +
      '  <img alt="">' +
      '  <figcaption class="lightbox__legenda"></figcaption>' +
      '  <button class="lightbox__fechar" type="button" aria-label="Fechar">' +
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '  </button>' +
      '  <button class="lightbox__nav lightbox__nav--ant" type="button" aria-label="Foto anterior">' +
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>' +
      '  </button>' +
      '  <button class="lightbox__nav lightbox__nav--prox" type="button" aria-label="Próxima foto">' +
      '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>' +
      '  </button>' +
      '</figure>';
    document.body.appendChild(caixa);

    var img = caixa.querySelector('img');
    var legenda = caixa.querySelector('.lightbox__legenda');
    var atual = 0;
    var focoAnterior = null;

    function mostrar(indice) {
      atual = (indice + itens.length) % itens.length;
      var item = itens[atual];
      img.src = item.foto;
      img.alt = item.alt || item.legenda || 'Foto do casal';
      legenda.textContent = item.legenda || '';
    }

    function abrir(indice) {
      focoAnterior = document.activeElement;
      mostrar(indice);
      caixa.classList.add('aberto');
      document.body.classList.add('travado');
      caixa.querySelector('.lightbox__fechar').focus();
    }

    function fechar() {
      caixa.classList.remove('aberto');
      document.body.classList.remove('travado');
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    }

    caixa.querySelector('.lightbox__fechar').addEventListener('click', fechar);
    caixa.querySelector('.lightbox__nav--ant').addEventListener('click', function () { mostrar(atual - 1); });
    caixa.querySelector('.lightbox__nav--prox').addEventListener('click', function () { mostrar(atual + 1); });
    caixa.addEventListener('click', function (ev) { if (ev.target === caixa) fechar(); });

    document.addEventListener('keydown', function (ev) {
      if (!caixa.classList.contains('aberto')) return;
      if (ev.key === 'Escape') fechar();
      if (ev.key === 'ArrowLeft') mostrar(atual - 1);
      if (ev.key === 'ArrowRight') mostrar(atual + 1);
    });

    return { abrir: abrir, fechar: fechar };
  };

  /* -----------------------------------------------------------------------
     15. ASSINATURA QUE SE DESENHA
     ----------------------------------------------------------------------- */
  Efeitos.desenharAssinatura = function (svg) {
    if (!svg) return;
    var caminho = svg.querySelector('path');
    if (!caminho) return;

    var comprimento = caminho.getTotalLength();
    svg.style.setProperty('--comprimento', comprimento);
    Efeitos.revelar(svg, { limiar: 0.4 });
  };

  global.Efeitos = Efeitos;
})(window);
