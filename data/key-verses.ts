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

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

export function getTodayVerse(): KeyVerse {
  return DAILY_VERSES[getDayOfYear() % DAILY_VERSES.length]
}

export const DAILY_VERSES: KeyVerse[] = [
  { id: 'rm8-28', reference: 'Romanos 8:28', book: 'romanos', chapter: 8, verse: 28, theme: 'Providência', color: '#c9a84c',
    text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
  { id: 'jo3-16', reference: 'João 3:16', book: 'joao', chapter: 3, verse: 16, theme: 'Graça', color: '#ff6b35',
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.' },
  { id: 'ef2-8', reference: 'Efésios 2:8-9', book: 'efesios', chapter: 2, verse: 8, theme: 'Sola Gratia', color: '#c9a84c',
    text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus. Não por obras, para que ninguém se glorie.' },
  { id: 'rm8-1', reference: 'Romanos 8:1', book: 'romanos', chapter: 8, verse: 1, theme: 'Justificação', color: '#ffd700',
    text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.' },
  { id: 'sl23-1', reference: 'Salmos 23:1', book: 'salmos', chapter: 23, verse: 1, theme: 'Confiança', color: '#c9a84c',
    text: 'O Senhor é o meu pastor; nada me faltará.' },
  { id: 'is53-5', reference: 'Isaías 53:5', book: 'isaias', chapter: 53, verse: 5, theme: 'Expiação', color: '#ff4500',
    text: 'Mas ele foi ferido por causa das nossas transgressões e moído por causa das nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.' },
  { id: 'fp4-13', reference: 'Filipenses 4:13', book: 'filipenses', chapter: 4, verse: 13, theme: 'Força em Cristo', color: '#c9a84c',
    text: 'Posso tudo naquele que me fortalece.' },
  { id: 'hb11-1', reference: 'Hebreus 11:1', book: 'hebreus', chapter: 11, verse: 1, theme: 'Fé', color: '#f0c040',
    text: 'Ora, a fé é a certeza de coisas que se esperam e a convicção de coisas que não se veem.' },
  { id: 'jo14-6', reference: 'João 14:6', book: 'joao', chapter: 14, verse: 6, theme: 'Cristo', color: '#c9a84c',
    text: 'Disse-lhe Jesus: Eu sou o caminho, a verdade e a vida; ninguém vem ao Pai senão por mim.' },
  { id: '2tm3-16', reference: '2 Timóteo 3:16', book: '2timoteo', chapter: 3, verse: 16, theme: 'Sola Scriptura', color: '#ffd700',
    text: 'Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução em justiça.' },
  { id: 'rm10-17', reference: 'Romanos 10:17', book: 'romanos', chapter: 10, verse: 17, theme: 'Fé', color: '#c9a84c',
    text: 'De modo que a fé vem pelo ouvir, e o ouvir pela palavra de Cristo.' },
  { id: 'pv3-5', reference: 'Provérbios 3:5-6', book: 'proverbios', chapter: 3, verse: 5, theme: 'Confiança', color: '#f0c040',
    text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.' },
  { id: 'is40-31', reference: 'Isaías 40:31', book: 'isaias', chapter: 40, verse: 31, theme: 'Força', color: '#c9a84c',
    text: 'Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias, correrão e não se cansarão, caminharão e não se fatigarão.' },
  { id: 'jo10-28', reference: 'João 10:28', book: 'joao', chapter: 10, verse: 28, theme: 'Segurança Eterna', color: '#ffd700',
    text: 'Eu dou-lhes a vida eterna; não perecerão eternamente, e ninguém as arrebatará da minha mão.' },
  { id: '2co5-17', reference: '2 Coríntios 5:17', book: '2corintios', chapter: 5, verse: 17, theme: 'Santificação', color: '#ff6b35',
    text: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.' },
  { id: 'fp4-6', reference: 'Filipenses 4:6-7', book: 'filipenses', chapter: 4, verse: 6, theme: 'Oração', color: '#c9a84c',
    text: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.' },
  { id: 'rm5-8', reference: 'Romanos 5:8', book: 'romanos', chapter: 5, verse: 8, theme: 'Amor de Deus', color: '#ff4500',
    text: 'Mas Deus prova o seu amor para conosco em que Cristo morreu por nós, sendo nós ainda pecadores.' },
  { id: 'gl2-20', reference: 'Gálatas 2:20', book: 'galatas', chapter: 2, verse: 20, theme: 'União com Cristo', color: '#ffd700',
    text: 'Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim; e a vida que agora vivo na carne, vivo-a pela fé no Filho de Deus, que me amou e se entregou a si mesmo por mim.' },
  { id: 'jo15-5', reference: 'João 15:5', book: 'joao', chapter: 15, verse: 5, theme: 'Vida em Cristo', color: '#c9a84c',
    text: 'Eu sou a videira, vós sois os ramos; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.' },
  { id: 'mt11-28', reference: 'Mateus 11:28', book: 'mateus', chapter: 11, verse: 28, theme: 'Descanso', color: '#f0c040',
    text: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.' },
  { id: 'sl46-1', reference: 'Salmos 46:1', book: 'salmos', chapter: 46, verse: 1, theme: 'Refúgio', color: '#c9a84c',
    text: 'Deus é o nosso refúgio e a nossa força; socorro bem presente nas tribulações.' },
  { id: 'sl119-105', reference: 'Salmos 119:105', book: 'salmos', chapter: 119, verse: 105, theme: 'Palavra', color: '#ffd700',
    text: 'A tua palavra é lâmpada que guia os meus passos e luz que ilumina o meu caminho.' },
  { id: '1jo1-9', reference: '1 João 1:9', book: '1joao', chapter: 1, verse: 9, theme: 'Perdão', color: '#ff6b35',
    text: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.' },
  { id: '1jo4-19', reference: '1 João 4:19', book: '1joao', chapter: 4, verse: 19, theme: 'Amor', color: '#c9a84c',
    text: 'Nós amamos a Deus, porque ele nos amou primeiro.' },
  { id: 'hb12-2', reference: 'Hebreus 12:2', book: 'hebreus', chapter: 12, verse: 2, theme: 'Perseverança', color: '#ffd700',
    text: 'Olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a vergonha, e está assentado à destra do trono de Deus.' },
  { id: 'rm12-2', reference: 'Romanos 12:2', book: 'romanos', chapter: 12, verse: 2, theme: 'Renovação', color: '#c9a84c',
    text: 'E não sede conformados com este século, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável e perfeita vontade de Deus.' },
  { id: 'jr29-11', reference: 'Jeremias 29:11', book: 'jeremias', chapter: 29, verse: 11, theme: 'Esperança', color: '#ff6b35',
    text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.' },
  { id: '2co12-9', reference: '2 Coríntios 12:9', book: '2corintios', chapter: 12, verse: 9, theme: 'Graça na Fraqueza', color: '#f0c040',
    text: 'Basta-te a minha graça, porque o meu poder se aperfeiçoa na fraqueza.' },
  { id: 'jo11-25', reference: 'João 11:25', book: 'joao', chapter: 11, verse: 25, theme: 'Ressurreição', color: '#ffd700',
    text: 'Disse-lhe Jesus: Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá.' },
  { id: 'ef1-4', reference: 'Efésios 1:4-5', book: 'efesios', chapter: 1, verse: 4, theme: 'Eleição', color: '#c9a84c',
    text: 'Como também nos elegeu nele antes da fundação do mundo, para sermos santos e irrepreensíveis diante dele em amor; e nos predestinou para filhos de adoção por Jesus Cristo.' },
  { id: 'rm3-23', reference: 'Romanos 3:23-24', book: 'romanos', chapter: 3, verse: 23, theme: 'Justificação', color: '#ff4500',
    text: 'Porque todos pecaram e destituídos estão da glória de Deus; sendo justificados gratuitamente pela sua graça, pela redenção que há em Cristo Jesus.' },
  { id: 'tt3-5', reference: 'Tito 3:5', book: 'tito', chapter: 3, verse: 5, theme: 'Regeneração', color: '#ffd700',
    text: 'Não por obras de justiça que houvéssemos feito, mas segundo a sua misericórdia, nos salvou pela lavagem da regeneração e da renovação do Espírito Santo.' },
  { id: '1pe5-7', reference: '1 Pedro 5:7', book: '1pedro', chapter: 5, verse: 7, theme: 'Cuidado de Deus', color: '#c9a84c',
    text: 'Lançai sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.' },
  { id: 'mt6-33', reference: 'Mateus 6:33', book: 'mateus', chapter: 6, verse: 33, theme: 'Reino de Deus', color: '#f0c040',
    text: 'Mas buscai primeiro o reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.' },
  { id: 'js1-9', reference: 'Josué 1:9', book: 'josue', chapter: 1, verse: 9, theme: 'Coragem', color: '#ff6b35',
    text: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não te atemorizies, nem te espantes; porque o Senhor teu Deus é contigo por onde quer que andares.' },
  { id: 'sl27-1', reference: 'Salmos 27:1', book: 'salmos', chapter: 27, verse: 1, theme: 'Confiança', color: '#c9a84c',
    text: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; a quem me recearei?' },
  { id: 'ap1-8', reference: 'Apocalipse 1:8', book: 'apocalipse', chapter: 1, verse: 8, theme: 'Soberania de Cristo', color: '#ffd700',
    text: 'Eu sou o Alfa e o Ômega, diz o Senhor Deus, aquele que é, e que era, e que há de vir, o Todo-Poderoso.' },
  { id: 'fp2-9', reference: 'Filipenses 2:9-10', book: 'filipenses', chapter: 2, verse: 9, theme: 'Exaltação de Cristo', color: '#f0c040',
    text: 'Por isso Deus o exaltou soberanamente e lhe deu o nome que é sobre todo o nome; para que ao nome de Jesus se dobre todo o joelho, dos que estão nos céus, e dos que estão na terra.' },
  { id: 'ap21-4', reference: 'Apocalipse 21:4', book: 'apocalipse', chapter: 21, verse: 4, theme: 'Esperança Final', color: '#ff6b35',
    text: 'E Deus limpará de seus olhos toda lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.' },
  { id: 'rm8-38', reference: 'Romanos 8:38-39', book: 'romanos', chapter: 8, verse: 38, theme: 'Amor Infalível', color: '#c9a84c',
    text: 'Porque estou certo de que nem a morte, nem a vida, nem os anjos, nem os principados... nem qualquer outra criatura nos poderá separar do amor de Deus que está em Cristo Jesus nosso Senhor.' },
  { id: 'gn1-1', reference: 'Gênesis 1:1', book: 'genesis', chapter: 1, verse: 1, theme: 'Criação', color: '#ffd700',
    text: 'No princípio, criou Deus os céus e a terra.' },
  { id: 'sl91-1', reference: 'Salmos 91:1', book: 'salmos', chapter: 91, verse: 1, theme: 'Proteção', color: '#c9a84c',
    text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.' },
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
