import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, RotateCcw } from 'lucide-react';

const STEPS = [
  {
    title: '5 cosas que ves',
    desc: 'Mira a tu alrededor e identifica 5 objetos físicos. Escríbelos abajo para anclar tu atención visual.',
    count: 5,
    placeholders: ['1. Lo primero que ves...', '2. Un objeto lejano...', '3. Un objeto pequeño...', '4. Algo de color llamativo...', '5. Algo en tu mesa...']
  },
  {
    title: '4 cosas que puedes tocar',
    desc: 'Siente texturas a tu alrededor. Registra 4 sensaciones táctiles físicas (ej: tu ropa, la silla, tu cabello, el frío de la mesa).',
    count: 4,
    placeholders: ['1. Textura o temperatura 1...', '2. Sensación 2...', '3. El contacto con el suelo...', '4. Otra textura...']
  },
  {
    title: '3 cosas que escuchas',
    desc: 'Cierra los ojos y afina el oído. Identifica 3 sonidos de tu entorno (ej: un reloj, el tráfico, la brisa, el teclado).',
    count: 3,
    placeholders: ['1. Sonido cercano...', '2. Sonido constante...', '3. Un sonido lejano o sutil...']
  },
  {
    title: '2 cosas que puedes oler',
    desc: 'Enfócate en tu respiración. Identifica 2 aromas olores de tu alrededor (café, perfume, aire fresco, jabón).',
    count: 2,
    placeholders: ['1. Aroma o fragancia 1...', '2. Aroma 2...']
  },
  {
    title: '1 cosa que saboreas o afirmas',
    desc: 'Identifica un sabor en tu boca, o escribe una afirmación positiva sobre tu presente (ej: "Estoy a salvo en este momento, estoy aquí").',
    count: 1,
    placeholders: ['Tu afirmación o sabor...']
  }
];

export default function GroundingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(Array(5).fill([]).map((_, i) => Array(STEPS[i].count).fill('')));
  const [isFinished, setIsFinished] = useState(false);

  const handleInputChange = (stepIdx, inputIdx, val) => {
    const updated = [...answers];
    updated[stepIdx] = [...updated[stepIdx]];
    updated[stepIdx][inputIdx] = val;
    setAnswers(updated);
  };

  const isStepValid = () => {
    return answers[currentStep].every(ans => ans.trim() !== '');
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setAnswers(Array(5).fill([]).map((_, i) => Array(STEPS[i].count).fill('')));
    setCurrentStep(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">¡Excelente trabajo!</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          Has logrado conectar con tus sentidos y enfocar tu mente en el presente. La ansiedad disminuye cuando anclas tu cuerpo en el aquí y el ahora.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 mx-auto transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" /> Iniciar de nuevo
        </button>
      </motion.div>
    );
  }

  const stepInfo = STEPS[currentStep];

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-blue-400">{stepInfo.title}</h3>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/25 text-blue-300">
          Paso {currentStep + 1} de 5
        </span>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">{stepInfo.desc}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3 mb-8"
        >
          {answers[currentStep].map((value, idx) => (
            <input
              key={idx}
              type="text"
              value={value}
              onChange={(e) => handleInputChange(currentStep, idx, e.target.value)}
              placeholder={stepInfo.placeholders[idx]}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 focus:shadow-md focus:shadow-blue-500/5 transition-all text-sm"
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6 pt-4 border-t border-white/5">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Atrás
        </button>

        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-600/40 disabled:text-white/40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
        >
          {currentStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
          {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
