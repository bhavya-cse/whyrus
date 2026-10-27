import { useEffect, useState } from 'react'
import './HeroWordAnimation.css'

const words = [
  'Detect.',
  'Investigate.',
  'Understand.',
  'Restore.',
]

export default function HeroWordAnimation() {
  const [activeWord, setActiveWord] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveWord((current) => (current + 1) % words.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="whyrus-word-animation">
      <div className="word-animation-eyebrow">
        <span className="word-live-dot" />
        INCIDENT INTELLIGENCE
      </div>

      <div className="word-animation-stage" aria-live="polite">
        {words.map((word, index) => (
          <div
            key={word}
            className={`animated-word ${
              index === activeWord ? 'is-active' : ''
            }`}
            aria-hidden={index !== activeWord}
          >
            {word}
          </div>
        ))}
      </div>

      <p className="word-animation-caption">
        From scattered signals to evidence-led answers.
      </p>

      <div className="word-animation-progress" aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={word}
            className={index === activeWord ? 'is-active' : ''}
          />
        ))}
      </div>
    </div>
  )
}
