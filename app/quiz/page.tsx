'use client'
import { useState, useEffect } from 'react'
import { Trophy, CheckCircle, XCircle, Star, ChevronLeft, Volume2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getTodayVerse } from '@/data/key-verses'

const PT_MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

interface Question { q: string; options: string[]; correct: number }

const QUESTIONS: Question[] = [
  { q: 'Quantos livros tem a Bíblia?', options: ['39','66','73','80'], correct: 1 },
  { q: 'Quem escreveu a maior parte dos Salmos?', options: ['Moisés','Salomão','Davi','Isaías'], correct: 2 },
  { q: 'Qual foi o primeiro milagre de Jesus?', options: ['Cura de cego','Ressurreição de Lázaro','Água em vinho','Multiplicação de pães'], correct: 2 },
  { q: 'Quantos dias durou a chuva do dilúvio de Noé?', options: ['20','40','80','100'], correct: 1 },
  { q: 'Qual discípulo negou Jesus 3 vezes?', options: ['Judas','João','Pedro','Tomé'], correct: 2 },
  { q: 'Em qual cidade Jesus nasceu?', options: ['Nazaré','Jerusalém','Belém','Cafarnaum'], correct: 2 },
  { q: 'Quem foi lançado na cova dos leões?', options: ['Elias','Daniel','Paulo','José'], correct: 1 },
  { q: 'Qual o versículo mais curto da Bíblia?', options: ['"Jesus chorou"','"Regozijai-vos"','"Deus é amor"','"E houve luz"'], correct: 0 },
  { q: 'Quantos apóstolos Jesus escolheu?', options: ['7','10','12','14'], correct: 2 },
  { q: 'Quem escreveu o livro de Apocalipse?', options: ['Paulo','Pedro','João','Tiago'], correct: 2 },
  { q: 'Qual a primeira palavra da Bíblia em português?', options: ['Deus','No','Em','E'], correct: 1 },
  { q: 'Quem foi o rei mais sábio de Israel?', options: ['Davi','Saul','Salomão','Ezequias'], correct: 2 },
  { q: 'Quantos dias Jesus ficou no deserto?', options: ['7','30','40','60'], correct: 2 },
  { q: 'Qual profeta foi engolido por um grande peixe?', options: ['Elias','Jonas','Miqueias','Naum'], correct: 1 },
  { q: 'Qual o primeiro livro do Novo Testamento?', options: ['João','Marcos','Lucas','Mateus'], correct: 3 },
  { q: 'Quem batizou Jesus?', options: ['Pedro','Paulo','João Batista','Barnabé'], correct: 2 },
  { q: 'Em qual rio Jesus foi batizado?', options: ['Nilo','Jordão','Eufrates','Tigre'], correct: 1 },
  { q: 'Quantos livros tem o Novo Testamento?', options: ['21','27','33','39'], correct: 1 },
  { q: 'Quem foi o primeiro homem criado por Deus?', options: ['Abel','Caim','Adão','Noé'], correct: 2 },
  { q: 'Qual é o 5º mandamento?', options: ['Não mentirás','Não matarás','Honra pai e mãe','Não roubarás'], correct: 2 },
  { q: 'Quantas cartas Paulo escreveu no NT?', options: ['7','10','13','15'], correct: 2 },
  { q: 'Quem construiu o templo de Deus em Jerusalém?', options: ['Davi','Salomão','Ezequias','Josias'], correct: 1 },
  { q: 'Qual livro bíblico não menciona o nome de Deus?', options: ['Rute','Ester','Eclesiastes','Cantares'], correct: 1 },
  { q: 'Quantos anos Matusalém viveu?', options: ['900','950','969','999'], correct: 2 },
  { q: 'Quem escreveu os primeiros 5 livros da Bíblia?', options: ['Josué','Esdras','Moisés','Ezequiel'], correct: 2 },
  { q: 'Qual era a profissão de Lucas?', options: ['Pescador','Médico','Cobrador de impostos','Carpinteiro'], correct: 1 },
  { q: 'Qual rei mandou matar os meninos de até 2 anos?', options: ['Herodes','Pilatos','Nebucadnesar','Faraó'], correct: 0 },
  { q: 'O que aconteceu em Babel?', options: ['Dilúvio','Torre destruída por fogo','Confusão das línguas','Arca construída'], correct: 2 },
  { q: 'Qual o nome da mãe de Jesus?', options: ['Ana','Maria','Sara','Rebeca'], correct: 1 },
  { q: 'Quem vendeu José como escravo?', options: ['Seus pais','Seus irmãos','Seu tio','Faraó'], correct: 1 },
]

