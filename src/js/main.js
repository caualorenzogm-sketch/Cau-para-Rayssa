/* =========================================================================
   Montagem da página
   Lê o conteúdo de historia.js, constrói as seções e liga os efeitos.
   ========================================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Ícones (SVG de traço — nada de emoji como ícone)
     ----------------------------------------------------------------------- */
  var ICONES = {
    sorriso: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.2s1.4 1.8 3.5 1.8 3.5-1.8 3.5-1.8"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    musica: '<path d="M9 18V5.5L20 3.5V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    cruz: '<path d="M10 2.8h4v5.4h5.4v4H14V21.2h-4V12.2H4.6v-4H10z"/>',
    casa: '<path d="M3.2 9.8 12 3.2l8.8 6.6V20.8H3.2z"/><path d="M9.2 20.8v-6.6h5.6v6.6"/>',
    coracao: '<path d="M20.4 5.9a5.2 5.2 0 0 0-7.4 0L12 7l-1-1.1a5.2 5.2 0 0 0-7.4 7.4l.9.9L12 21.4l7.5-7.2.9-.9a5.2 5.2 0 0 0 0-7.4z"/>',
    estrela: '<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>'
  };

  function icone(nome) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONES[nome] || ICONES.coracao) + '</svg>';
  }

  function coracaoCheio(classe) {
    return '<svg class="coracao-svg ' + (classe || '') + '" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M20.4 5.9a5.2 5.2 0 0 0-7.4 0L12 7l-1-1.1a5.2 5.2 0 0 0-7.4 7.4l.9.9L12 21.4l7.5-7.2.9-.9a5.2 5.2 0 0 0 0-7.4z"/></svg>';
  }

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };

  /* -----------------------------------------------------------------------
     1. LINHA DO TEMPO
     ----------------------------------------------------------------------- */
  function montarCapitulos() {
    var alvo = $('#lista-capitulos');
    if (!alvo) return;

    var html = CAPITULOS.map(function (cap, i) {
      var invertido = i % 2 === 1;
      var numero = String(i + 1).padStart(2, '0');
      var inclinacao = invertido ? 'girar-dir' : 'girar-esq';

      var paragrafos = cap.paragrafos.map(function (p) {
        return '<p class="capitulo__corpo">' + p + '</p>';
      }).join('');

      return '' +
        '<article class="capitulo' + (invertido ? ' capitulo--invertido' : '') + '">' +
        '  <span class="capitulo__ponto" aria-hidden="true"></span>' +
        '  <div class="capitulo__midia" data-revelar="' + (invertido ? 'direita' : 'esquerda') + '">' +
        '    <span class="capitulo__numero" aria-hidden="true">' + numero + '</span>' +
        '    <figure class="moldura ' + inclinacao + '">' +
        '      <span class="moldura__fita" aria-hidden="true"></span>' +
        '      <div class="moldura__midia" style="--proporcao: ' + cap.proporcao + '; --foco: ' + cap.foco + ';">' +
        '        <img src="' + cap.foto + '" alt="' + cap.titulo + '" loading="lazy" decoding="async">' +
        '      </div>' +
        '      <figcaption class="moldura__legenda">' + cap.legenda + '</figcaption>' +
        '    </figure>' +
        '  </div>' +
        '  <div class="capitulo__texto" data-revelar="' + (invertido ? 'esquerda' : 'direita') + '">' +
        '    <span class="rotulo">Capítulo ' + numero + '</span>' +
        '    <h3 class="capitulo__titulo">' + cap.titulo + '</h3>' +
        paragrafos +
        '  </div>' +
        '</article>';
    }).join('');

    alvo.innerHTML = html;

    // O ponto do trilho acende quando o capítulo entra na tela
    Efeitos.revelar('.capitulo', { limiar: 0.22, repetir: true });
  }

  /* -----------------------------------------------------------------------
     2. GALERIA
     ----------------------------------------------------------------------- */
  function montarGaleria() {
    var alvo = $('#mosaico-galeria');
    if (!alvo) return;

    var fotos = [{
      foto: 'euerayssa.jpg',
      legenda: 'eu e você',
      titulo: 'Eu e Rayssa'
    }].concat(CAPITULOS.map(function (cap) {
      return { foto: cap.foto, legenda: cap.legenda, titulo: cap.titulo };
    }));

    alvo.innerHTML = fotos.map(function (item, i) {
      return '' +
        '<button class="galeria__item" type="button" data-indice="' + i + '" ' +
        '        data-legenda="' + item.legenda + '" aria-label="Ampliar: ' + item.titulo + '" data-revelar="zoom" ' +
        '        style="--atraso: ' + (i % 3) * 90 + 'ms">' +
        '  <img src="' + item.foto + '" alt="' + item.titulo + '" loading="lazy" decoding="async">' +
        '</button>';
    }).join('');

    var caixa = Efeitos.lightbox(fotos.map(function (f) {
      return { foto: f.foto, legenda: f.legenda, alt: f.titulo };
    }));

    alvo.addEventListener('click', function (ev) {
      var botao = ev.target.closest('.galeria__item');
      if (botao && caixa) caixa.abrir(Number(botao.dataset.indice));
    });
  }

  /* -----------------------------------------------------------------------
     3. MOTIVOS
     ----------------------------------------------------------------------- */
  function montarMotivos() {
    var alvo = $('#grade-motivos');
    if (!alvo) return;

    alvo.innerHTML = MOTIVOS.map(function (m, i) {
      return '' +
        '<article class="motivo holofote" data-revelar style="--atraso: ' + (i % 3) * 110 + 'ms">' +
        '  <span class="motivo__icone">' + icone(m.icone) + '</span>' +
        '  <h3 class="motivo__titulo">' + m.titulo + '</h3>' +
        '  <p class="motivo__texto">' + m.texto + '</p>' +
        '</article>';
    }).join('');

    Efeitos.holofote('.motivo');
  }

  /* -----------------------------------------------------------------------
     4. PROMESSAS (cartas empilhadas)
     ----------------------------------------------------------------------- */
  function montarPromessas() {
    var alvo = $('#pilha-promessas');
    if (!alvo) return;

    alvo.innerHTML = PROMESSAS.map(function (p, i) {
      return '' +
        '<article class="promessa" style="z-index: ' + (i + 1) + '">' +
        '  <span class="promessa__coracao" aria-hidden="true">' + coracaoCheio() + '</span>' +
        '  <span class="promessa__indice">Promessa ' + String(i + 1).padStart(2, '0') + '</span>' +
        '  <h3 class="promessa__titulo">' + p.titulo + '</h3>' +
        '  <p class="promessa__texto">' + p.texto + '</p>' +
        '</article>';
    }).join('');

    Efeitos.empilhar('.promessa');
  }

  /* -----------------------------------------------------------------------
     5. CONTADOR AO VIVO
     ----------------------------------------------------------------------- */
  function montarContador() {
    var secao = $('#contador');
    if (!secao) return;

    var inicio = new Date(DATA_DO_NAMORO);
    if (isNaN(inicio.getTime()) || inicio.getTime() > Date.now()) {
      secao.remove();
      return;
    }

    var campos = {
      dias: $('[data-unidade="dias"]', secao),
      horas: $('[data-unidade="horas"]', secao),
      minutos: $('[data-unidade="minutos"]', secao),
      segundos: $('[data-unidade="segundos"]', secao)
    };

    function calcular() {
      var total = Math.floor((Date.now() - inicio.getTime()) / 1000);
      return {
        dias: Math.floor(total / 86400),
        horas: Math.floor(total / 3600) % 24,
        minutos: Math.floor(total / 60) % 60,
        segundos: total % 60
      };
    }

    function pintar() {
      var v = calcular();
      campos.dias.textContent = v.dias;
      campos.horas.textContent = String(v.horas).padStart(2, '0');
      campos.minutos.textContent = String(v.minutos).padStart(2, '0');
      campos.segundos.textContent = String(v.segundos).padStart(2, '0');
    }

    // Na primeira aparição, os dias sobem contando; depois passa a tiquetaquear
    var jaAnimou = false;
    Efeitos.revelar(secao, {
      limiar: 0.3,
      aoRevelar: function () {
        if (jaAnimou) return;
        jaAnimou = true;
        var v = calcular();
        Efeitos.contarAte(campos.dias, v.dias, 1800);
        setTimeout(function () { setInterval(pintar, 1000); pintar(); }, 1900);
        campos.horas.textContent = String(v.horas).padStart(2, '0');
        campos.minutos.textContent = String(v.minutos).padStart(2, '0');
        campos.segundos.textContent = String(v.segundos).padStart(2, '0');
      }
    });
  }

  /* -----------------------------------------------------------------------
     6. VERSÍCULO
     ----------------------------------------------------------------------- */
  function montarVersiculo() {
    var citacao = $('#versiculo-texto');
    var fonte = $('#versiculo-fonte');
    if (!citacao || !fonte) return;

    citacao.textContent = '“' + VERSICULO.texto + '”';
    fonte.textContent = VERSICULO.fonte;

    Efeitos.dividirEmPalavras(citacao, 62);
    Efeitos.revelar(citacao, { limiar: 0.3 });
  }

  /* -----------------------------------------------------------------------
     7. ABERTURA — o envelope
     ----------------------------------------------------------------------- */
  function montarAbertura(aoAbrir) {
    var abertura = $('#abertura');
    var botao = $('#abrir-carta');
    if (!abertura || !botao) { aoAbrir(); return; }

    document.body.classList.add('travado');

    botao.addEventListener('click', function () {
      abertura.classList.add('fechada');
      document.body.classList.remove('travado');
      setTimeout(function () { abertura.remove(); }, 1100);
      aoAbrir();

      var musica = $('#audio-musica');
      if (musica && musica.dataset.pronto === 'sim') {
        musica.play().then(function () {
          $('#botao-musica').classList.add('tocando');
        }).catch(function () { /* o navegador pode barrar; o botão continua ali */ });
      }
    }, { once: true });
  }

  /* -----------------------------------------------------------------------
     8. HERO
     ----------------------------------------------------------------------- */
  function animarHero() {
    var nome = $('#hero-nome');
    var frase = $('#hero-frase');
    // Com movimento reduzido o texto aparece de uma vez, sem espera
    var esperaNome = Efeitos.semMovimento ? 0 : 260;
    var esperaFrase = Efeitos.semMovimento ? 0 : 1000;

    if (nome) {
      Efeitos.dividirEmLetras(nome, 52);
      setTimeout(function () { Efeitos.animarLetras(nome); }, esperaNome);
    }
    if (frase) {
      Efeitos.dividirEmPalavras(frase, 34);
      setTimeout(function () { Efeitos.animarLetras(frase); }, esperaFrase);
    }

    var aurora = $('#hero-aurora');
    if (aurora && !Efeitos.semMovimento && window.Aurora) {
      window.Aurora.criar(aurora, {
        cores: ['#FFB8D2', '#F98FB8', '#F2D9A9'],
        amplitude: 0.72,
        mistura: 0.95,
        velocidade: 0.5
      });
    }
  }

  /* -----------------------------------------------------------------------
     9. MÚSICA (opcional — basta colocar public/musica.mp3)
     ----------------------------------------------------------------------- */
  function montarMusica() {
    var audio = $('#audio-musica');
    var botao = $('#botao-musica');
    if (!audio || !botao) return;

    audio.addEventListener('canplaythrough', function () {
      audio.dataset.pronto = 'sim';
      botao.classList.add('disponivel');
    });

    botao.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        botao.classList.add('tocando');
        botao.querySelector('.musica__rotulo').textContent = 'Nossa música';
      } else {
        audio.pause();
        botao.classList.remove('tocando');
        botao.querySelector('.musica__rotulo').textContent = 'Tocar música';
      }
    });
  }

  /* -----------------------------------------------------------------------
     10. NOMES DINÂMICOS
     ----------------------------------------------------------------------- */
  function aplicarNomes() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-nome]'), function (el) {
      var chave = el.dataset.nome;
      if (PESSOAS[chave]) el.textContent = PESSOAS[chave];
    });
  }

  /* -----------------------------------------------------------------------
     INÍCIO
     ----------------------------------------------------------------------- */
  function iniciar() {
    aplicarNomes();
    montarCapitulos();
    montarGaleria();
    montarMotivos();
    montarPromessas();
    montarContador();
    montarVersiculo();
    montarMusica();

    // Efeitos globais
    Efeitos.revelar('[data-revelar]');
    Efeitos.inclinar('.moldura', 6);
    Efeitos.faiscasDeCoracao();
    Efeitos.cursorBrilho();
    Efeitos.barraDeProgresso($('#barra-progresso'));
    Efeitos.petalas($('#canvas-petalas'), 24);
    Efeitos.trilho($('#historia'), $('#trilho-historia'));
    Efeitos.desenharAssinatura($('#traco-assinatura'));

    Efeitos.lacoCurvo(
      $('#laco-curvo'),
      'te amo  ♥  minha boneca  ♥  pra sempre  ♥  ',
      { velocidade: 0.9, curva: 150 }
    );

    // Título da carta e do final, palavra por palavra
    Array.prototype.forEach.call(document.querySelectorAll('[data-dividir]'), function (el) {
      Efeitos.dividirEmPalavras(el, 46);
      Efeitos.revelar(el, { limiar: 0.3 });
    });

    montarAbertura(function () {
      animarHero();
      var texto = $('#final-texto');
      if (texto) {
        Efeitos.revelar(texto, {
          limiar: 0.45,
          aoRevelar: function (el) {
            Efeitos.digitar(el, el.dataset.frase || el.textContent, 34);
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
