export interface BibleVerse {
  verse: number
  text: string
}

export interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
  source: string
  error?: boolean
}


export async function fetchChapter(bookId: string, chapter: number): Promise<BibleChapter> {
  try {
    const res = await fetch(`/api/bible?book=${bookId}&chapter=${chapter}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return { book: bookId, chapter, verses: data.verses, source: data.source }
  } catch {
    return getFallbackChapter(bookId, chapter)
  }
}

function getFallbackChapter(bookId: string, chapter: number): BibleChapter {
  const fallback = FALLBACK_CONTENT[`${bookId}-${chapter}`]
  if (fallback) return { book: bookId, chapter, verses: fallback, source: 'Almeida (Domínio Público)' }
  return { book: bookId, chapter, verses: [], source: 'Offline', error: true }
}

const FALLBACK_CONTENT: Record<string, BibleVerse[]> = {
  'salmos-23': [
    { verse: 1, text: 'O Senhor é o meu pastor; nada me faltará.' },
    { verse: 2, text: 'Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso;' },
    { verse: 3, text: 'refrigera a minha alma. Guia-me pelas veredas da justiça por amor do seu nome.' },
    { verse: 4, text: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; o teu cajado e o teu bordão me consolam.' },
    { verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus adversários, unges a minha cabeça com óleo; o meu cálice transborda.' },
    { verse: 6, text: 'Bondade e misericórdia certamente me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
  ],
  'joao-3': [
    { verse: 1, text: 'Havia entre os fariseus um homem chamado Nicodemos, príncipe dos judeus.' },
    { verse: 2, text: 'Este foi ter com Jesus de noite e disse-lhe: Rabi, sabemos que és Mestre vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não estiver com ele.' },
    { verse: 3, text: 'Jesus respondeu e disse-lhe: Em verdade, em verdade te digo que aquele que não nascer de novo não pode ver o reino de Deus.' },
    { verse: 4, text: 'Disse-lhe Nicodemos: Como pode um homem nascer sendo velho? Pode entrar segunda vez no ventre de sua mãe e nascer?' },
    { verse: 5, text: 'Jesus respondeu: Em verdade, em verdade te digo que aquele que não nascer da água e do Espírito não pode entrar no reino de Deus.' },
    { verse: 6, text: 'O que é nascido da carne é carne; e o que é nascido do Espírito é espírito.' },
    { verse: 7, text: 'Não te maravilhes de te ter dito: Importa-vos nascer de novo.' },
    { verse: 14, text: 'E, assim como Moisés levantou a serpente no deserto, assim importa que o Filho do Homem seja levantado,' },
    { verse: 15, text: 'para que todo o que nele crê não pereça, mas tenha a vida eterna.' },
    { verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.' },
    { verse: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
    { verse: 36, text: 'Quem crê no Filho tem a vida eterna; quem, porém, não obedece ao Filho não verá a vida, mas a ira de Deus sobre ele permanece.' },
  ],
  'romanos-8': [
    { verse: 1, text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.' },
    { verse: 2, text: 'Porque a lei do Espírito da vida, em Cristo Jesus, te livrou da lei do pecado e da morte.' },
    { verse: 3, text: 'Porquanto o que era impossível à lei, visto como estava enfraquecida pela carne, Deus o fez enviando o seu próprio Filho em semelhança da carne do pecado e por causa do pecado, condenou o pecado na carne.' },
    { verse: 14, text: 'Porque todos os que são guiados pelo Espírito de Deus são filhos de Deus.' },
    { verse: 15, text: 'Porque não recebestes o espírito de escravidão para viverdes outra vez em temor, mas recebestes o Espírito de adoção, pelo qual clamamos: Aba, Pai.' },
    { verse: 28, text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
    { verse: 29, text: 'Porque os que de antemão conheceu, também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.' },
    { verse: 30, text: 'E aos que predestinou, a esses também chamou; e aos que chamou, a esses também justificou; e aos que justificou, a esses também glorificou.' },
    { verse: 31, text: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?' },
    { verse: 32, text: 'Aquele que não poupou nem o seu próprio Filho, antes o entregou por todos nós, como nos não dará também com ele todas as coisas?' },
    { verse: 37, text: 'Mas, em todas estas coisas, somos mais do que vencedores, por meio daquele que nos amou.' },
    { verse: 38, text: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as coisas presentes, nem as por vir, nem os poderes,' },
    { verse: 39, text: 'nem a altura, nem a profundeza, nem qualquer outra criatura nos poderá separar do amor de Deus que está em Cristo Jesus nosso Senhor.' },
  ],
  'efesios-2': [
    { verse: 1, text: 'E a vós outros vos vivificou, sendo que estáveis mortos nos vossos delitos e pecados.' },
    { verse: 4, text: 'Mas Deus, sendo rico em misericórdia, por causa do grande amor com que nos amou,' },
    { verse: 5, text: 'e estando nós mortos em nossos delitos, nos deu vida juntamente com Cristo (pela graça sois salvos),' },
    { verse: 8, text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.' },
    { verse: 9, text: 'Não por obras, para que ninguém se glorie.' },
    { verse: 10, text: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus antes preparou para que andássemos nelas.' },
  ],
}
