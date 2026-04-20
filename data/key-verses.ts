export interface KeyVerse {
  id: string
  reference: string
  book: string
  chapter: number
  verse: number
  text: string
  theme: string
  color: string
}

export const DAILY_VERSES: KeyVerse[] = [
  {
    id: 'rm8-28', reference: 'Romanos 8:28', book: 'romanos', chapter: 8, verse: 28,
    text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    theme: 'Providência', color: '#c9a84c'
  },
  {
    id: 'jo3-16', reference: 'João 3:16', book: 'joao', chapter: 3, verse: 16,
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
    theme: 'Graça', color: '#ff6b35'
  },
  {
    id: 'ef2-8', reference: 'Efésios 2:8-9', book: 'efesios', chapter: 2, verse: 8,
    text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus. Não por obras, para que ninguém se glorie.',
    theme: 'Sola Gratia', color: '#c9a84c'
  },
  {
    id: 'rm8-1', reference: 'Romanos 8:1', book: 'romanos', chapter: 8, verse: 1,
    text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.',
    theme: 'Justificação', color: '#ffd700'
  },
  {
    id: 'sl23-1', reference: 'Salmos 23:1', book: 'salmos', chapter: 23, verse: 1,
    text: 'O Senhor é o meu pastor; nada me faltará.',
    theme: 'Confiança', color: '#c9a84c'
  },
  {
    id: 'is53-5', reference: 'Isaías 53:5', book: 'isaias', chapter: 53, verse: 5,
    text: 'Mas ele foi ferido por causa das nossas transgressões e moído por causa das nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.',
    theme: 'Expiação', color: '#ff4500'
  },
  {
    id: 'fp4-13', reference: 'Filipenses 4:13', book: 'filipenses', chapter: 4, verse: 13,
    text: 'Posso tudo naquele que me fortalece.',
    theme: 'Força em Cristo', color: '#c9a84c'
  },
]

export const HIGHLIGHTED_PASSAGES = [
  { reference: 'Romanos 8', book: 'romanos', chapter: 8, label: 'Nenhuma Condenação' },
  { reference: 'João 1', book: 'joao', chapter: 1, label: 'O Verbo Eterno' },
  { reference: 'Efésios 2', book: 'efesios', chapter: 2, label: 'Salvos pela Graça' },
  { reference: 'Salmos 23', book: 'salmos', chapter: 23, label: 'O Bom Pastor' },
  { reference: 'Hebreus 11', book: 'hebreus', chapter: 11, label: 'Hall da Fé' },
  { reference: 'Isaías 53', book: 'isaias', chapter: 53, label: 'O Servo Sofredor' },
  { reference: 'João 3', book: 'joao', chapter: 3, label: 'Novo Nascimento' },
  { reference: 'Apocalipse 1', book: 'apocalipse', chapter: 1, label: 'A Revelação de Cristo' },
]

export function getTodayVerse(): KeyVerse {
  const day = new Date().getDay()
  return DAILY_VERSES[day % DAILY_VERSES.length]
}
