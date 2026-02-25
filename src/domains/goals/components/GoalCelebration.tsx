import React, { useEffect, useState } from 'react'

interface GoalCelebrationProps {
  show: boolean
  goalTitle: string
  onClose: () => void
}

const GoalCelebration: React.FC<GoalCelebrationProps> = ({ show, goalTitle, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState<any[]>([])

  useEffect(() => {
    if (show) {
      setVisible(true)
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speed: Math.random() * 3 + 1,
        delay: Math.random() * 2
      }))
      setConfetti(particles)

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => {
          onClose()
        }, 300)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [show, onClose])

  if (!show || !visible) {
    return null
  }

  return (
    <div className="goal-celebration-overlay">
      <div className="goal-celebration-content">
        <h2>Congratulations!</h2>
        <p>You've completed your goal:</p>
        <h3>{goalTitle}</h3>
        <div className="celebration-animation">
          {confetti.map(particle => (
            <div
              key={particle.id}
              className="confetti-piece"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg)`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  )
}

export default GoalCelebration