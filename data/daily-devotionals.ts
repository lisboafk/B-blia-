export interface Devotional {
  id: string
  day: string
  title: string
  reference: string
  book: string
  chapter: number
  verse: number
  verseText: string
  reflection: string
  prayer: string
  theme: string
}

import generatedRaw from './generated.json'

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

function getWeekOfYear(): number {
  return Math.floor(getDayOfYear() / 7)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _gen = generatedRaw as any
const GENERATED_DEVOTIONALS: Devotional[] = (_gen.devotionals || []).map((d: any) => ({
  id: d.id,
  day: d.theme,
  title: d.title,
  theme: d.theme,
  reference: d.reference || '',
  book: d.book || '',
  chapter: d.chapter || 1,
  verse: d.verseNum || 1,
  verseText: d.verse || '',
  reflection: d.content || '',
  prayer: d.prayer || '',
}))

export function getTodayDevotional(): Devotional {
  const all = [...DEVOTIONALS, ...GENERATED_DEVOTIONALS]
  return all[getWeekOfYear() % all.length]
}

export function getAllDevotionals(): Devotional[] {
  return [...DEVOTIONALS, ...GENERATED_DEVOTIONALS]
}

export const DEVOTIONALS: Devotional[] = [
  {
    id: 'sov-1', day: 'Soberania', title: 'O Criador Soberano',
    reference: 'Gênesis 1:1', book: 'genesis', chapter: 1, verse: 1,
    verseText: 'No princípio, criou Deus os céus e a terra.',
    reflection: 'Antes de tudo existir, Deus estava. Sua soberania não começa com a criação — ela a antecede eternamente. Cada manhã é prova de que ele sustenta o que criou. Hoje, reconheça que você não é acidente — é criatura amada pelo Soberano.',
    prayer: 'Senhor, que eu viva hoje consciente de que sou sua criatura. Que sua soberania traga descanso ao meu coração inquieto. A ti seja a glória. Amém.',
    theme: 'Soberania de Deus'
  },
  {
    id: 'just-1', day: 'Justificação', title: 'Paz com Deus',
    reference: 'Romanos 5:1', book: 'romanos', chapter: 5, verse: 1,
    verseText: 'Tendo, pois, sido justificados pela fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo.',
    reflection: 'Essa paz não depende do seu desempenho. Você está em paz com Deus agora, permanentemente, pela obra perfeita de Cristo na cruz. A justificação não é um processo — é um veredicto declarado de uma vez por todas.',
    prayer: 'Pai, obrigado pela paz que excede meu entendimento. Que eu não busque minha aceitação nas obras, mas descanse na justiça de Cristo imputada a mim. Amém.',
    theme: 'Justificação'
  },
  {
    id: 'prov-1', day: 'Providência', title: 'O Bom Pastor',
    reference: 'Salmos 23:1', book: 'salmos', chapter: 23, verse: 1,
    verseText: 'O Senhor é o meu pastor; nada me faltará.',
    reflection: 'Davi aprendeu que o Senhor pastoreia — guia, restaura, protege e supre. "Nada me faltará" não é ingenuidade; é confiança radical no caráter do Pastor que conhece cada uma de suas ovelhas pelo nome.',
    prayer: 'Senhor, reconheço que sou ovelha — dependente, fraca e propensa a me perder. Guia-me hoje pelos teus caminhos. Confio na tua provisão. Amém.',
    theme: 'Providência'
  },
  {
    id: 'grac-1', day: 'Graça', title: 'Dom Imerecido',
    reference: 'Efésios 2:8-9', book: 'efesios', chapter: 2, verse: 8,
    verseText: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus. Não por obras, para que ninguém se glorie.',
    reflection: 'A salvação não é salário — é dom. Paulo destrói qualquer base de auto-glória. Você foi salvo porque Deus quis, não porque mereceu. Isso humilha e liberta ao mesmo tempo. A graça nivela toda diferença humana diante de Deus.',
    prayer: 'Deus da graça, perdoa-me por tentar ganhar o que só pode ser recebido. Que eu viva hoje em gratidão, não em medo. Tua graça é suficiente. Amém.',
    theme: 'Sola Gratia'
  },
  {
    id: 'seg-1', day: 'Segurança', title: 'Nenhuma Condenação',
    reference: 'Romanos 8:1', book: 'romanos', chapter: 8, verse: 1,
    verseText: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.',
    reflection: 'A acusação é uma das armas favoritas do inimigo. Mas Romanos 8:1 fecha a porta: nenhuma condenação. Não alguma — nenhuma. A sentença foi executada em Cristo, não em você. Em Cristo, você é livre.',
    prayer: 'Senhor Jesus, obrigado por carregar minha condenação. Que eu não viva como condenado quando tu me libertaste. Que a tua verdade vença minha acusação interior. Amém.',
    theme: 'Segurança em Cristo'
  },
  {
    id: 'amor-1', day: 'Amor', title: 'Amor que Não Falha',
    reference: 'Romanos 8:38-39', book: 'romanos', chapter: 8, verse: 38,
    verseText: 'Porque estou certo de que nem a morte, nem a vida... nos poderá separar do amor de Deus que está em Cristo Jesus nosso Senhor.',
    reflection: 'Paulo lista toda ameaça possível e declara: nenhuma pode separar o crente do amor de Deus. Esse amor não é flutuante — é eterno, inabalável e garantido pela eleição e pela intercessão de Cristo. Você está amado, completamente.',
    prayer: 'Pai, que este amor imenso encha meu coração de adoração. Que eu ame o próximo como fui amado. A ti toda a glória. Amém.',
    theme: 'Amor de Deus'
  },
  {
    id: 'prov-2', day: 'Providência', title: 'Todas as Coisas Cooperam',
    reference: 'Romanos 8:28', book: 'romanos', chapter: 8, verse: 28,
    verseText: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    reflection: 'A providência soberana não significa que tudo é fácil, mas que tudo é governado. As dificuldades desta semana não escaparam da mão de Deus. Ele as governa para o bem daqueles que o amam.',
    prayer: 'Senhor soberano, que eu descanse sabendo que tudo está em tuas mãos. Obrigado pelas tuas misericórdias renovadas. Tua fidelidade é grande. Amém.',
    theme: 'Providência Soberana'
  },
  {
    id: 'scri-1', day: 'Escritura', title: 'Espada do Espírito',
    reference: 'Hebreus 4:12', book: 'hebreus', chapter: 4, verse: 12,
    verseText: 'Porque a palavra de Deus é viva e eficaz, e mais penetrante do que qualquer espada de dois gumes.',
    reflection: 'A Bíblia não é relíquia do passado — é Palavra viva. Ela expõe, corrige, conforta e transforma. Sola Scriptura não é slogan da Reforma: é reconhecer que Deus ainda fala com autoridade através do texto sagrado.',
    prayer: 'Senhor, que eu não leia tua Palavra como dever, mas como quem tem fome. Faz-me sensível à tua voz nas Escrituras hoje. Amém.',
    theme: 'Sola Scriptura'
  },
  {
    id: 'uniao-1', day: 'União', title: 'Cristo Vive em Mim',
    reference: 'Gálatas 2:20', book: 'galatas', chapter: 2, verse: 20,
    verseText: 'Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim.',
    reflection: 'A vida cristã não é imitar Cristo de fora — é Cristo vivendo de dentro. A união com Cristo é o fundamento de toda experiência cristã. Morreu o velho eu; o novo vive pela fé no Filho de Deus que me amou e se entregou por mim.',
    prayer: 'Senhor Jesus, que eu diminua para que tu crescas em mim. Que minha vida reflita a tua, não pela força de vontade, mas pela tua graça transformadora. Amém.',
    theme: 'União com Cristo'
  },
  {
    id: 'esp-1', day: 'Espírito', title: 'Guiados pelo Espírito',
    reference: 'Romanos 8:14', book: 'romanos', chapter: 8, verse: 14,
    verseText: 'Porque todos os que são guiados pelo Espírito de Deus, esses são filhos de Deus.',
    reflection: 'O Espírito Santo não é força impessoal — é a terceira pessoa da Trindade habitando em você. Ser guiado pelo Espírito é a marca dos filhos de Deus. Não pela lei, não pelo esforço próprio, mas pela obra interna do Espírito.',
    prayer: 'Espírito Santo, guia meus passos hoje. Que eu seja sensível à tua voz e obediente à tua direção. Que o teu fruto apareça em minha vida. Amém.',
    theme: 'Espírito Santo'
  },
  {
    id: 'res-1', day: 'Ressurreição', title: 'Eu Sou a Ressurreição',
    reference: 'João 11:25', book: 'joao', chapter: 11, verse: 25,
    verseText: 'Disse-lhe Jesus: Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá.',
    reflection: 'Jesus não disse "eu ensino sobre a ressurreição" — ele disse "eu sou a ressurreição". A vida eterna não começa após a morte; começa na fé em Cristo agora. A ressurreição de Jesus é a garantia da nossa.',
    prayer: 'Senhor da vida, que a realidade da tua ressurreição transforme como eu encaro a morte, o sofrimento e o futuro. Tu és vitorioso. Amém.',
    theme: 'Ressurreição'
  },
  {
    id: 'exalt-1', day: 'Exaltação', title: 'Nome Acima de Todo Nome',
    reference: 'Filipenses 2:9-10', book: 'filipenses', chapter: 2, verse: 9,
    verseText: 'Por isso Deus o exaltou soberanamente e lhe deu o nome que é sobre todo o nome.',
    reflection: 'A humilhação de Cristo na encarnação e na cruz foi seguida da mais gloriosa exaltação. Toda autoridade no céu e na terra pertence a Jesus. Diante deste nome se dobrará todo joelho — uma hora por adoração, outra por julgamento.',
    prayer: 'Senhor Jesus, que eu me curve diante do teu nome agora, em adoração livre. Que toda minha vida declare que és Senhor. Amém.',
    theme: 'Senhorio de Cristo'
  },
  {
    id: 'fe-1', day: 'Fé', title: 'Certeza das Coisas Esperadas',
    reference: 'Hebreus 11:1', book: 'hebreus', chapter: 11, verse: 1,
    verseText: 'Ora, a fé é a certeza de coisas que se esperam e a convicção de coisas que não se veem.',
    reflection: 'A fé bíblica não é otimismo nem salto no escuro — é certeza ancorada no caráter de Deus. Os heróis de Hebreus 11 não viram o cumprimento das promessas, mas viveram como se o vissem. Isso é fé: ver o invisível com clareza.',
    prayer: 'Senhor, aumenta a minha fé. Que eu confie no teu caráter quando não consigo ver tua mão. A fé vem pelo ouvir; que eu ouça tua Palavra. Amém.',
    theme: 'Fé'
  },
  {
    id: 'esp-2', day: 'Esperança', title: 'Âncora da Alma',
    reference: 'Hebreus 6:19', book: 'hebreus', chapter: 6, verse: 19,
    verseText: 'A qual temos como âncora da alma, segura e firme, e que penetra além do véu.',
    reflection: 'A esperança cristã não é desejo incerto — é âncora. Ela penetra além do véu, além do visível, e se fixa no próprio Deus. Num mundo instável, o crente tem um ponto fixo: as promessas imutáveis do Deus que não pode mentir.',
    prayer: 'Pai, quando as circunstâncias abalarem minha confiança, lembra-me que minha âncora está firme em ti. Que eu viva pela esperança, não pelo medo. Amém.',
    theme: 'Esperança'
  },
  {
    id: 'exp-1', day: 'Expiação', title: 'Ferido Pelas Nossas Transgressões',
    reference: 'Isaías 53:5', book: 'isaias', chapter: 53, verse: 5,
    verseText: 'Mas ele foi ferido por causa das nossas transgressões e moído por causa das nossas iniquidades; o castigo que nos traz a paz estava sobre ele.',
    reflection: 'Isaías 53 descreve a cruz com 700 anos de antecedência. O sofrimento de Cristo não foi acidente — foi substituição. Ele levou o que era nosso para nos dar o que era dele. A expiação é a troca mais assimétrica da história.',
    prayer: 'Senhor Jesus, que a cruz nunca se torne familiar demais para mim. Que eu me assombre diante do teu amor substituto. Obrigado por ter carregado o que era meu. Amém.',
    theme: 'Expiação Substitutiva'
  },
  {
    id: 'sant-1', day: 'Santificação', title: 'Transformados pela Renovação',
    reference: 'Romanos 12:2', book: 'romanos', chapter: 12, verse: 2,
    verseText: 'E não sede conformados com este século, mas sede transformados pela renovação do vosso entendimento.',
    reflection: 'A santificação começa na mente. Não é conformidade externa — é transformação interna. A renovação do entendimento pela Palavra muda como vemos a realidade, o que desejamos e como escolhemos. É obra do Espírito, não da força de vontade.',
    prayer: 'Senhor, renova minha mente com a tua Palavra. Que meu pensamento seja moldado por ti, não pela cultura. Transforma-me à imagem de Cristo. Amém.',
    theme: 'Santificação'
  },
  {
    id: 'elei-1', day: 'Eleição', title: 'Escolhidos Antes da Fundação',
    reference: 'Efésios 1:4-5', book: 'efesios', chapter: 1, verse: 4,
    verseText: 'Como também nos elegeu nele antes da fundação do mundo, para sermos santos e irrepreensíveis diante dele em amor.',
    reflection: 'A eleição não é injusta — é graciosa. Deus não te escolheu porque previu tua fé; ele te concedeu a fé porque te escolheu. Sua salvação tem fundamento eterno, anterior à criação. Isso gera humildade e segurança ao mesmo tempo.',
    prayer: 'Pai soberano, que a certeza da minha eleição me encha de gratidão e não de arrogância. Tu me amaste antes de eu existir. Que eu viva para tua glória. Amém.',
    theme: 'Eleição'
  },
  {
    id: 'desc-1', day: 'Descanso', title: 'Vinde a Mim',
    reference: 'Mateus 11:28', book: 'mateus', chapter: 11, verse: 28,
    verseText: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
    reflection: 'Jesus não convida os fortes — convida os cansados. O descanso que ele oferece não é ausência de trabalho, mas alívio do peso do pecado, da culpa e da performance religiosa. Seu jugo é suave porque ele já carregou o peso.',
    prayer: 'Senhor Jesus, venho a ti com meu cansaço. Não tenho mais força para performar. Recebo o descanso que só tu podes dar. Amém.',
    theme: 'Graça'
  },
  {
    id: 'regen-1', day: 'Regeneração', title: 'Nova Criatura',
    reference: '2 Coríntios 5:17', book: '2corintios', chapter: 5, verse: 17,
    verseText: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.',
    reflection: 'A conversão não é reforma — é nova criação. O mesmo poder que falou "haja luz" agiu em você quando creu. O velho passou; não passou temporariamente — passou definitivamente. Em Cristo, você tem nova identidade, nova origem, novo destino.',
    prayer: 'Pai criador, que eu viva segundo minha nova identidade em Cristo. Que eu não volte a me definir pelo que era, mas pelo que sou em ti. Amém.',
    theme: 'Regeneração'
  },
  {
    id: 'ora-1', day: 'Oração', title: 'Não Estejais Inquietos',
    reference: 'Filipenses 4:6-7', book: 'filipenses', chapter: 4, verse: 6,
    verseText: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.',
    reflection: 'Paulo não diz "não se preocupe" sem dar alternativa. A resposta à ansiedade é a oração — específica, persistente, com ação de graças. A paz que guarda o coração não vem do desaparecimento dos problemas, mas da presença de Deus neles.',
    prayer: 'Pai, trago minhas ansiedades a ti agora. Não as resolvo, mas as deposito em tuas mãos. Que tua paz, que excede meu entendimento, guarde meu coração. Amém.',
    theme: 'Oração'
  },
  {
    id: 'glor-1', day: 'Glória', title: 'Soli Deo Gloria',
    reference: '1 Coríntios 10:31', book: '1corintios', chapter: 10, verse: 31,
    verseText: 'Portanto, quer comais quer bebais, ou façais outra qualquer coisa, fazei tudo para a glória de Deus.',
    reflection: 'Soli Deo Gloria não é apenas slogan da Reforma — é vocação de toda criatura racional. Até os atos mais mundanos — comer, beber, trabalhar — podem ser atos de adoração quando feitos para a glória de Deus. Toda a vida é sagrada quando vivida nessa perspectiva.',
    prayer: 'Senhor, que cada ato ordinário desta semana seja oferenda a ti. Que eu viva para a tua glória, não para a minha. A ti seja toda honra, poder e glória. Amém.',
    theme: 'Glória de Deus'
  },
]
