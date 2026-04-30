export interface DailyPrayer {
  id: string
  period: 'manha' | 'noite'
  title: string
  reference: string
  book: string
  chapter: number
  prayer: string
}

import generatedRaw from './generated.json'

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _gen = generatedRaw as any
const GENERATED_MORNING: DailyPrayer[] = (_gen.morningPrayers || []).map((p: any) => ({
  id: p.id, period: 'manha' as const,
  title: p.title || 'Oração da Manhã',
  reference: p.reference || '',
  book: p.book || 'salmos',
  chapter: p.chapter || 1,
  prayer: p.prayer || '',
}))
const GENERATED_EVENING: DailyPrayer[] = (_gen.eveningPrayers || []).map((p: any) => ({
  id: p.id, period: 'noite' as const,
  title: p.title || 'Oração da Noite',
  reference: p.reference || '',
  book: p.book || 'salmos',
  chapter: p.chapter || 1,
  prayer: p.prayer || '',
}))

export function getMorningPrayer(): DailyPrayer {
  const all = [...MORNING_PRAYERS, ...GENERATED_MORNING]
  return all[getDayOfYear() % all.length]
}

export function getEveningPrayer(): DailyPrayer {
  const all = [...EVENING_PRAYERS, ...GENERATED_EVENING]
  return all[getDayOfYear() % all.length]
}