function getDayOfYear(): number {
  const now = new Date()
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
}
function getWeekOfYear(): number { return Math.floor(getDayOfYear() / 7) }

function getTodayQuestions(): Question[] {
  const seed = getDayOfYear()
  const shuffled = [...QUESTIONS].sort((a, b) => {
    const ha = ((seed * 31 + QUESTIONS.indexOf(a)) * 17) % 100
    const hb = ((seed * 31 + QUESTIONS.indexOf(b)) * 17) % 100
    return ha - hb
  })
  return shuffled.slice(0, 5)
}

function speakText(text: string) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  u.rate = 0.9
  const ptVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('pt'))
  if (ptVoice) u.voice = ptVoice
  window.speechSynthesis.speak(u)
}

export default function QuizPage() {
  const now = new Date()
  const weekVerse = getTodayVerse()

  const [aiQuestions, setAiQuestions] = useState<Question[] | null>(null)
  const todayQuestions = aiQuestions ?? getTodayQuestions()

  useEffect(() => {
    const cacheKey = `ai-quiz-day-${getDayOfYear()}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try { setAiQuestions(JSON.parse(cached)); return } catch {}
    }
    fetch('/api/quiz')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          setAiQuestions(data.questions)
          sessionStorage.setItem(cacheKey, JSON.stringify(data.questions))
        }
      })
      .catch(() => {})
  }, [])

  const [phase, setPhase] = useState<'puzzle' | 'quiz' | 'done'>('puzzle')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [piecesUnlocked, setPiecesUnlocked] = useState(0)
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(5).fill(null))
  const [showAmem, setShowAmem] = useState(false)

  useEffect(() => {
    const key = `quiz-day-${getDayOfYear()}`
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

    if (isCorrect) {
      setCorrect(c => c + 1)
      setShowAmem(true)
      speakText('Amém!')
      setTimeout(() => setShowAmem(false), 1800)
    }

    setTimeout(() => {
      if (qIndex + 1 < todayQuestions.length) {
        setQIndex(i => i + 1); setSelected(null)
      } else {
        const key = `quiz-day-${getDayOfYear()}`
        const prev = parseInt(localStorage.getItem(key) || '0', 10)
        const gained = newAnswers.filter(Boolean).length
        const next = Math.min(4, prev + Math.ceil(gained / 2))
        localStorage.setItem(key, String(next))
        setPiecesUnlocked(next)
        setPhase('done')
      }
    }, 1400)
  }

  const q = todayQuestions[qIndex]

  if (phase === 'quiz') {
    return (
      <div className="min-h-screen bg-[#111]">
        {showAmem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-red-600 px-10 py-6 rounded-2xl shadow-2xl animate-bounce">
              <p className="text-white text-5xl font-black text-center">🙏 Amém!</p>
            </div>
          </div>
        )}

        <div className="flex items-center px-4 pt-12 pb-5 gap-3">
          <button onClick={() => { window.speechSynthesis.cancel(); setPhase('puzzle'); setQIndex(0); setSelected(null); setCorrect(0); setAnswers(Array(5).fill(null)) }}
            aria-label="Voltar" className="text-white/50 p-1">
            <ChevronLeft size={24} />
          </button>
          <span className="text-2xl">🧩</span>
          <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
            <div className="bg-[#c9a84c] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(correct / todayQuestions.length) * 100}%` }} />
          </div>
          <span className="text-white text-sm font-bold">{correct}/{todayQuestions.length}</span>
        </div>

        <div className="mx-4 mb-5 border-2 border-[#c9a84c]/60 rounded-2xl bg-[#1a1a00] overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#c9a84c]/20">
            <span className="text-[#c9a84c] text-sm font-medium">Questão {qIndex + 1}/{todayQuestions.length}</span>
            <button onClick={() => speakText(q.q)} aria-label="Ouvir pergunta"
              className="text-white/40 hover:text-[#c9a84c] transition-colors active:scale-90 p-1">
              <Volume2 size={18} />
            </button>
          </div>
          <p className="px-5 py-6 text-white text-xl font-medium leading-snug">{q.q}</p>
        </div>

        <div className="px-4 space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrectOpt = i === q.correct
            let cls = 'bg-[#2a2a2a] text-white'
            let icon: string | null = null
            if (selected !== null) {
              if (isCorrectOpt) { cls = 'bg-[#4ade80] text-white'; icon = '✓' }
              else if (isSelected) { cls = 'bg-orange-400 text-white'; icon = '✗' }
              else { cls = 'bg-[#2a2a2a] text-white/40' }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                className={`w-full ${cls} rounded-full py-4 px-6 text-lg font-semibold flex items-center gap-3 transition-all text-left active:scale-[0.98] disabled:cursor-default`}>
                {icon
                  ? <span className="font-black text-xl shrink-0 w-6 text-center">{icon}</span>
                  : <span className="w-6 shrink-0" />}
                <span>{opt}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#111] pb-28">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div className="flex items-center gap-1 bg-[#2a1e00] rounded-xl px-3 py-2">
          <span className="text-[#c9a84c] font-black text-xl">{now.getDate()}</span>
          <span className="text-[#c9a84c] font-medium text-sm">{PT_MONTHS_SHORT[now.getMonth()]}.</span>
        </div>
        <button className="bg-[#2a1e00] rounded-xl p-2.5"><Trophy size={22} className="text-[#c9a84c]" /></button>
      </div>

      <div className="mx-4 mb-6">
        <div className="relative rounded-2xl border-2 border-[#c9a84c]/50 bg-[#1a1200] overflow-hidden" style={{ minHeight: 280 }}>
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-[#c9a84c]/40 rounded-tl" />
          <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-[#c9a84c]/40 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-[#c9a84c]/40 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-[#c9a84c]/40 rounded-br" />
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {[0,1,2,3].map(i => (
              <div key={i} className={`border border-[#c9a84c]/20 flex items-center justify-center ${i < piecesUnlocked ? 'opacity-0' : ''}`}>
                {i >= piecesUnlocked && <div className="bg-[#c9a84c]/15 rounded-xl p-2"><span className="text-[#c9a84c] text-2xl">🔒</span></div>}
              </div>
            ))}
          </div>
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

      <div className="px-4 mb-6 text-center">
        <h2 className="text-white font-bold text-xl mb-1">Quebra-cabeça diário</h2>
        <p className="text-parchment/50 text-sm">
          {piecesUnlocked >= 4
            ? 'Parabéns! Você completou o quebra-cabeça desta semana.'
            : `${piecesUnlocked}/4 peças desbloqueadas — faça o quiz para ganhar mais!`}
        </p>
        <div className="mt-3 mx-8 bg-[#2a2a2a] rounded-full h-2">
          <div className="bg-[#c9a84c] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(piecesUnlocked / 4) * 100}%` }} />
        </div>
      </div>

      {phase === 'puzzle' && (
        <div className="px-4">
          <button onClick={() => setPhase('quiz')}
            className="w-full py-4 rounded-full font-bold text-base text-[#111] transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(90deg, #c9a84c, #e8c870)' }}>
            Começar Quiz
          </button>
          <p className="text-center text-parchment/40 text-xs mt-3">5 perguntas bíblicas</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="px-4 text-center">
          <div className="bg-[#1a1a1a] rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 flex items-center justify-center mx-auto mb-4">
              <Trophy size={30} className="text-[#c9a84c]" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Quiz concluído!</h3>
            <p className="text-parchment/60 text-sm mb-4">Você acertou {correct} de {todayQuestions.length} perguntas</p>
            <div className="flex justify-center gap-1 mb-4">
              {answers.map((a, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${a ? 'bg-[#4ade80]/20' : 'bg-red-500/20'}`}>
                  {a ? <CheckCircle size={16} className="text-[#4ade80]" /> : <XCircle size={16} className="text-red-400" />}
                </div>
              ))}
            </div>
            <p className="text-[#c9a84c] text-sm">{piecesUnlocked}/4 peças desbloqueadas</p>
            {piecesUnlocked < 4 && <p className="text-parchment/40 text-xs mt-2">Quiz renova automaticamente à meia-noite.</p>}
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}
