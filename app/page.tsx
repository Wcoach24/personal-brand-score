'use client'

import { useState, useEffect, useCallback } from 'react'

interface Question {
  id: number
  category: string
  question: string
  options: { text: string; score: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    category: 'Visibility',
    question: 'How often do you post content on LinkedIn or X?',
    options: [
      { text: 'Never or almost never', score: 0 },
      { text: 'A few times a month', score: 1 },
      { text: '2-3 times a week', score: 2 },
      { text: 'Daily or more', score: 3 },
    ],
  },
  {
    id: 2,
    category: 'Visibility',
    question: 'When someone Googles your name, what do they find?',
    options: [
      { text: 'Nothing relevant', score: 0 },
      { text: 'My LinkedIn shows up', score: 1 },
      { text: 'A few articles or mentions', score: 2 },
      { text: 'A strong digital presence (site, articles, interviews)', score: 3 },
    ],
  },
  {
    id: 3,
    category: 'Authority',
    question: 'Have you been invited to speak, write, or be interviewed as an expert?',
    options: [
      { text: 'Never', score: 0 },
      { text: 'Once or twice', score: 1 },
      { text: 'Several times', score: 2 },
      { text: 'Regularly \u2014 I\'m a go-to voice in my niche', score: 3 },
    ],
  },
  {
    id: 4,
    category: 'Authority',
    question: 'Do you have a clear niche or topic you\'re known for?',
    options: [
      { text: 'Not really \u2014 I post about many things', score: 0 },
      { text: 'I have a general area but it\'s not focused', score: 1 },
      { text: 'Yes, people associate me with a specific topic', score: 2 },
      { text: 'I own a niche \u2014 when people think of X, they think of me', score: 3 },
    ],
  },
  {
    id: 5,
    category: 'Network',
    question: 'How strong is your professional network?',
    options: [
      { text: 'I barely know people in my industry', score: 0 },
      { text: 'I have some connections but rarely engage', score: 1 },
      { text: 'I actively network and get introductions', score: 2 },
      { text: 'My network opens doors \u2014 people refer me regularly', score: 3 },
    ],
  },
  {
    id: 6,
    category: 'Network',
    question: 'When you share something online, what kind of engagement do you get?',
    options: [
      { text: 'Crickets \u2014 almost no interaction', score: 0 },
      { text: 'A few likes from connections', score: 1 },
      { text: 'Consistent comments and shares', score: 2 },
      { text: 'High engagement \u2014 people DM me, share, and tag others', score: 3 },
    ],
  },
  {
    id: 7,
    category: 'Monetization',
    question: 'Do people reach out to YOU for opportunities (jobs, collabs, clients)?',
    options: [
      { text: 'Never \u2014 I\'m always chasing opportunities', score: 0 },
      { text: 'Occasionally someone reaches out', score: 1 },
      { text: 'Regularly \u2014 I get inbound inquiries', score: 2 },
      { text: 'Constantly \u2014 I have to turn things down', score: 3 },
    ],
  },
  {
    id: 8,
    category: 'Monetization',
    question: 'Have you monetized your personal brand (courses, consulting, speaking fees)?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'I\'ve made some money but it\'s inconsistent', score: 1 },
      { text: 'It\'s a meaningful side income', score: 2 },
      { text: 'It\'s my primary or a major income source', score: 3 },
    ],
  },
  {
    id: 9,
    category: 'Consistency',
    question: 'Is your online presence consistent across platforms (same photo, bio, messaging)?',
    options: [
      { text: 'No \u2014 different everywhere or outdated', score: 0 },
      { text: 'Somewhat consistent', score: 1 },
      { text: 'Pretty aligned across major platforms', score: 2 },
      { text: 'Perfectly consistent \u2014 it\'s a unified brand', score: 3 },
    ],
  },
  {
    id: 10,
    category: 'Consistency',
    question: 'Could you describe your personal brand in one sentence?',
    options: [
      { text: 'No \u2014 I don\'t even know what my brand is', score: 0 },
      { text: 'Vaguely, but it changes', score: 1 },
      { text: 'Yes, I have a clear positioning', score: 2 },
      { text: 'Yes, and others would describe me the same way', score: 3 },
    ],
  },
]

const categoryEmojis: Record<string, string> = {
  Visibility: '\ud83d\udc41',
  Authority: '\ud83c\udfc6',
  Network: '\ud83e\udd1d',
  Monetization: '\ud83d\udcb0',
  Consistency: '\ud83c\udfaf',
}

const loadingMessages = [
  'Analyzing your visibility signals...',
  'Measuring your authority footprint...',
  'Evaluating your network strength...',
  'Calculating monetization potential...',
  'Checking brand consistency...',
  'Generating your score...',
]

