/* =========================================================================
   CONTEÚDO DA PÁGINA
   Este é o único arquivo que você precisa mexer para trocar textos e fotos.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Data em que começamos a namorar: 2 de março de 2025.
   É a partir dela que o contador da página conta os dias juntos.
   (Formato: ANO-MÊS-DIA T HORA. Está à meia-noite, então a contagem é em
   dias de calendário; se quiser a hora exata do pedido, é só trocar.)
   ------------------------------------------------------------------------- */
var DATA_DO_NAMORO = '2025-03-02T00:00:00';

/* Nome que aparece no hero e nas assinaturas */
var PESSOAS = {
  dela: 'Rayssa',
  dele: 'Cauã',
  apelido: 'Minha boneca'
};

/* -------------------------------------------------------------------------
   OS CAPÍTULOS DA NOSSA HISTÓRIA
   foco: onde a foto deve ser "ancorada" no recorte (X Y)
   proporcao: formato do recorte na linha do tempo
   ------------------------------------------------------------------------- */
var CAPITULOS = [
  {
    foto: 'public/FOTO%201.jpeg',
    foco: 'center 34%',
    proporcao: '16 / 10',
    legenda: 'o começo',
    titulo: 'O início de tudo',
    paragrafos: [
      'Início de tudo. Nesse momento eu tava com vergonha de tirar foto contigo KKKKKKK, mas mesmo assim fui — porque queria postar, né?',
      'Mal sabia eu que ali eu já estava apaixonado por quem você era e por tudo o que eu conhecia de você.'
    ]
  },
  {
    foto: 'public/FOTO%202.jpeg',
    foco: 'center 26%',
    proporcao: '4 / 5',
    legenda: 'nosso primeiro date',
    titulo: 'A primeira saída, só nós dois',
    paragrafos: [
      'Nossa primeira saída juntos — o nosso date. Eu tava muito feliz de poder ir ao cinema contigo, sair junto e ficar olhando várias lojas.',
      'Acho que aquele dia representa bastante o nosso futuro: eu vejo a gente facilmente assim, saindo junto e feliz só com a nossa própria companhia. A partir dali eu já estava decidido de que era você.'
    ]
  },
  {
    foto: 'public/FOTO%203.jpeg',
    foco: 'center 38%',
    proporcao: '16 / 10',
    legenda: 'sua voz na igreja',
    titulo: 'Você louvando na minha igreja',
    paragrafos: [
      'Primeira vez que eu te vi na minha igreja — e ainda tocandooo! Fiquei muito feliz e orgulhoso demais de quem é a minha namorada.',
      'Você lá, cantando e louvando. Com certeza a sua voz e a sua ministração são algo grandioso e abençoado. Eu sou eternamente grato por ter uma namorada abençoada e iluminada, cheia de talentos e da presença de Deus!'
    ]
  },
  {
    foto: 'public/FOTO%204.jpeg',
    foco: 'center 42%',
    proporcao: '4 / 5',
    legenda: 'o primeiro abraço',
    titulo: 'A primeira vez bem juntinhos',
    paragrafos: [
      'Essa foi basicamente a primeira vez que a gente se conectou fisicamente — a primeira vez abraçados, digamos assim KKKKKKK.',
      'Fiquei muito feliz nesse dia, porque foi a partir dele que a gente começou a se abraçar e a ficar bem mais juntinho. Coisa que hoje eu não consigo mais viver sem, KWKWKWKW.'
    ]
  },
  {
    foto: 'public/FOTO%205.jpeg',
    foco: 'center 34%',
    proporcao: '16 / 10',
    legenda: 'servindo juntos',
    titulo: 'Nossa primeira EBF',
    paragrafos: [
      'Primeira EBF juntos! Aqui eu vejo claramente que foi a primeira vez de algo que a gente vai fazer todo ano, pelo resto da vida.',
      'Sou extremamente feliz servindo ao seu lado, amor. Você é incrível, me inspira demais e com certeza é a minha pessoa favorita em Cristo também!!'
    ]
  },
  {
    foto: 'public/FOTO%206.jpeg',
    foco: 'center 46%',
    proporcao: '4 / 5',
    legenda: 'descansa aqui',
    titulo: 'Você dormindo no meu peito',
    paragrafos: [
      'Eu tava pensando em colocar uma foto do pedido de namoro ou de você dormindo. Pra não ser óbvio, deixei o pedido de fora e escolhi um momento que, pra mim, também foi muito marcante KKKKKK.',
      'Do nada você deitar no meu peito e dormir… eu admito que fiquei muito feliz nesse dia, por você ter essa confiança em mim e poder descansar comigo. Sempre que precisar, tô aqui pra ser o seu travesseiro, KWKWKWKW.'
    ]
  },
  {
    foto: 'public/FOTO%207.jpeg',
    foco: 'center 40%',
    proporcao: '4 / 5',
    legenda: 'parabéns, amor',
    titulo: 'O seu aniversário',
    paragrafos: [
      'SEU ANIVERSÁRIOOOO! Um dia em que eu fiquei muito feliz. Mesmo você doentinha, foi bom ficar boa parte do dia com você, podendo te ajudar a não passar o aniversário sozinha e te fazer companhia.',
      'Foi muito bom o tempo que a gente passou junto — e poder te entregar o buquê no meio dos parabéns, alguns dias depois, também. Foram momentos marcantes, que com certeza eu quero repetir, só que ainda melhores.'
    ]
  },
  {
    foto: 'public/FOTO%208.jpeg',
    foco: '66% 52%',
    proporcao: '16 / 10',
    legenda: 'nossa primeira praia',
    titulo: 'A viagem que me deu certeza',
    paragrafos: [
      'Primeira vez na praia juntos!! Foi uma luta pra gente conseguir ir (eu, né KKKK), mas graças a Deus deu certo.',
      'Foram momentos muito felizes: poder viajar contigo e passar mais dias seguidos ao seu lado. Esses dias na praia me deram a certeza de que é com você que eu quero passar a minha vida inteira — todos os dias acordar com você e ir dormir com você.'
    ]
  },
  {
    foto: 'public/FOTO%209.jpeg',
    foco: 'center 42%',
    proporcao: '4 / 5',
    legenda: 'nosso primeiro 12 de junho',
    titulo: 'Nosso primeiro Dia dos Namorados',
    paragrafos: [
      'Primeiro Dia dos Namorados juntos! Foram muitos preparativos dos presentes e, graças a Deus, deu tudo certo. Consegui te entregar umas coisinhas — você merece muito mais, claro.',
      'Mas acho que consegui deixar esse primeiro Dia dos Namorados marcante pra nós. Foi um dia maravilhoso, em que eu percebi claramente a graça de Deus sobre as nossas vidas.'
    ]
  },
  {
    foto: 'public/FOTO%2010.jpeg',
    foco: 'center 32%',
    proporcao: '4 / 5',
    legenda: 'a mulher mais linda do mundo',
    titulo: 'E, no fim, sempre você',
    paragrafos: [
      'E, por fim, não dava pra terminar sem ser com a mulher mais linda desse mundo, né?',
      'Só quero te dizer que eu te amo, amor. Tô fazendo isso pra te lembrar que eu quero ser pra sempre a sua pessoa, e que eu quero te ter pra sempreeee. Que a cada dia a gente possa se amar mais, esperar um pelo outro, e que a presença de Deus esteja sempre no nosso relacionamento. É pelo nosso futuro que eu oro todos os dias — poder viver contigo pra sempre!!!'
    ]
  }
];

