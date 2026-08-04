import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const STAGES = [
  { text: 'Inhala profundamente', label: 'INHALA', scale: 1.45, color: '#10b981' },
  { text: 'Retén el aire', label: 'RETÉN', scale: 1.45, color: '#8b5cf6' },
  { text: 'Exhala despacio', label: 'EXHALA', scale: 1.0, color: '#3e7bfa' },
  { text: 'Mantén el vacío', label: 'RETÉN', scale: 1.0, color: '#f59e0b' },
];

export default function BreathingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setStage((prevStage) => (prevStage + 1) % STAGES.length);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setStage(0);
    setSeconds(4);
  };

  const current = STAGES[stage];

  return (
    <div className="botiquin">
      <div className="breathing-stage">
        <motion.div
          aria-hidden="true"
          className="breathing-halo"
          style={{ background: current.color }}
          animate={{
            scale: isRunning ? current.scale + 0.15 : 1,
            opacity: isRunning ? [0.22, 0.4, 0.22] : 0.16,
          }}
          transition={{ duration: isRunning ? 4 : 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.button
          type="button"
          className="breathing-orb"
          style={{ background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.22), ${current.color})` }}
          animate={{ scale: isRunning ? current.scale : 1 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          onClick={() => setIsRunning((running) => !running)}
          aria-label={isRunning ? 'Pausar la respiración guiada' : 'Iniciar la respiración guiada'}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={stage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <span className="breathing-orb__label">{current.label}</span>
              <span className="breathing-orb__count">{seconds}</span>
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="breathing-caption" role="status" aria-live="polite">
        {isRunning ? current.text : 'Técnica de Respiración Cuadrada (4-4-4-4)'}
      </p>

      <div className="botiquin-actions">
        <button
          type="button"
          className="botiquin-btn botiquin-btn--primary"
          onClick={() => setIsRunning((running) => !running)}
        >
          {isRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" className="fill-current" />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>

        <button type="button" className="botiquin-btn botiquin-btn--ghost" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Reiniciar
        </button>
      </div>
    </div>
  );
}