function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score <= 7) return {
    label: 'Ghost Mode',
    color: '#ef4444',
    description: 'Your personal brand is practically invisible. You\'re leaving massive opportunities on the table. The good news? You have nowhere to go but up.'
  }
  if (score <= 14) return {
    label: 'Work in Progress',
    color: '#f59e0b',
    description: 'You\'ve started building, but you\'re not yet memorable. With focused effort on 2-3 key areas, you could see dramatic improvement in 90 days.'
  }
  if (score <= 22) return {
    label: 'Rising Star',
    color: '#8b5cf6',
    description: 'You have a solid foundation. People in your circle know your name. Now it\'s time to expand beyond your immediate network and claim thought leadership.'
  }
  return {
    label: 'Brand Powerhouse',
    color: '#10b981',
    description: 'You\'ve built something rare \u2014 a personal brand that generates opportunities on autopilot. Keep compounding and help others do the same.'
  }
}

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference
  const { color } = getScoreLabel(score)

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1f1f2e" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          style={{ '--score-offset': offset } as React.CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold" style={{ color }}>{score}</span>
        <span className="text-sm text-gray-400">/ {maxScore}</span>
      </div>
    </div>
  )
}

function CategoryBreakdown({ answers }: { answers: Record<number, number> }) {
  const categories: Record<string, { total: number; max: number }> = {}

  questions.forEach((q) => {
    if (!categories[q.category]) categories[q.category] = { total: 0, max: 6 }
    categories[q.category].total += answers[q.id] || 0
  })

  return (
    <div className="space-y-3 mt-6">
      {Object.entries(categories).map(([cat, { total, max }]) => {
        const pct = (total / max) * 100
        return (
          <div key={cat} className="slide-up" style={{ animationDelay: `${Object.keys(categories).indexOf(cat) * 0.1}s` }}>
            <div className="flex justify-between text-sm mb-1">
              <span>{categoryEmojis[cat]} {cat}</span>
              <span className="text-gray-400">{total}/{max}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, #7c3aed, #db2777)`,
                  transitionDelay: '0.5s',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  const [screen, setScreen] = useState<'landing' | 'quiz' | 'loading' | 'result' | 'gated'>('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('pbs-counter') : null
    const base = 2847
    const c = stored ? parseInt(stored) : base
    setCounter(c)
  }, [])

  const incrementCounter = useCallback(() => {
    const newVal = counter + 1
    setCounter(newVal)
    if (typeof window !== 'undefined') localStorage.setItem('pbs-counter', String(newVal))
  }, [counter])

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const maxScore = questions.length * 3

  const handleAnswer = (score: number) => {
    const q = questions[currentQ]
    setAnswers(prev => ({ ...prev, [q.id]: score }))

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setScreen('loading')
      incrementCounter()
      let msgIdx = 0
      const interval = setInterval(() => {
        msgIdx++
        if (msgIdx < loadingMessages.length) {
          setLoadingMsg(msgIdx)
        } else {
          clearInterval(interval)
          setScreen('result')
        }
      }, 2000)
    }
  }

  const shareText = `I just scored ${totalScore}/${maxScore} on the Personal Brand Score \u2014 "${getScoreLabel(totalScore).label}" \ud83d\udd25\n\nHow strong is YOUR personal brand?`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setEmailSubmitted(true)
      setScreen('gated')
    }
  }

  if (screen === 'landing') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6 text-6xl">\ud83c\udfaf</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            How Strong Is Your <span className="gradient-text">Personal Brand</span>?
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            10 questions. 60 seconds. Get your score.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {counter.toLocaleString()}+ professionals already scored
          </p>
          <button
            onClick={() => setScreen('quiz')}
            className="w-full py-4 px-8 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 transition-all pulse-glow"
          >
            Get My Score \u2192
          </button>
          <p className="text-gray-600 text-xs mt-4">
            Free \u00b7 No signup required \u00b7 Takes 60 seconds
          </p>
        </div>
      </main>
    )
  }

  if (screen === 'quiz') {
    const q = questions[currentQ]
    const progress = ((currentQ) / questions.length) * 100
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{categoryEmojis[q.category]} {q.category}</span>
              <span>{currentQ + 1} / {questions.length}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="gradient-border p-6 mb-6 fade-in" key={q.id}>
            <h2 className="text-xl font-semibold mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt.score)} className="w-full text-left p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700 hover:border-purple-500/50 transition-all duration-200 text-sm md:text-base">
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'loading') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
          <p className="text-lg text-gray-300 fade-in" key={loadingMsg}>{loadingMessages[loadingMsg]}</p>
          <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-[2000ms]" style={{ width: `${((loadingMsg + 1) / loadingMessages.length) * 100}%` }} />
          </div>
        </div>
      </main>
    )
  }

  const scoreInfo = getScoreLabel(totalScore)

  if (screen === 'result') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          <div className="text-center mb-6 slide-up">
            <ScoreRing score={totalScore} maxScore={maxScore} />
            <h2 className="text-2xl font-bold mt-4" style={{ color: scoreInfo.color }}>{scoreInfo.label}</h2>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-sm mx-auto">{scoreInfo.description}</p>
          </div>
          <div className="gradient-border p-5 mb-6">
            <h3 className="font-semibold text-sm text-gray-300 mb-2">Your Breakdown</h3>
            <CategoryBreakdown answers={answers} />
          </div>
          {!emailSubmitted && (
            <div className="gradient-border p-5 mb-6 slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-semibold mb-1">\ud83d\udd13 Unlock Your Full Brand Audit</h3>
              <p className="text-gray-400 text-sm mb-4">Get personalized action steps to improve each category \u2014 free.</p>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none text-sm" />
                <button type="submit" className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-opacity">Unlock</button>
              </form>
            </div>
          )}
          <div className="slide-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-center text-gray-500 text-xs mb-3">Share your score</p>
            <div className="flex gap-3 justify-center">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#0077b5] hover:opacity-90 text-sm font-medium transition-opacity">LinkedIn</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">X / Twitter</a>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:opacity-90 text-sm font-medium transition-opacity">WhatsApp</a>
            </div>
          </div>
          <div className="text-center mt-8">
            <button onClick={() => { setAnswers({}); setCurrentQ(0); setScreen('landing'); setEmailSubmitted(false); setEmail('') }} className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors">Retake assessment</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <ScoreRing score={totalScore} maxScore={maxScore} />
          <h2 className="text-2xl font-bold mt-4" style={{ color: scoreInfo.color }}>{scoreInfo.label}</h2>
        </div>
        <div className="gradient-border p-5 mb-6">
          <h3 className="font-semibold text-sm text-gray-300 mb-2">Your Breakdown</h3>
          <CategoryBreakdown answers={answers} />
        </div>
        <div className="gradient-border p-6 mb-6 slide-up">
          <h3 className="font-semibold mb-4 gradient-text text-lg">\u2705 Your Personalized Action Plan</h3>
          {Object.entries(
            questions.reduce((acc, q) => {
              if (!acc[q.category]) acc[q.category] = { total: 0, max: 6 }
              acc[q.category].total += answers[q.id] || 0
              return acc
            }, {} as Record<string, { total: number; max: number }>)
          )
            .sort(([, a], [, b]) => a.total - b.total)
            .map(([cat, { total, max }]) => {
              const pct = Math.round((total / max) * 100)
              let tip = ''
              if (cat === 'Visibility') tip = pct < 50 ? 'Start posting 3x/week on ONE platform. Consistency beats quality when starting.' : 'Double down on what works. Consider cross-posting to a second platform.'
              else if (cat === 'Authority') tip = pct < 50 ? 'Pick ONE topic and create 10 pieces of deep content about it. Depth beats breadth.' : 'Seek speaking gigs, podcast appearances, or guest articles to cement expertise.'
              else if (cat === 'Network') tip = pct < 50 ? 'Comment on 5 posts/day from people in your niche. Engagement builds relationships faster than connection requests.' : 'Start hosting events (virtual or IRL). Connectors become authorities.'
              else if (cat === 'Monetization') tip = pct < 50 ? 'Create a simple lead magnet (checklist, template). Start collecting emails before you have a product.' : 'Package your expertise: consulting calls, micro-courses, or paid community.'
              else tip = pct < 50 ? 'Audit all profiles TODAY. Same headshot, same tagline, same link. Takes 30 minutes.' : 'Create a brand style guide: your colors, tone of voice, key phrases.'
              return (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{categoryEmojis[cat]}</span>
                    <span className="font-medium text-sm">{cat}</span>
                    <span className="text-xs text-gray-500 ml-auto">{pct}%</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{tip}</p>
                </div>
              )
            })}
        </div>
        <div>
          <p className="text-center text-gray-500 text-xs mb-3">Share your score</p>
          <div className="flex gap-3 justify-center">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#0077b5] hover:opacity-90 text-sm font-medium transition-opacity">LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">X / Twitter</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:opacity-90 text-sm font-medium transition-opacity">WhatsApp</a>
          </div>
        </div>
        <div className="text-center mt-8">
          <button onClick={() => { setAnswers({}); setCurrentQ(0); setScreen('landing'); setEmailSubmitted(false); setEmail('') }} className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors">Retake assessment</button>
        </div>
      </div>
    </main>
  )
}
