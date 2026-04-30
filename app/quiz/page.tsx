'use client'
import { useState, useEffect } from 'react'
import { Trophy, CheckCircle, XCircle, Lock, Star } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getTodayVerse } from '@/data/key-verses'

const PT_MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

interface Question {
  q: string
  options: string[]
  correct: number
}

const QUESTIONS: Question[] = [
  { q: 'Quantos livros tem a Bíblia?', options: ['39','66','73','80'], correct: 1 },
  { q: 'Quem escreveu a maior parte dos Salmos?', options: ['Moisés','Salomão','Davi','Isaías'], correct: 2 },
  { q: 'Qual foi o primeiro milagre de Jesus?', options: ['Cura de cego','Ressurreição de Lázaro','Água em vinho','Multiplicação de pães'], correct: 2 },
  { q: 'Quantos dias durou o dilúvio de Noé (chuva)?', options: ['20','40','80','100'], correct: 1 },
  { q: 'Qual discípulo negou Jesus 3 vezes?', options: ['Judas','João','Pedro','Tomé'], correct: 2 },
  { q: 'Em qual cidade Jesus nasceu?', options: ['Nazaré','Jerusalém','Belém','Cafarnaum'], correct: 2 },
  { q: 'Quem foi lançado na cova dos leões?', options: ['Elias','Daniel','Paulo','José'], correct: 1 },
  { q: 'Qual o versículo mais curto da Bíblia?', options: ['"Jesus chorou"','Jesus disse Amém"','Deus é amor"','E houve luz"'], correct: 0 },
  { q: 'Quantos apóstolos Jesus escolheu?', options: ['7','10','12','14'], correct: 2 },
  { q: 'Quem escreveu o livro de Apocalipse?', options: ['Paulo','Pedro','João','Tiago'], correct: 2 },
  { q: 'Qual a primeira palavra da Bíblia?', options: ['Deus','No','Em','E'], correct: 1 },
  { q: 'Quem foi o rei mais sábio de Israel?', options: ['Davi','Saul','Salomão','Ezequias'], correct: 2 },
  { q: 'Quantos dias Jesus ficou no deserto?', options: ['7','30','40','60'], correct: 2 },
  { q: 'Qual profeta foi engolido por um grande peixe?', options: ['Elias','Jonas','Miqueias','Naum'], correct: 1 },
  { q: 'Qual o primeiro livro do Novo Testamento?', options: ['João','Marcos','Lucas','Mateus'], correct: 3 },
  { q: 'Quem batizou Jesus?', options: ['Pedro','Paulo','João Batista','Barnabé'], correct: 2 },
  { q: 'Em qual rio Jesus foi batizado?', options: ['Nilo','Jordão','Eufrates','Tigre'], correct: 1 },
  { q: 'Quantos livros têm o Novo Testamento?', options: ['21','27','33','39'], correct: 1 },
  { q: 'Quem foi o primeiro homem criado por Deus?', options: ['Abel','Caim','Adão','Noé'], correct: 2 },
  { q: 'Qual é o mandamento que fala de honrar os pais?', options: ['3º','4º','5º','6º'], correct: 2 },
  { q: 'Quantas cartas Paulo escreveu no NT?', options: ['7','10','13','15'], correct: 2 },
  { q: 'Quem construiu o templo de Deus em Jerusalém?', options: ['Davi','Salomão','Ezequias','Josias'], correct: 1 },
  { q: 'Qual livro bíblico não menciona o nome de Deus?', options: ['Rute','Ester','Eclesiastes','Cantares'], correct: 1 },
  { q: 'Quantos anos Matusalém viveu?', options: ['900','950','969','999'], correct: 2 },
  { q: 'Quem escreveu os primeiros 5 livros da Bíblia?', options: ['Josué','Esdras','Moisés','Ezequiel'], correct: 2 },
  { q: 'Qual era a profissão de Lucas?', options: ['Pescador','Médico','Cobrador de impostos','Carpinteiro'], correct: 1 },
  { q: 'Qual rei mandou matar os meninos de até 2 anos?', options: ['Herodes','Pilatos','Nebucadnesar','Faraó'], correct: 0 },
  { q: 'Quantas linguagens surgiram em Babel?', options: ['Muitas','Sete','Doze','Quarenta'], correct: 0 },
  { q: 'Qual o nome da mãe de Jesus?', options: ['Ana','Maria','Sara','Rebeca'], correct: 1 },
  { q: 'Quem vendeu José como escravo?', options: ['Seus pais','Seus irmãos','Seu tio','Faraó'], correct: 1 },
]

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}

