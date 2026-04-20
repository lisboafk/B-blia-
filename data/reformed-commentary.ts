export interface Commentary {
  book: string
  chapter: number
  verse: number
  text: string
  reformedNote: string
  crossRefs: string[]
  theme: string
  historicalContext?: string
  application: string
}

export const REFORMED_COMMENTARY: Record<string, Commentary> = {
  'genesis-1-1': {
    book: 'genesis', chapter: 1, verse: 1,
    text: 'No princípio, criou Deus os céus e a terra.',
    reformedNote: 'A criação ex nihilo demonstra a soberania absoluta de Deus. Ele não criou por necessidade, mas por sua vontade soberana e para a sua própria glória (Rm 11:36). Calvino ressalta que o mundo é o "teatro da glória de Deus".',
    crossRefs: ['João 1:1-3', 'Colossenses 1:16', 'Hebreus 11:3', 'Romanos 11:36'],
    theme: 'Soberania de Deus',
    historicalContext: 'Escrito em contraste com os mitos de criação pagãos do Oriente Próximo, afirmando que existe um único Deus criador, pessoal e onipotente.',
    application: 'Reconheça que você e tudo ao redor pertence a Deus. Nossa vida tem propósito porque foi criada intencionalmente pelo Criador soberano.'
  },
  'genesis-3-15': {
    book: 'genesis', chapter: 3, verse: 15,
    text: 'E porei inimizade entre ti e a mulher, entre a tua descendência e o seu descendente; este te ferirá a cabeça, e tu lhe ferirás o calcanhar.',
    reformedNote: 'O Protevangelium — a primeira promessa do Evangelho. A semente da mulher é Cristo (Gl 4:4), que esmagou definitivamente a cabeça de Satanás na cruz. A redenção não foi um plano B, mas o eterno decreto de Deus.',
    crossRefs: ['Gálatas 4:4', 'Romanos 16:20', 'Apocalipse 12:9', 'Hebreus 2:14'],
    theme: 'Redenção | Messias',
    historicalContext: 'Pronunciado após a Queda, estabelece o arco narrativo de toda a Bíblia: conflito entre o bem e o mal, resolvido na pessoa de Cristo.',
    application: 'O evangelho não é novidade — é o plano eterno de Deus. Confie que quem prometeu é fiel para cumprir em Cristo.'
  },
  'salmos-23-1': {
    book: 'salmos', chapter: 23, verse: 1,
    text: 'O Senhor é o meu pastor; nada me faltará.',
    reformedNote: 'Davi usa a metáfora do pastor para descrever a providência divina. Na teologia reformada, a providência é o governo contínuo de Deus sobre toda a criação — nada acontece fora do seu decreto soberano. "Nada me faltará" não é promessa de prosperidade material, mas de suficiência total em Deus.',
    crossRefs: ['João 10:11', 'Ezequiel 34:11-16', 'Filipenses 4:19', 'Salmos 100:3'],
    theme: 'Providência | Confiança',
    application: 'Entregue suas necessidades ao Pastor soberano. A confiança não nasce das circunstâncias, mas do caráter imutável do Senhor.'
  },
  'salmos-91-1': {
    book: 'salmos', chapter: 91, verse: 1,
    text: 'Aquele que habita no esconderijo do Altíssimo e descansa à sombra do Onipotente.',
    reformedNote: 'A segurança do crente está em habitar na presença de Deus. A teologia reformada afirma a perseverança dos santos: aqueles que são de Deus jamais serão separados dele (João 10:28-29). Habitar é postura contínua, não ocasional.',
    crossRefs: ['João 10:28-29', 'Romanos 8:38-39', 'Deuteronômio 33:27', 'Salmos 46:1'],
    theme: 'Proteção | Perseverança',
    application: 'A segurança espiritual não depende de suas forças, mas de quem é o seu Deus. Descanse nele.'
  },
  'joao-1-1': {
    book: 'joao', chapter: 1, verse: 1,
    text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
    reformedNote: 'João parallela com Gênesis 1:1, afirmando a eternidade e divindade plena do Logos. A preexistência de Cristo é fundamental na cristologia reformada. "Era" (ên) indica existência contínua, não início — Cristo não foi criado, mas é eterno como o Pai.',
    crossRefs: ['Gênesis 1:1', 'Colossenses 1:15-17', 'Hebreus 1:1-3', 'Filipenses 2:6'],
    theme: 'Divindade de Cristo | Encarnação',
    historicalContext: 'Escrito contra o proto-gnosticismo que negava a plena divindade e humanidade de Cristo.',
    application: 'Jesus não é apenas um bom mestre — é Deus encarnado. Toda a sua confiança pode repousar nele completamente.'
  },
  'joao-3-16': {
    book: 'joao', chapter: 3, verse: 16,
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
    reformedNote: 'Na soteriologia reformada, "todo o que crê" não é condição que o homem cumpre por vontade própria, mas fruto da graça irresistível. O amor de Deus é particular e eficaz: ele deu seu Filho para salvar aqueles que ele chamou. A fé é dom de Deus (Ef 2:8-9), não mérito humano.',
    crossRefs: ['Efésios 2:8-9', 'João 6:37-40', 'Romanos 5:8', '1 João 4:9-10'],
    theme: 'Graça | Salvação | Amor de Deus',
    application: 'O evangelho é a maior notícia já proclamada. Se você crê, é porque Deus operou em você — responda com gratidão e adoração.'
  },
  'romanos-3-23': {
    book: 'romanos', chapter: 3, verse: 23,
    text: 'Porque todos pecaram e destituídos estão da glória de Deus.',
    reformedNote: 'A depravação total não significa que os homens são tão maus quanto poderiam ser, mas que todo aspecto humano foi corrompido pela queda. Ninguém busca a Deus por iniciativa própria (v. 11). Essa é a base da necessidade da graça soberana de Deus.',
    crossRefs: ['Romanos 3:10-12', 'Gênesis 6:5', 'Jeremias 17:9', 'Efésios 2:1-3'],
    theme: 'Depravação | Necessidade da Graça',
    application: 'Reconhecer o pecado não é pessimismo — é a porta de entrada para receber a graça de Deus.'
  },
  'romanos-5-1': {
    book: 'romanos', chapter: 5, verse: 1,
    text: 'Tendo, pois, sido justificados pela fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo.',
    reformedNote: 'A justificação pela fé (Sola Fide) é o artigo pelo qual a Igreja fica de pé ou cai (Lutero). É um decreto judicial de Deus: o pecador é declarado justo não pelas obras, mas pela imputação da justiça de Cristo. A paz com Deus é objetiva, não sentimento — é status permanente do justificado.',
    crossRefs: ['Romanos 4:25', 'Gálatas 2:16', 'Filipenses 3:9', '2 Coríntios 5:21'],
    theme: 'Justificação | Sola Fide | Paz com Deus',
    historicalContext: 'Contexto da Reforma Protestante: a justificação pela fé, e não pelas obras ou indulgências, é o coração do Evangelho redescoberto.',
    application: 'Você tem paz com Deus não porque se sente em paz, mas porque Cristo cumpriu tudo. Descanse nessa realidade objetiva.'
  },
  'romanos-8-1': {
    book: 'romanos', chapter: 8, verse: 1,
    text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.',
    reformedNote: 'O capítulo mais glorioso da Bíblia começa com a mais preciosa verdade: nenhuma condenação. O "portanto" une com a justificação de Rm 5-7. "Em Cristo" é a chave — nossa aceitação é tão certa quanto Cristo é aceito pelo Pai. O Espírito Santo é a garantia e o agente de nossa santificação.',
    crossRefs: ['Romanos 8:38-39', 'João 5:24', 'Efésios 1:13-14', 'Romanos 5:1'],
    theme: 'Nenhuma Condenação | União com Cristo | Segurança Eterna',
    application: 'Quando a acusação vier — do diabo, do mundo, ou de você mesmo — responda com Romanos 8:1. Em Cristo, você é livre.'
  },
  'romanos-8-28': {
    book: 'romanos', chapter: 8, verse: 28,
    text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    reformedNote: 'A providência soberana de Deus age através de todas as circunstâncias — inclusive o sofrimento — para o bem definitivo dos eleitos. "Todas as coisas" inclui aflições, perdas e adversidades. "Chamados segundo o seu propósito" âncora a promessa na eleição eterna, não nas circunstâncias presentes.',
    crossRefs: ['Romanos 8:29-30', 'Gênesis 50:20', 'Filipenses 1:6', 'Jeremias 29:11'],
    theme: 'Providência Soberana | Eleição | Esperança',
    application: 'Nos dias mais escuros, confie que Deus está trabalhando. A promessa não é que tudo será fácil, mas que tudo servirá ao seu bem eterno.'
  },
  'efesios-2-8': {
    book: 'efesios', chapter: 2, verse: 8,
    text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.',
    reformedNote: 'O texto mais claro da Sola Gratia. A salvação tem três elementos: (1) graça — a fonte é Deus; (2) fé — o instrumento; (3) dom de Deus — inclui tanto a graça quanto a fé. A fé não é contribuição humana, mas obra do Espírito Santo. Isso exclui toda a glorificação humana (v.9).',
    crossRefs: ['Filipenses 1:29', 'João 6:44', 'Atos 13:48', 'Romanos 9:16'],
    theme: 'Sola Gratia | Eleição | Fé como Dom',
    historicalContext: 'Paulo escreve a uma igreja gentílica, mostrando que judeus e gentios são salvos pelo mesmo meio: a graça soberana de Deus em Cristo.',
    application: 'Você não pode se gloriar da sua salvação. Isso liberta do orgulho espiritual e enche o coração de gratidão eterna.'
  },
  'hebreus-11-1': {
    book: 'hebreus', chapter: 11, verse: 1,
    text: 'Ora, a fé é a certeza de coisas que se esperam e a convicção de coisas que não se veem.',
    reformedNote: 'A fé bíblica não é crença cega — é certeza e convicção baseadas na Palavra de Deus. Na epistemologia reformada, a fé é conhecimento (notitia), assentimento (assensus) e confiança (fiducia). O Espírito Santo ilumina a mente e move a vontade para confiar nas promessas divinas.',
    crossRefs: ['Romanos 10:17', 'João 20:29', '2 Coríntios 5:7', 'Hebreus 12:1-2'],
    theme: 'Fé | Esperança | Vida Cristã',
    application: 'Cultive sua fé pela Palavra. A fé não cresce por intensidade emocional, mas pelo conhecimento de Deus através das Escrituras.'
  },
  'apocalipse-1-8': {
    book: 'apocalipse', chapter: 1, verse: 8,
    text: 'Eu sou o Alfa e o Ômega, diz o Senhor Deus, aquele que é, que era e que há de vir, o Todo-Poderoso.',
    reformedNote: 'Cristo se revela como o Pantokrator — o Soberano sobre toda a história. A escatologia reformada é otimista não pela força humana, mas pela certeza da soberania de Cristo. Ele é o Senhor da história, e sua vitória é certa. A Igreja milita sob um rei que já venceu.',
    crossRefs: ['Apocalipse 22:13', 'Isaías 44:6', 'João 8:58', 'Filipenses 2:9-11'],
    theme: 'Soberania de Cristo | Escatologia | Esperança Final',
    application: 'Viva sub specie aeternitatis — sob a perspectiva da eternidade. Cristo reina agora e reinará para sempre. Isso muda tudo.'
  },
}

export function getCommentary(book: string, chapter: number, verse: number): Commentary | undefined {
  return REFORMED_COMMENTARY[`${book}-${chapter}-${verse}`]
}

export const THEOLOGICAL_THEMES = [
  'Soberania de Deus', 'Graça', 'Justificação', 'Sola Fide', 'Sola Gratia',
  'Eleição', 'Providência', 'Redenção', 'Messias', 'Encarnação',
  'Divindade de Cristo', 'Depravação', 'Perseverança', 'Esperança', 'Fé'
]
