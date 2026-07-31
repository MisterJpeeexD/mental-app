import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

const STAGES = [
  { text: 'Inhala profundamente', css: 'bg-emerald-500 shadow-emerald-500/50', label: 'INHALA', scale: 1.7, color: 'text-emerald-400' },
  { text: 'Retén el aire', css: 'bg-violet-500 shadow-violet-500/50', label: 'RETÉN', scale: 1.7, color: 'text-violet-400' },
  { text: 'Exhala despacio', css: 'bg-blue-500 shadow-blue-500/50', label: 'EXHALA', scale: 1.0, color: 'text-blue-400' },
  { text: 'Mantén el vacío', css: 'bg-amber-500 shadow-amber-500/50', label: 'RETÉN', scale: 1.0, color: 'text-amber-400' }
];

export default function BreathingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [seconds, setSeconds] = useState(4); // 4 seconds count down
  
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setStage((prevStage) => (prevStage + 1) % 4);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setStage(0);
    setSeconds(4);
  };

  const currentStageInfo = STAGES[stage];

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-72 h-72 flex items-center justify-center mb-8">
        {/* Breathing ambient ring */}
        <motion.div
          animate={{
            scale: isRunning ? currentStageInfo.scale + 0.15 : 1.0,
            opacity: isRunning ? [0.2, 0.4, 0.2] : 0.15,
          }}
          transition={{
            duration: isRunning ? 4 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute w-56 h-56 rounded-full blur-2xl filter transition-colors duration-1000 ${
            stage === 0 ? 'bg-emerald-500/30' :
            stage === 1 ? 'bg-violet-500/30' :
            stage === 2 ? 'bg-blue-500/30' : 'bg-amber-500/30'
          }`}
        />

        {/* Main Breathing Orb */}
        <motion.div
          animate={{
            scale: isRunning ? currentStageInfo.scale : 1.0,
          }}
          transition={{
            duration: 4,
            ease: "easeInOut"
          }}
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl cursor-pointer select-none transition-all duration-1000 border border-white/20 bg-radial from-white/10 to-black/40 ${currentStageInfo.css}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center"
            >
              <div className="text-2xl tracking-wider font-extrabold">{currentStageInfo.label}</div>
              <div className="text-3xl mt-1">{seconds}</div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <p className="text-xl font-medium text-gray-200 text-center min-h-[30px] mb-8">
        {isRunning ? currentStageInfo.text : 'Técnica de Respiración Cuadrada (4-4-4-4)'}
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 height-5" /> Pausar
            </>
          ) : (
            <>
              <Play className="w-5 height-5 fill-current" /> Iniciar
            </>
          )}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold border border-white/10 transition-all active:scale-95"
        >
          <RotateCcw className="w-5 height-5" /> Reiniciar
        </button>
      </div>
    </div>
  );
}