function getWeekOfYear(): number {
  return Math.floor(getDayOfYear() / 7)
}

function getTodayQuestions(): Question[] {
  const seed = getDayOfYear()
  const shuffled = [...QUESTIONS].sort((a, b) => {
    const ha = ((seed * 31 + QUESTIONS.indexOf(a)) * 17) % 100
    const hb = ((seed * 31 + QUESTIONS.indexOf(b)) * 17) % 100
    return ha - hb
  })
  return shuffled.slice(0, 5)
}

export default function QuizPage() {
  const now = new Date()
  const day = now.getDate()
  const monthLabel = PT_MONTHS_SHORT[now.getMonth()]

  const weekVerse = getTodayVerse()
  const todayQuestions = getTodayQuestions()

  const [phase, setPhase] = useState<'puzzle' | 'quiz' | 'done'>('puzzle')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [piecesUnlocked, setPiecesUnlocked] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(5).fill(null))

  useEffect(() => {
    const key = `quiz-week-${getWeekOfYear()}`
    const saved = parseInt(localStorage.getItem(key) || '0', 10)
    setPiecesUnlocked(saved)
    if (saved >= 4) setPhase('done')
  }, [])

  const handleAnswer = (optIndex: number) => {
    if (selected !== null) return
    setSelected(optIndex)
    const isCorrect = optIndex === todayQuestions[qIndex].correct
    const newAnswers = [...answers]
    newAnswers[qIndex] = isCorrect
    setAnswers(newAnswers)
    if (isCorrect) setCorrect(c => c + 1)

    setTimeout(() => {
      if (qIndex + 1 < todayQuestions.length) {
        setQIndex(i => i + 1)
        setSelected(null)
      } else {
        const key = `quiz-week-${getWeekOfYear()}`
        const prev = parseInt(localStorage.getItem(key) || '0', 10)
        const gained = newAnswers.filter(Boolean).length
        const next = Math.min(4, prev + Math.ceil(gained / 2))
        localStorage.setItem(key, String(next))
        setPiecesUnlocked(next)
        setPhase('done')
      }
    }, 900)
  }

  const q = todayQuestions[qIndex]

  return (
    <div className="min-h-screen bg-[#111] pb-28">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div className="flex items-center gap-1 bg-[#2a1e00] rounded-xl px-3 py-2">
          <span className="text-[#c9a84c] font-black text-xl">{day}</span>
          <span className="text-[#c9a84c] font-medium text-sm">{monthLabel}.</span>
        </div>
        <button className="bg-[#2a1e00] rounded-xl p-2.5">
          <Trophy size={22} className="text-[#c9a84c]" />
        </button>
      </div>

      {/* Weekly Puzzle Card */}
      <div className="mx-4 mb-6">
        <div className="relative rounded-2xl border-2 border-[#c9a84c]/50 bg-[#1a1200] overflow-hidden"
          style={{ minHeight: 280 }}>
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#c9a84c]/40 rounded-tl" />
          <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-[#c9a84c]/40 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-[#c9a84c]/40 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#c9a84c]/40 rounded-br" />

          {/* Puzzle grid overlay */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {[0,1,2,3].map(i => (
              <div key={i} className={`border border-[#c9a84c]/20 flex items-center justify-center ${
                i < piecesUnlocked ? 'opacity-0' : ''
              }`}>
                {i >= piecesUnlocked && (
                  <div className="bg-[#c9a84c]/15 rounded-xl p-2">
                    <Lock size={20} className="text-[#c9a84c]" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Center verse */}
          <div className="relative flex flex-col items-center justify-center py-12 px-8 text-center" style={{ minHeight: 280 }}>
            <div className="bg-[#111]/80 rounded-2xl px-4 py-5 backdrop-blur">
              <p className="text-white/90 text-sm italic leading-relaxed font-serif mb-3">
                "{weekVerse.text.slice(0, 100)}{weekVerse.text.length > 100 ? '…' : ''}"
              </p>
              <p className="text-[#c9a84c] text-xs font-semibold tracking-wider">{weekVerse.reference}</p>
              {piecesUnlocked >= 4 && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <Star size={14} className="text-[#c9a84c]" fill="currentColor" />
                  <span className="text-[#c9a84c] text-xs font-bold">COMPLETO</span>
                  <Star size={14} className="text-[#c9a84c]" fill="currentColor" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle info */}
      <div className="px-4 mb-6 text-center">
        <h2 className="text-white font-bold text-xl mb-1">Quebra-cabeça semanal</h2>
        <p className="text-parchment/50 text-sm">
          {piecesUnlocked >= 4
            ? 'Parabéns! Você completou o quebra-cabeça desta semana.'
            : `${piecesUnlocked}/4 peças desbloqueadas. Faça o quiz para ganhar mais!`}
        </p>
        {/* Progress bar */}
        <div className="mt-3 mx-8 bg-[#2a2a2a] rounded-full h-2">
          <div className="bg-[#c9a84c] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(piecesUnlocked / 4) * 100}%` }} />
        </div>
      </div>

      {/* Quiz section */}
      {phase === 'puzzle' && (
        <div className="px-4">
          <button
            onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-2xl font-bold text-base text-[#111] transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, #c9a84c, #e8c870)' }}>
            Começar Quiz
          </button>
          <p className="text-center text-parchment/40 text-xs mt-3">5 perguntas bíblicas</p>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="px-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {todayQuestions.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${
                answers[i] === true ? 'bg-[#4ade80]' :
                answers[i] === false ? 'bg-red-500' :
                i === qIndex ? 'bg-[#c9a84c]' : 'bg-[#2a2a2a]'
              }`} />
            ))}
          </div>
          <p className="text-parchment/40 text-xs mb-4">Pergunta {qIndex+1} de {todayQuestions.length}</p>

          {/* Question */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-4">
            <p className="text-white text-base font-semibold leading-relaxed">{q.q}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrectOpt = i === q.correct
              let style = 'bg-[#1a1a1a] border-transparent text-white'
              if (selected !== null) {
                if (isCorrectOpt) style = 'bg-[#4ade80]/15 border-[#4ade80] text-[#4ade80]'
                else if (isSelected) style = 'bg-red-500/15 border-red-500 text-red-400'
                else style = 'bg-[#1a1a1a] border-transparent text-parchment/40'
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${style}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65+i)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {selected !== null && isCorrectOpt && <CheckCircle size={18} className="ml-auto text-[#4ade80]" />}
                  {selected !== null && isSelected && !isCorrectOpt && <XCircle size={18} className="ml-auto text-red-400" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="px-4 text-center">
          <div className="bg-[#1a1a1a] rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 flex items-center justify-center mx-auto mb-4">
              <Trophy size={30} className="text-[#c9a84c]" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Quiz concluído!</h3>
            <p className="text-parchment/60 text-sm mb-4">
              Você acertou {correct} de {todayQuestions.length} perguntas
            </p>
            <div className="flex justify-center gap-1 mb-4">
              {answers.map((a, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${a ? 'bg-[#4ade80]/20' : 'bg-red-500/20'}`}>
                  {a ? <CheckCircle size={16} className="text-[#4ade80]" /> : <XCircle size={16} className="text-red-400" />}
                </div>
              ))}
            </div>
            <p className="text-[#c9a84c] text-sm">
              {piecesUnlocked}/4 peças do quebra-cabeça desbloqueadas
            </p>
            {piecesUnlocked < 4 && (
              <p className="text-parchment/40 text-xs mt-2">Volte amanhã para mais perguntas!</p>
            )}
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}