export const MORNING_PRAYERS: DailyPrayer[] = [
  { id: 'm1', period: 'manha', title: 'Oração da Manhã', reference: 'Salmos 143:8', book: 'salmos', chapter: 143,
    prayer: 'Senhor, faz-me ouvir de manhã a tua misericórdia, porque em ti confio. Ensina-me o caminho em que devo andar, porque a ti elevo a minha alma. Que hoje eu seja instrumento da tua graça. Amém.' },
  { id: 'm2', period: 'manha', title: 'Oração da Manhã', reference: 'Salmos 5:3', book: 'salmos', chapter: 5,
    prayer: 'Senhor, de manhã ouves a minha voz; de manhã me apresento diante de ti e fico esperando. Dirige meus passos hoje segundo a tua vontade. Que cada momento desta manhã seja vivido para tua glória. Amém.' },
  { id: 'm3', period: 'manha', title: 'Oração da Manhã', reference: 'Lamentações 3:22-23', book: 'lamentacoes', chapter: 3,
    prayer: 'Pai, obrigado pelas misericórdias renovadas esta manhã. Tua fidelidade é grande. Recebo este dia como dom teu — que nele eu te honre em pensamento, palavra e ação. Amém.' },
  { id: 'm4', period: 'manha', title: 'Oração da Manhã', reference: 'Filipenses 4:13', book: 'filipenses', chapter: 4,
    prayer: 'Senhor, neste novo dia reconheço minha fraqueza e tua força. Posso tudo naquele que me fortalece. Onde eu for insuficiente, sê tu suficiente. Usa-me apesar de mim. Amém.' },
  { id: 'm5', period: 'manha', title: 'Oração da Manhã', reference: 'Josué 1:9', book: 'josue', chapter: 1,
    prayer: 'Deus forte, afasto o temor nesta manhã pela promessa da tua presença. Tu és comigo por onde quer que eu andar. Que eu viva hoje com coragem, sabendo que não estou sozinho. Amém.' },
  { id: 'm6', period: 'manha', title: 'Oração da Manhã', reference: 'Romanos 12:2', book: 'romanos', chapter: 12,
    prayer: 'Senhor, transforma minha mente hoje pela tua Palavra. Não me deixa conformar ao espírito do mundo. Que meu pensamento seja moldado por ti para que eu discerna a tua boa e perfeita vontade. Amém.' },
  { id: 'm7', period: 'manha', title: 'Oração da Manhã', reference: 'Provérbios 3:5-6', book: 'proverbios', chapter: 3,
    prayer: 'Pai, confio em ti de todo o coração nesta manhã. Não vou me apoiar no meu próprio entendimento. Reconheço-te em todos os meus caminhos. Endireita as minhas veredas e guia cada decisão. Amém.' },
  { id: 'm8', period: 'manha', title: 'Oração da Manhã', reference: 'Mateus 6:33', book: 'mateus', chapter: 6,
    prayer: 'Senhor Jesus, que eu busque primeiro o teu reino e a tua justiça neste dia. Não a aprovação humana, não o conforto, não o sucesso — mas a ti. Que tudo mais venha por acréscimo. Amém.' },
  { id: 'm9', period: 'manha', title: 'Oração da Manhã', reference: 'Salmos 51:10', book: 'salmos', chapter: 51,
    prayer: 'Cria em mim, ó Deus, um coração puro nesta manhã. Renova em mim um espírito reto. Que eu me aproxime das pessoas com amor genuíno, não com interesse. Purifica meus motivos. Amém.' },
  { id: 'm10', period: 'manha', title: 'Oração da Manhã', reference: 'Efésios 6:10', book: 'efesios', chapter: 6,
    prayer: 'Deus, revisto-me hoje com toda a tua armadura. Que eu me firme contra as ciladas do diabo. Protege minha mente, minha fé e minha boca. Que este dia seja uma vitória pela tua graça. Amém.' },
  { id: 'm11', period: 'manha', title: 'Oração da Manhã', reference: 'Colossenses 3:17', book: 'colossenses', chapter: 3,
    prayer: 'Senhor Jesus, que tudo o que eu fizer hoje — em palavra ou obra — seja feito em teu nome, dando graças a Deus Pai por meio de ti. Santifica o ordinário desta manhã. Amém.' },
  { id: 'm12', period: 'manha', title: 'Oração da Manhã', reference: 'Isaías 40:31', book: 'isaias', chapter: 40,
    prayer: 'Pai, espero em ti nesta manhã. Renova minhas forças. Que eu suba com asas como águia, corra sem me cansar, ande sem me fatigar. Deposito meu esgotamento em tuas mãos. Amém.' },
  { id: 'm13', period: 'manha', title: 'Oração da Manhã', reference: 'João 15:5', book: 'joao', chapter: 15,
    prayer: 'Senhor, quero permanecer em ti hoje. Sem ti, nada posso fazer. Que cada conversa, cada tarefa, cada pensamento nasça dessa conexão com a videira. Produz em mim fruto que permaneça. Amém.' },
  { id: 'm14', period: 'manha', title: 'Oração da Manhã', reference: '2 Coríntios 12:9', book: '2corintios', chapter: 12,
    prayer: 'Senhor, onde hoje me sentir fraco, que eu confie que o teu poder se aperfeiçoa na fraqueza. Tua graça me basta. Glorio-me nas fraquezas para que o poder de Cristo repouse sobre mim. Amém.' },
]

