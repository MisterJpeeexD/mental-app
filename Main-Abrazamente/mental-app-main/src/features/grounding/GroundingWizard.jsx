import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, RotateCcw } from 'lucide-react';

const STEPS = [
  {
    title: '5 cosas que ves',
    desc: 'Mira a tu alrededor e identifica 5 objetos físicos. Escríbelos abajo para anclar tu atención visual.',
    count: 5,
    placeholders: ['1. Lo primero que ves...', '2. Un objeto lejano...', '3. Un objeto pequeño...', '4. Algo de color llamativo...', '5. Algo en tu mesa...'],
  },
  {
    title: '4 cosas que puedes tocar',
    desc: 'Siente texturas a tu alrededor. Registra 4 sensaciones táctiles físicas (ej: tu ropa, la silla, tu cabello, el frío de la mesa).',
    count: 4,
    placeholders: ['1. Textura o temperatura 1...', '2. Sensación 2...', '3. El contacto con el suelo...', '4. Otra textura...'],
  },
  {
    title: '3 cosas que escuchas',
    desc: 'Cierra los ojos y afina el oído. Identifica 3 sonidos de tu entorno (ej: un reloj, el tráfico, la brisa, el teclado).',
    count: 3,
    placeholders: ['1. Sonido cercano...', '2. Sonido constante...', '3. Un sonido lejano o sutil...'],
  },
  {
    title: '2 cosas que puedes oler',
    desc: 'Enfócate en tu respiración. Identifica 2 aromas de tu alrededor (café, perfume, aire fresco, jabón).',
    count: 2,
    placeholders: ['1. Aroma o fragancia 1...', '2. Aroma 2...'],
  },
  {
    title: '1 cosa que saboreas o afirmas',
    desc: 'Identifica un sabor en tu boca, o escribe una afirmación positiva sobre tu presente (ej: "Estoy a salvo en este momento, estoy aquí").',
    count: 1,
    placeholders: ['Tu afirmación o sabor...'],
  },
];

const respuestasVacias = () => STEPS.map((step) => Array(step.count).fill(''));

export default function GroundingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(respuestasVacias);
  const [isFinished, setIsFinished] = useState(false);

  const handleInputChange = (inputIdx, value) => {
    setAnswers((prev) => prev.map((step, idx) => (
      idx === currentStep ? step.map((ans, i) => (i === inputIdx ? value : ans)) : step
    )));
  };

  const isStepValid = () => answers[currentStep].every((ans) => ans.trim() !== '');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((step) => step + 1);
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setAnswers(respuestasVacias());
    setCurrentStep(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grounding__done"
      >
        <div className="grounding__done-icon" aria-hidden="true">
          <CheckCircle2 />
        </div>
        <h3>¡Excelente trabajo!</h3>
        <p>
          Has logrado conectar con tus sentidos y enfocar tu mente en el presente. La ansiedad
          disminuye cuando anclas tu cuerpo en el aquí y el ahora.
        </p>
        <button type="button" className="botiquin-btn botiquin-btn--primary" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Iniciar de nuevo
        </button>
      </motion.div>
    );
  }

  const stepInfo = STEPS[currentStep];

  return (
    <div className="grounding">
      <div className="grounding__head">
        <h3 className="grounding__title">{stepInfo.title}</h3>
        <span className="grounding__badge">Paso {currentStep + 1} de {STEPS.length}</span>
      </div>

      <div
        className="grounding__progress"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-label="Progreso del ejercicio"
      >
        <span style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
      </div>

      <p className="grounding__desc">{stepInfo.desc}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grounding__fields"
        >
          {answers[currentStep].map((value, idx) => (
            <input
              key={stepInfo.placeholders[idx]}
              type="text"
              className="grounding__input"
              value={value}
              onChange={(event) => handleInputChange(idx, event.target.value)}
              placeholder={stepInfo.placeholders[idx]}
              aria-label={`${stepInfo.title}: respuesta ${idx + 1}`}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="grounding__nav">
        <button
          type="button"
          className="botiquin-btn botiquin-btn--ghost"
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft aria-hidden="true" />
          Atrás
        </button>

        <button
          type="button"
          className="botiquin-btn botiquin-btn--primary"
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {currentStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
          {currentStep < STEPS.length - 1 && <ChevronRight aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
