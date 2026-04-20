export interface BibleBook {
  id: string
  name: string
  abbr: string
  testament: 'AT' | 'NT'
  chapters: number
  category: string
  description: string
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento - Pentateuco
  { id: 'genesis', name: 'Gênesis', abbr: 'Gn', testament: 'AT', chapters: 50, category: 'Pentateuco', description: 'A origem do universo, da humanidade e do povo de Deus' },
  { id: 'exodo', name: 'Êxodo', abbr: 'Êx', testament: 'AT', chapters: 40, category: 'Pentateuco', description: 'A libertação do Egito e a lei de Deus' },
  { id: 'levitico', name: 'Levítico', abbr: 'Lv', testament: 'AT', chapters: 27, category: 'Pentateuco', description: 'As leis de santidade e adoração' },
  { id: 'numeros', name: 'Números', abbr: 'Nm', testament: 'AT', chapters: 36, category: 'Pentateuco', description: 'A jornada pelo deserto' },
  { id: 'deuteronomio', name: 'Deuteronômio', abbr: 'Dt', testament: 'AT', chapters: 34, category: 'Pentateuco', description: 'A renovação da aliança' },
  // Históricos
  { id: 'josue', name: 'Josué', abbr: 'Js', testament: 'AT', chapters: 24, category: 'Históricos', description: 'A conquista da terra prometida' },
  { id: 'juizes', name: 'Juízes', abbr: 'Jz', testament: 'AT', chapters: 21, category: 'Históricos', description: 'O ciclo de apostasia e redenção' },
  { id: 'rute', name: 'Rute', abbr: 'Rt', testament: 'AT', chapters: 4, category: 'Históricos', description: 'Lealdade, redenção e a graça de Deus' },
  { id: '1samuel', name: '1 Samuel', abbr: '1Sm', testament: 'AT', chapters: 31, category: 'Históricos', description: 'A instituição da monarquia em Israel' },
  { id: '2samuel', name: '2 Samuel', abbr: '2Sm', testament: 'AT', chapters: 24, category: 'Históricos', description: 'O reinado de Davi' },
  { id: '1reis', name: '1 Reis', abbr: '1Rs', testament: 'AT', chapters: 22, category: 'Históricos', description: 'Salomão e a divisão do reino' },
  { id: '2reis', name: '2 Reis', abbr: '2Rs', testament: 'AT', chapters: 25, category: 'Históricos', description: 'O declínio e o exílio' },
  { id: '1cronicas', name: '1 Crônicas', abbr: '1Cr', testament: 'AT', chapters: 29, category: 'Históricos', description: 'A genealogia e reinado de Davi' },
  { id: '2cronicas', name: '2 Crônicas', abbr: '2Cr', testament: 'AT', chapters: 36, category: 'Históricos', description: 'Salomão e os reis de Judá' },
  { id: 'esdras', name: 'Esdras', abbr: 'Ed', testament: 'AT', chapters: 10, category: 'Históricos', description: 'O retorno do exílio babilônico' },
  { id: 'neemias', name: 'Neemias', abbr: 'Ne', testament: 'AT', chapters: 13, category: 'Históricos', description: 'A reconstrução de Jerusalém' },
  { id: 'ester', name: 'Ester', abbr: 'Et', testament: 'AT', chapters: 10, category: 'Históricos', description: 'A providência divina na preservação de Israel' },
  // Poéticos
  { id: 'jo', name: 'Jó', abbr: 'Jó', testament: 'AT', chapters: 42, category: 'Poéticos', description: 'O sofrimento e a soberania de Deus' },
  { id: 'salmos', name: 'Salmos', abbr: 'Sl', testament: 'AT', chapters: 150, category: 'Poéticos', description: 'Hinos, lamentos e louvores ao Senhor' },
  { id: 'proverbios', name: 'Provérbios', abbr: 'Pv', testament: 'AT', chapters: 31, category: 'Poéticos', description: 'Sabedoria prática para a vida' },
  { id: 'eclesiastes', name: 'Eclesiastes', abbr: 'Ec', testament: 'AT', chapters: 12, category: 'Poéticos', description: 'Reflexões sobre o sentido da vida' },
  { id: 'cantares', name: 'Cântico dos Cânticos', abbr: 'Ct', testament: 'AT', chapters: 8, category: 'Poéticos', description: 'O amor e o relacionamento com Deus' },
  // Profetas Maiores
  { id: 'isaias', name: 'Isaías', abbr: 'Is', testament: 'AT', chapters: 66, category: 'Profetas Maiores', description: 'Profecia sobre o Servo sofredor e o novo éden' },
  { id: 'jeremias', name: 'Jeremias', abbr: 'Jr', testament: 'AT', chapters: 52, category: 'Profetas Maiores', description: 'A nova aliança e o julgamento de Judá' },
  { id: 'lamentacoes', name: 'Lamentações', abbr: 'Lm', testament: 'AT', chapters: 5, category: 'Profetas Maiores', description: 'Lamento pela destruição de Jerusalém' },
  { id: 'ezequiel', name: 'Ezequiel', abbr: 'Ez', testament: 'AT', chapters: 48, category: 'Profetas Maiores', description: 'Visões da glória de Deus e restauração' },
  { id: 'daniel', name: 'Daniel', abbr: 'Dn', testament: 'AT', chapters: 12, category: 'Profetas Maiores', description: 'Fidelidade no exílio e visões proféticas' },
  // Profetas Menores
  { id: 'oseias', name: 'Oseias', abbr: 'Os', testament: 'AT', chapters: 14, category: 'Profetas Menores', description: 'O amor fiel de Deus por Israel infiel' },
  { id: 'joel', name: 'Joel', abbr: 'Jl', testament: 'AT', chapters: 3, category: 'Profetas Menores', description: 'O Dia do Senhor e a efusão do Espírito' },
  { id: 'amos', name: 'Amós', abbr: 'Am', testament: 'AT', chapters: 9, category: 'Profetas Menores', description: 'Justiça social e o julgamento de Israel' },
  { id: 'abdias', name: 'Abdias', abbr: 'Ab', testament: 'AT', chapters: 1, category: 'Profetas Menores', description: 'O julgamento de Edom' },
  { id: 'jonas', name: 'Jonas', abbr: 'Jn', testament: 'AT', chapters: 4, category: 'Profetas Menores', description: 'A misericórdia de Deus para todas as nações' },
  { id: 'miqueias', name: 'Miquéias', abbr: 'Mq', testament: 'AT', chapters: 7, category: 'Profetas Menores', description: 'Justiça, misericórdia e a vinda do Messias' },
  { id: 'naum', name: 'Naum', abbr: 'Na', testament: 'AT', chapters: 3, category: 'Profetas Menores', description: 'O julgamento de Nínive' },
  { id: 'habacuque', name: 'Habacuque', abbr: 'Hc', testament: 'AT', chapters: 3, category: 'Profetas Menores', description: 'O justo viverá pela fé' },
  { id: 'sofonias', name: 'Sofonias', abbr: 'Sf', testament: 'AT', chapters: 3, category: 'Profetas Menores', description: 'O Dia do Senhor e a restauração de Israel' },
  { id: 'ageu', name: 'Ageu', abbr: 'Ag', testament: 'AT', chapters: 2, category: 'Profetas Menores', description: 'A reconstrução do templo' },
  { id: 'zacarias', name: 'Zacarias', abbr: 'Zc', testament: 'AT', chapters: 14, category: 'Profetas Menores', description: 'Visões messiânicas e o reino de Deus' },
  { id: 'malaquias', name: 'Malaquias', abbr: 'Ml', testament: 'AT', chapters: 4, category: 'Profetas Menores', description: 'A fidelidade de Deus e a vinda do mensageiro' },
  // Novo Testamento - Evangelhos
  { id: 'mateus', name: 'Mateus', abbr: 'Mt', testament: 'NT', chapters: 28, category: 'Evangelhos', description: 'Jesus como o Messias prometido e Rei dos reis' },
  { id: 'marcos', name: 'Marcos', abbr: 'Mc', testament: 'NT', chapters: 16, category: 'Evangelhos', description: 'Jesus como o Servo sofredor e Filho de Deus' },
  { id: 'lucas', name: 'Lucas', abbr: 'Lc', testament: 'NT', chapters: 24, category: 'Evangelhos', description: 'Jesus como o Salvador universal da humanidade' },
  { id: 'joao', name: 'João', abbr: 'Jo', testament: 'NT', chapters: 21, category: 'Evangelhos', description: 'Jesus como o Verbo eterno e Filho de Deus' },
  // Atos
  { id: 'atos', name: 'Atos', abbr: 'At', testament: 'NT', chapters: 28, category: 'História', description: 'O avanço do evangelho pelo Espírito Santo' },
  // Epístolas Paulinas
  { id: 'romanos', name: 'Romanos', abbr: 'Rm', testament: 'NT', chapters: 16, category: 'Epístolas de Paulo', description: 'A doutrina da justificação pela fé' },
  { id: '1corintios', name: '1 Coríntios', abbr: '1Co', testament: 'NT', chapters: 16, category: 'Epístolas de Paulo', description: 'Correções doutrinárias e práticas' },
  { id: '2corintios', name: '2 Coríntios', abbr: '2Co', testament: 'NT', chapters: 13, category: 'Epístolas de Paulo', description: 'O ministério apostólico e o poder na fraqueza' },
  { id: 'galatas', name: 'Gálatas', abbr: 'Gl', testament: 'NT', chapters: 6, category: 'Epístolas de Paulo', description: 'Liberdade em Cristo e a Sola Fide' },
  { id: 'efesios', name: 'Efésios', abbr: 'Ef', testament: 'NT', chapters: 6, category: 'Epístolas de Paulo', description: 'A salvação pela graça e a unidade em Cristo' },
  { id: 'filipenses', name: 'Filipenses', abbr: 'Fp', testament: 'NT', chapters: 4, category: 'Epístolas de Paulo', description: 'A alegria em Cristo em todas as circunstâncias' },
  { id: 'colossenses', name: 'Colossenses', abbr: 'Cl', testament: 'NT', chapters: 4, category: 'Epístolas de Paulo', description: 'A supremacia e suficiência de Cristo' },
  { id: '1tessalonicenses', name: '1 Tessalonicenses', abbr: '1Ts', testament: 'NT', chapters: 5, category: 'Epístolas de Paulo', description: 'A esperança do retorno de Cristo' },
  { id: '2tessalonicenses', name: '2 Tessalonicenses', abbr: '2Ts', testament: 'NT', chapters: 3, category: 'Epístolas de Paulo', description: 'Encorajamento diante da perseguição' },
  { id: '1timoteo', name: '1 Timóteo', abbr: '1Tm', testament: 'NT', chapters: 6, category: 'Epístolas de Paulo', description: 'Instruções para a vida e ordem da igreja' },
  { id: '2timoteo', name: '2 Timóteo', abbr: '2Tm', testament: 'NT', chapters: 4, category: 'Epístolas de Paulo', description: 'Fidelidade ao evangelho até o fim' },
  { id: 'tito', name: 'Tito', abbr: 'Tt', testament: 'NT', chapters: 3, category: 'Epístolas de Paulo', description: 'Sã doutrina e boa conduta' },
  { id: 'filemom', name: 'Filemom', abbr: 'Fm', testament: 'NT', chapters: 1, category: 'Epístolas de Paulo', description: 'Reconciliação e perdão em Cristo' },
  // Epístolas Gerais
  { id: 'hebreus', name: 'Hebreus', abbr: 'Hb', testament: 'NT', chapters: 13, category: 'Epístolas Gerais', description: 'A superioridade de Cristo sobre toda a lei' },
  { id: 'tiago', name: 'Tiago', abbr: 'Tg', testament: 'NT', chapters: 5, category: 'Epístolas Gerais', description: 'Fé viva que se manifesta em obras' },
  { id: '1pedro', name: '1 Pedro', abbr: '1Pe', testament: 'NT', chapters: 5, category: 'Epístolas Gerais', description: 'Esperança viva diante do sofrimento' },
  { id: '2pedro', name: '2 Pedro', abbr: '2Pe', testament: 'NT', chapters: 3, category: 'Epístolas Gerais', description: 'Crescimento na graça e falsos mestres' },
  { id: '1joao', name: '1 João', abbr: '1Jo', testament: 'NT', chapters: 5, category: 'Epístolas Gerais', description: 'A certeza da salvação e o amor cristão' },
  { id: '2joao', name: '2 João', abbr: '2Jo', testament: 'NT', chapters: 1, category: 'Epístolas Gerais', description: 'Amor e verdade doutrinária' },
  { id: '3joao', name: '3 João', abbr: '3Jo', testament: 'NT', chapters: 1, category: 'Epístolas Gerais', description: 'Hospitalidade e fidelidade à verdade' },
  { id: 'judas', name: 'Judas', abbr: 'Jd', testament: 'NT', chapters: 1, category: 'Epístolas Gerais', description: 'Contenda pela fé contra o erro' },
  // Profético
  { id: 'apocalipse', name: 'Apocalipse', abbr: 'Ap', testament: 'NT', chapters: 22, category: 'Profético', description: 'A vitória final de Cristo e o trono eterno' },
]

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.id === id)
}

export function getBooksByTestament(testament: 'AT' | 'NT'): BibleBook[] {
  return BIBLE_BOOKS.filter(b => b.testament === testament)
}

export function getBooksByCategory(category: string): BibleBook[] {
  return BIBLE_BOOKS.filter(b => b.category === category)
}

export const AT_CATEGORIES = ['Pentateuco', 'Históricos', 'Poéticos', 'Profetas Maiores', 'Profetas Menores']
export const NT_CATEGORIES = ['Evangelhos', 'História', 'Epístolas de Paulo', 'Epístolas Gerais', 'Profético']