export const EVENING_PRAYERS: DailyPrayer[] = [
  { id: 'n1', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 4:8', book: 'salmos', chapter: 4,
    prayer: 'Senhor, deito-me e durmo em paz, porque só tu, Senhor, me fazes habitar em segurança. Guarda meu sono. Que minha mente descanse nas tuas promessas enquanto o corpo repousa. Amém.' },
  { id: 'n2', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 121:3-4', book: 'salmos', chapter: 121,
    prayer: 'Pai, tu que não dormes nem te adormecias, guarda-me esta noite. Não deixes que meu pé vacile. Enquanto eu descanso, tu velas. Que amanhã eu me levante renovado pela tua graça. Amém.' },
  { id: 'n3', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 32:5', book: 'salmos', chapter: 32,
    prayer: 'Senhor, antes de dormir confesso os pecados deste dia — em pensamento, palavra e omissão. Tua fidelidade perdoa. Limpa minha consciência para que eu descanse sem peso. Amém.' },
  { id: 'n4', period: 'noite', title: 'Oração da Noite', reference: '1 Pedro 5:7', book: '1pedro', chapter: 5,
    prayer: 'Pai, lanço sobre ti toda a ansiedade deste dia que termina. Deixo contigo as preocupações de amanhã. Tu tens cuidado de mim. Descansarei no teu amor enquanto durmo. Amém.' },
  { id: 'n5', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 139:23-24', book: 'salmos', chapter: 139,
    prayer: 'Senhor, sonda-me e conhece o meu coração nesta noite. Vê se há em mim algum caminho mau. Guia-me no caminho eterno. Que o exame deste dia me aproxime de ti. Amém.' },
  { id: 'n6', period: 'noite', title: 'Oração da Noite', reference: 'Filipenses 4:7', book: 'filipenses', chapter: 4,
    prayer: 'Pai, que a tua paz que excede todo entendimento guarde meu coração e minha mente em Cristo Jesus nesta noite. Silencia o barulho da ansiedade. Que eu durma como aquele que confia. Amém.' },
  { id: 'n7', period: 'noite', title: 'Oração da Noite', reference: 'Efésios 4:26', book: 'efesios', chapter: 4,
    prayer: 'Senhor, que o sol não se ponha sobre minha ira esta noite. Se guardei mágoa de alguém hoje, liberto agora. Perdoa-me como eu perdoo. Que eu durma sem amargura no coração. Amém.' },
  { id: 'n8', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 34:18', book: 'salmos', chapter: 34,
    prayer: 'Pai, o Senhor está perto dos que têm o coração quebrantado. Se hoje meu coração foi ferido, cura-o enquanto durmo. Tua presença é medicina. Acordo amanhã inteiro em ti. Amém.' },
  { id: 'n9', period: 'noite', title: 'Oração da Noite', reference: 'Romanos 8:28', book: 'romanos', chapter: 8,
    prayer: 'Deus soberano, agradeço por tudo o que cooperou para o bem hoje — as alegrias e as dificuldades. Nada escapou da tua mão. Repouso sabendo que estás no controle do amanhã. Amém.' },
  { id: 'n10', period: 'noite', title: 'Oração da Noite', reference: 'Hebreus 4:16', book: 'hebreus', chapter: 4,
    prayer: 'Senhor, chego ao trono da graça com confiança nesta noite. Recebo misericórdia para os erros de hoje e graça para o socorro de amanhã. Obrigado pela porta sempre aberta. Amém.' },
  { id: 'n11', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 16:11', book: 'salmos', chapter: 16,
    prayer: 'Pai, fartura de alegrias está diante do teu rosto e delícias estão na tua destra para sempre. Que eu adormeça meditando nas tuas alegrias eternas, não nas tristezas temporais. Amém.' },
  { id: 'n12', period: 'noite', title: 'Oração da Noite', reference: 'João 14:27', book: 'joao', chapter: 14,
    prayer: 'Senhor Jesus, deixas-me a tua paz — não como o mundo dá. Que meu coração não se perturbe nem se intimide nesta noite. Recebo a paz que prometeste a quem permanece em ti. Amém.' },
  { id: 'n13', period: 'noite', title: 'Oração da Noite', reference: 'Salmos 63:6-7', book: 'salmos', chapter: 63,
    prayer: 'Senhor, quando me lembro de ti sobre o meu leito, meditarei em ti nas vigílias da noite. Tu és o meu auxílio. Na sombra das tuas asas me rejubilo. Guarda meu sono. Amém.' },
  { id: 'n14', period: 'noite', title: 'Oração da Noite', reference: 'Apocalipse 21:4', book: 'apocalipse', chapter: 21,
    prayer: 'Pai, que esta noite eu adormeça com a esperança da manhã eterna que não terá noite. Não haverá mais morte, nem pranto, nem dor. Que essa esperança viva seja meu travesseiro. Amém.' },
]
