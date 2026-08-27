/* =========================================================================
   Aurora — fundo animado em WebGL
   Baseado no componente "Aurora" do ReactBits, portado de React + ogl
   para WebGL2 puro (sem dependências, sem etapa de build).
   Se o navegador não tiver WebGL2, o degradê CSS de reserva continua valendo.
   ========================================================================= */

(function (global) {
  'use strict';

  var VERT = [
    '#version 300 es',
    'in vec2 position;',
    'void main() { gl_Position = vec4(position, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    '',
    'uniform float uTime;',
    'uniform float uAmplitude;',
    'uniform vec3  uColorStops[3];',
    'uniform vec2  uResolution;',
    'uniform float uBlend;',
    '',
    'out vec4 fragColor;',
    '',
    'vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }',
    '',
    'float snoise(vec2 v) {',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439,',
    '                     -0.577350269189626, 0.024390243902439);',
    '  vec2 i  = floor(v + dot(v, C.yy));',
    '  vec2 x0 = v - i + dot(i, C.xx);',
    '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz;',
    '  x12.xy -= i1;',
    '  i = mod(i, 289.0);',
    '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
    '  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);',
    '  m = m * m; m = m * m;',
    '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
    '  vec3 h = abs(x) - 0.5;',
    '  vec3 ox = floor(x + 0.5);',
    '  vec3 a0 = x - ox;',
    '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
    '  vec3 g;',
    '  g.x  = a0.x  * x0.x  + h.x  * x0.y;',
    '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',
    '',
    'struct ColorStop { vec3 color; float position; };',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / uResolution;',
    '',
    '  ColorStop colors[3];',
    '  colors[0] = ColorStop(uColorStops[0], 0.0);',
    '  colors[1] = ColorStop(uColorStops[1], 0.5);',
    '  colors[2] = ColorStop(uColorStops[2], 1.0);',
    '',
    '  int index = 0;',
    '  for (int i = 0; i < 2; i++) {',
    '    bool isInBetween = colors[i].position <= uv.x;',
    '    index = int(mix(float(index), float(i), float(isInBetween)));',
    '  }',
    '  ColorStop atual = colors[index];',
    '  ColorStop proximo = colors[index + 1];',
    '  float faixa = proximo.position - atual.position;',
    '  float fator = (uv.x - atual.position) / faixa;',
    '  vec3 rampColor = mix(atual.color, proximo.color, fator);',
    '',
    '  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;',
    '  height = exp(height);',
    '  height = (uv.y * 2.0 - height + 0.2);',
    '  float intensity = 0.6 * height;',
    '',
    '  float midPoint = 0.20;',
    '  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);',
    '',
    // Adaptação para fundo claro: no componente original a cor é multiplicada
    // pela intensidade, o que sobre um fundo rosa vira uma mancha acinzentada.
    // Aqui a cor mantém o matiz e quem desenha a forma da aurora é o alfa.
    '  vec3 auroraColor = rampColor * (0.86 + 0.30 * clamp(intensity, 0.0, 1.0));',
    '  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);',
    '}'
  ].join('\n');

  function hexParaRgb(hex) {
    var limpo = hex.replace('#', '');
    if (limpo.length === 3) {
      limpo = limpo[0] + limpo[0] + limpo[1] + limpo[1] + limpo[2] + limpo[2];
    }
    var num = parseInt(limpo, 16);
    // Sem conversão para espaço linear: o shader espera o valor direto de 0 a 1,
    // como no componente original. Converter aqui deixaria o rosa escuro demais.
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    ];
  }

  function compilar(gl, tipo, fonte) {
    var shader = gl.createShader(tipo);
    gl.shaderSource(shader, fonte);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Aurora — falha ao compilar shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /**
   * Inicia a aurora dentro de um elemento.
   * @param {HTMLElement} alvo    contêiner que receberá o canvas
   * @param {Object}      opcoes  { cores, amplitude, mistura, velocidade }
   * @returns {Object|null}       { destruir() } ou null se não houver WebGL2
   */
  function criarAurora(alvo, opcoes) {
    if (!alvo) return null;
    opcoes = opcoes || {};

    var cores = opcoes.cores || ['#F7A8C4', '#EE7BA6', '#E7CF9C'];
    var amplitude = opcoes.amplitude != null ? opcoes.amplitude : 1.0;
    var mistura = opcoes.mistura != null ? opcoes.mistura : 0.55;
    var velocidade = opcoes.velocidade != null ? opcoes.velocidade : 0.7;

    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    if (!gl) return null;

    var vs = compilar(gl, gl.VERTEX_SHADER, VERT);
    var fs = compilar(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    var programa = gl.createProgram();
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
      console.warn('Aurora — falha ao ligar o programa:', gl.getProgramInfoLog(programa));
      return null;
    }
    gl.useProgram(programa);

    // Triângulo que cobre a tela inteira
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(programa, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uTime = gl.getUniformLocation(programa, 'uTime');
    var uAmplitude = gl.getUniformLocation(programa, 'uAmplitude');
    var uResolution = gl.getUniformLocation(programa, 'uResolution');
    var uBlend = gl.getUniformLocation(programa, 'uBlend');
    var uColorStops = gl.getUniformLocation(programa, 'uColorStops');

    var paleta = new Float32Array(9);
    cores.slice(0, 3).forEach(function (hex, i) {
      var rgb = hexParaRgb(hex);
      paleta[i * 3] = rgb[0];
      paleta[i * 3 + 1] = rgb[1];
      paleta[i * 3 + 2] = rgb[2];
    });
    gl.uniform3fv(uColorStops, paleta);
    gl.uniform1f(uAmplitude, amplitude);
    gl.uniform1f(uBlend, mistura);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    alvo.appendChild(canvas);
    // Com WebGL ativo, o degradê CSS de reserva sai de cena
    alvo.classList.add('com-webgl');

    function redimensionar() {
      var dpr = Math.min(global.devicePixelRatio || 1, 1.75);
      var l = Math.max(1, Math.floor(alvo.clientWidth * dpr));
      var a = Math.max(1, Math.floor(alvo.clientHeight * dpr));
      if (canvas.width !== l || canvas.height !== a) {
        canvas.width = l;
        canvas.height = a;
        gl.viewport(0, 0, l, a);
        gl.uniform2f(uResolution, l, a);
      }
    }

    var quadro = 0;
    var pausado = false;

    function desenhar(t) {
      quadro = global.requestAnimationFrame(desenhar);
      if (pausado) return;
      redimensionar();
      gl.uniform1f(uTime, t * 0.001 * velocidade);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    redimensionar();
    quadro = global.requestAnimationFrame(desenhar);

    // Economiza bateria quando a seção sai da tela ou a aba fica oculta
    var observador = null;
    if (global.IntersectionObserver) {
      observador = new IntersectionObserver(function (entradas) {
        pausado = !entradas[0].isIntersecting;
      }, { threshold: 0 });
      observador.observe(alvo);
    }

    function aoTrocarAba() { pausado = document.hidden; }
    document.addEventListener('visibilitychange', aoTrocarAba);
    global.addEventListener('resize', redimensionar);

    return {
      destruir: function () {
        global.cancelAnimationFrame(quadro);
        global.removeEventListener('resize', redimensionar);
        document.removeEventListener('visibilitychange', aoTrocarAba);
        if (observador) observador.disconnect();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        var perder = gl.getExtension('WEBGL_lose_context');
        if (perder) perder.loseContext();
      }
    };
  }

  global.Aurora = { criar: criarAurora };
})(window);