/* -------------------------------------------------------------------------
   O QUE EU AMO EM VOCÊ
   ------------------------------------------------------------------------- */
var MOTIVOS = [
  {
    icone: 'sorriso',
    titulo: 'O seu sorriso',
    texto: 'Você tem o meu sorriso favorito desse mundo. Não tem dia ruim que resista a ele.'
  },
  {
    icone: 'musica',
    titulo: 'A sua voz',
    texto: 'Te ver cantando e louvando é uma das coisas mais bonitas que eu já vi. Sua ministração é grandiosa e abençoada.'
  },
  {
    icone: 'cruz',
    titulo: 'A sua fé',
    texto: 'Você é a minha pessoa favorita em Cristo. Me inspira a ser melhor e a buscar mais de Deus todos os dias.'
  },
  {
    icone: 'casa',
    titulo: 'A sua companhia',
    texto: 'A gente não precisa de nada demais. Só de estar do seu lado já é o meu lugar favorito.'
  },
  {
    icone: 'coracao',
    titulo: 'A sua confiança',
    texto: 'Você deitar no meu peito e dormir me mostrou o quanto você se sente segura comigo. Isso é tudo pra mim.'
  },
  {
    icone: 'estrela',
    titulo: 'O seu jeito',
    texto: 'Desde que entrou na minha vida, você deixou tudo mais divertido, mais alegre e mais amoroso.'
  }
];

/* -------------------------------------------------------------------------
   PROMESSAS (cartas empilhadas)
   ------------------------------------------------------------------------- */
var PROMESSAS = [
  {
    titulo: 'Prometo te escolher todos os dias',
    texto: 'Não só nos dias bonitos e fáceis. Nos dias cansados, nos dias doentinha, nos dias em que a gente não concorda. Sempre vou te escolher.'
  },
  {
    titulo: 'Prometo servir ao seu lado',
    texto: 'Que cada EBF, cada louvor e cada trabalho na casa de Deus seja mais uma primeira vez de algo que a gente vai fazer pelo resto da vida.'
  },
  {
    titulo: 'Prometo sempre estar aqui',
    texto: 'Sempre que precisar, eu tô aqui pra ser o seu travesseiro, o seu abraço e o seu lugar seguro.'
  },
  {
    titulo: 'Prometo esperar por você',
    texto: 'No tempo de Deus, do jeito de Deus. Sem pressa e sem atalho, porque o que é nosso vai ser construído do jeito certo.'
  },
  {
    titulo: 'Prometo orar pelo nosso futuro',
    texto: 'Todos os dias. Que a presença de Deus esteja sempre no nosso relacionamento e que a gente possa viver junto pra sempre.'
  }
];

/* -------------------------------------------------------------------------
   VERSÍCULO
   ------------------------------------------------------------------------- */
var VERSICULO = {
  texto: 'Se alguém quiser prevalecer contra um, os dois lhe resistirão; e o cordão de três dobras não se quebra tão depressa.',
  fonte: 'Eclesiastes 4:12'
};
