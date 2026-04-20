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

export const DEVOTIONALS: Devotional[] = [
  {
    id: 'dom', day: 'Domingo', title: 'O Criador Soberano',
    reference: 'Gênesis 1:1', book: 'genesis', chapter: 1, verse: 1,
    verseText: 'No princípio, criou Deus os céus e a terra.',
    reflection: 'Antes de tudo existir, Deus estava. Sua soberania não começa com a criação — ela a antecede eternamente. Você vive num universo que pertence ao Criador. Cada manhã é prova de que ele sustenta o que criou. Hoje, reconheça que você não é acidente — é criatura amada pelo Soberano.',
    prayer: 'Senhor, que eu viva hoje consciente de que sou sua criatura. Que sua soberania traga descanso ao meu coração inquieto. A ti seja a glória. Amém.',
    theme: 'Soberania de Deus'
  },
  {
    id: 'seg', day: 'Segunda', title: 'Justificados Pela Fé',
    reference: 'Romanos 5:1', book: 'romanos', chapter: 5, verse: 1,
    verseText: 'Tendo, pois, sido justificados pela fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo.',
    reflection: 'Segunda-feira carrega o peso dos deveres. Mas o cristão começa a semana justificado — declarado justo por Deus. Essa paz não depende do seu desempenho desta semana, mas da obra perfeita de Cristo na cruz. Você está em paz com Deus agora, permanentemente.',
    prayer: 'Pai, obrigado pela paz que excede meu entendimento. Que eu não busque minha aceitação nas obras, mas descanse na justiça de Cristo imputada a mim. Amém.',
    theme: 'Justificação'
  },
  {
    id: 'ter', day: 'Terça', title: 'O Bom Pastor',
    reference: 'Salmos 23:1', book: 'salmos', chapter: 23, verse: 1,
    verseText: 'O Senhor é o meu pastor; nada me faltará.',
    reflection: 'A vida é cheia de necessidades, medos e incertezas. Mas Davi aprendeu que o Senhor pastoreia. Ele guia, restaura, protege e supre — não apenas às vezes, mas continuamente. "Nada me faltará" é confiança radical no caráter do Pastor soberano.',
    prayer: 'Senhor, reconheço que sou ovelha — dependente, fraca e propensa a me perder. Guia-me hoje pelos teus caminhos. Confio na tua provisão. Amém.',
    theme: 'Providência'
  },
  {
    id: 'qua', day: 'Quarta', title: 'Graça que Salva',
    reference: 'Efésios 2:8-9', book: 'efesios', chapter: 2, verse: 8,
    verseText: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus. Não por obras, para que ninguém se glorie.',
    reflection: 'No meio da semana, é tentador medir sua espiritualidade pelo que você fez. Mas a salvação não é salário — é dom. Paulo destrói qualquer base de auto-glória. Você foi salvo porque Deus quis, não porque você mereceu. Isso humilha e liberta ao mesmo tempo.',
    prayer: 'Deus da graça, perdoa-me por tentar ganhar o que só pode ser recebido. Que eu viva hoje em gratidão, não em medo. Tua graça é suficiente. Amém.',
    theme: 'Sola Gratia'
  },
  {
    id: 'qui', day: 'Quinta', title: 'Nenhuma Condenação',
    reference: 'Romanos 8:1', book: 'romanos', chapter: 8, verse: 1,
    verseText: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.',
    reflection: 'A acusação é uma das armas favoritas do inimigo. Mas Romanos 8:1 fecha a porta: nenhuma condenação. Não alguma — nenhuma. A sentença foi executada em Cristo, não em você. Quando o peso da culpa vier, responda com a Palavra: em Cristo, sou livre.',
    prayer: 'Senhor Jesus, obrigado por carregar minha condenação. Que eu não viva como condenado quando tu me libertaste. Que a tua verdade vença minha acusação. Amém.',
    theme: 'Segurança em Cristo'
  },
  {
    id: 'sex', day: 'Sexta', title: 'Amor Que Não Falha',
    reference: 'Romanos 8:38-39', book: 'romanos', chapter: 8, verse: 38,
    verseText: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as coisas presentes, nem as por vir, nem os poderes, nem a altura, nem a profundeza, nem qualquer outra criatura nos poderá separar do amor de Deus que está em Cristo Jesus nosso Senhor.',
    reflection: 'Paulo lista toda ameaça possível e declara: nenhuma pode separar o crente do amor de Deus. Esse amor não é flutuante — é eterno, inabalável e garantido pela eleição e pela intercessão de Cristo. Você termina a semana amado, completamente.',
    prayer: 'Pai, que este amor imenso que não posso perder encha meu coração de adoração. Que eu ame o próximo como fui amado. A ti toda a glória. Amém.',
    theme: 'Amor de Deus'
  },
  {
    id: 'sab', day: 'Sábado', title: 'Todas as Coisas Cooperam',
    reference: 'Romanos 8:28', book: 'romanos', chapter: 8, verse: 28,
    verseText: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    reflection: 'Ao olhar para a semana que passou — com suas alegrias e dificuldades — creia: Deus estava em todas elas. A providência soberana não significa que tudo é fácil, mas que tudo é governado. Descanse no Sábado com a certeza de que o Senhor da história é o Senhor da sua história.',
    prayer: 'Senhor soberano, que eu descanse sabendo que tudo está em tuas mãos. Obrigado pelas tuas misericórdias renovadas esta semana. Tua fidelidade é grande. Amém.',
    theme: 'Providência Soberana'
  },
]

export function getTodayDevotional(): Devotional {
  const day = new Date().getDay()
  return DEVOTIONALS[day]
}
