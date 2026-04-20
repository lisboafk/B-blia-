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
    const res = await fetch(`/bible/${bookId}.json`)
    if (!res.ok) throw new Error('not found')
    const data = await res.json()
    const raw: { v: number; t: string }[] = data.chapters?.[String(chapter)] || []
    const verses = raw.map(({ v, t }) => ({ verse: v, text: t }))
    if (verses.length === 0) throw new Error('empty chapter')
    return { book: bookId, chapter, verses, source: 'Almeida Revista e Corrigida' }
  } catch {
    return getFallbackChapter(bookId, chapter)
  }
}

function getFallbackChapter(bookId: string, chapter: number): BibleChapter {
  const key = `${bookId}-${chapter}`
  const fallback = FALLBACK_CONTENT[key]
  if (fallback) return { book: bookId, chapter, verses: fallback, source: 'Almeida (Domínio Público)' }
  return { book: bookId, chapter, verses: [], source: 'Offline', error: true }
}

const FALLBACK_CONTENT: Record<string, BibleVerse[]> = {
  'genesis-1': [
    { verse: 1, text: 'No princípio, criou Deus os céus e a terra.' },
    { verse: 2, text: 'A terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
    { verse: 3, text: 'E disse Deus: Haja luz. E houve luz.' },
    { verse: 4, text: 'E viu Deus que a luz era boa; e Deus fez separação entre a luz e as trevas.' },
    { verse: 5, text: 'E Deus chamou à luz Dia, e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.' },
    { verse: 26, text: 'E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra.' },
    { verse: 27, text: 'E Deus criou o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.' },
    { verse: 31, text: 'E viu Deus tudo quanto tinha feito, e eis que era muito bom. E foi a tarde e a manhã, o dia sexto.' },
  ],
  'apocalipse-1': [
    { verse: 1, text: 'Revelação de Jesus Cristo, que Deus lhe deu para mostrar aos seus servos as coisas que em breve devem acontecer; e pelo seu anjo as enviou e as notificou ao seu servo João,' },
    { verse: 2, text: 'o qual testificou da palavra de Deus e do testemunho de Jesus Cristo, e de tudo o que viu.' },
    { verse: 3, text: 'Bem-aventurado o que lê, e os que ouvem as palavras desta profecia, e guardam as coisas nela escritas; porque o tempo está próximo.' },
    { verse: 4, text: 'João, às sete igrejas que estão na Ásia: Graça a vós outros e paz, daquele que é, e que era, e que há de vir, e dos sete espíritos que estão diante do seu trono,' },
    { verse: 5, text: 'e de Jesus Cristo, que é a fiel testemunha, o primogênito dos mortos e o príncipe dos reis da terra. Àquele que nos amou e em seu sangue nos lavou dos nossos pecados,' },
    { verse: 6, text: 'e nos constituiu reis e sacerdotes para Deus, seu Pai; a ele seja glória e poder para todo o sempre. Amém.' },
    { verse: 7, text: 'Eis que vem com as nuvens, e todo o olho o verá, até os mesmos que o traspassaram; e todas as tribos da terra se lamentarão por causa dele. Sim. Amém.' },
    { verse: 8, text: 'Eu sou o Alfa e o Ômega, diz o Senhor Deus, aquele que é, e que era, e que há de vir, o Todo-Poderoso.' },
    { verse: 9, text: 'Eu, João, que também sou vosso irmão e companheiro na tribulação, e no reino, e na perseverança de Jesus Cristo, estava na ilha chamada Patmos, por causa da palavra de Deus e do testemunho de Jesus Cristo.' },
    { verse: 10, text: 'Caí em espírito no dia do Senhor, e ouvi detrás de mim uma grande voz, como de trombeta,' },
    { verse: 11, text: 'que dizia: Eu sou o Alfa e o Ômega, o primeiro e o último; o que vês, escreve-o num livro e manda-o às sete igrejas que estão na Ásia.' },
    { verse: 12, text: 'E me voltei para ver a voz que falava comigo. E, voltando-me, vi sete candeeiros de ouro,' },
    { verse: 13, text: 'e no meio dos sete candeeiros um semelhante ao Filho do homem, vestido até aos pés, e cingido pelo peito com um cinto de ouro.' },
    { verse: 14, text: 'A sua cabeça e cabelos eram brancos como lã branca, como a neve; e os seus olhos, como chama de fogo.' },
    { verse: 15, text: 'E os seus pés, semelhantes ao bronze polido, como se tivessem sido refinados numa fornalha; e a sua voz como o ruído de muitas águas.' },
    { verse: 16, text: 'E tinha na sua mão direita sete estrelas; e da sua boca saía uma aguda espada de dois gumes; e o seu rosto era como o sol, quando resplandece na sua força.' },
    { verse: 17, text: 'E quando eu o vi, caí a seus pés como morto; e ele pôs sobre mim a sua mão direita, dizendo: Não temas; eu sou o primeiro e o último,' },
    { verse: 18, text: 'e aquele que vive; e estive morto, mas eis que estou vivo pelos séculos dos séculos. Amém. E tenho as chaves da morte e do inferno.' },
    { verse: 19, text: 'Escreve, pois, as coisas que viste, e as que são, e as que hão de acontecer depois destas.' },
    { verse: 20, text: 'O mistério das sete estrelas que viste na minha mão direita, e dos sete candeeiros de ouro: As sete estrelas são os anjos das sete igrejas, e os sete candeeiros são as sete igrejas.' },
  ],
  'salmos-23': [
    { verse: 1, text: 'O Senhor é o meu pastor; nada me faltará.' },
    { verse: 2, text: 'Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso;' },
    { verse: 3, text: 'refrigera a minha alma. Guia-me pelas veredas da justiça por amor do seu nome.' },
    { verse: 4, text: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; o teu cajado e o teu bordão me consolam.' },
    { verse: 5, text: 'Preparas uma mesa perante mim na presença dos meus adversários, unges a minha cabeça com óleo; o meu cálice transborda.' },
    { verse: 6, text: 'Bondade e misericórdia certamente me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
  ],
  'joao-3': [
    { verse: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.' },
    { verse: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
  ],
  'romanos-8': [
    { verse: 1, text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.' },
    { verse: 28, text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
    { verse: 38, text: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados, nem as coisas presentes, nem as por vir, nem os poderes,' },
    { verse: 39, text: 'nem a altura, nem a profundeza, nem qualquer outra criatura nos poderá separar do amor de Deus que está em Cristo Jesus nosso Senhor.' },
  ],
  'efesios-2': [
    { verse: 8, text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.' },
    { verse: 9, text: 'Não por obras, para que ninguém se glorie.' },
    { verse: 10, text: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus antes preparou para que andássemos nelas.' },
  ],
}
