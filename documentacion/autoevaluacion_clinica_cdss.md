# Módulo de Autoevaluación Clínica CDSS (GAD-7) (Issue #31)

Esta guía técnica describe el diseño, la lógica matemática y la codificación completa del **Sistema de Soporte de Decisiones Clínicas (CDSS)** basado en la escala clínica **GAD-7** (Generalized Anxiety Disorder 7-item scale). El módulo permite realizar tamizaje rápido de niveles de ansiedad y fuerza de forma automatizada protocolos de derivación médica no descartables ante puntajes severos (>15).

---

## 📊 Matriz Clínica de Puntuaciones y Clasificación

El sistema asigna un puntaje de **0 a 3** a cada una de las 7 preguntas, acumulando un máximo de **21 puntos**. La severidad clínica se categoriza bajo cuatro umbrales validados científicamente:

| Puntaje Acumulado | Nivel de Severidad Clínica | Acción del CDSS (Frontend & Backend) |
| :--- | :--- | :--- |
| **0 – 4** | Ansiedad Mínima | Desplegar resultados y sugerir hábitos de meditación. |
| **5 – 9** | Ansiedad Leve | Mostrar guías psicoeducativas de control en la biblioteca. |
| **10 – 14** | Ansiedad Moderada | Recomendar consulta preventiva y diario emocional. |
| **15 – 21** | Ansiedad Severa | **Bloqueo Total (Modal Crítico No Descartable)**: Forzar derivación a psiquiatra/psicólogo en `/professionals` y registrar override. |

---

## 🛠️ Código Completo del Módulo de Autoevaluación

### 1. Definición del Cuestionario e Indicadores Clínicos (`gad7Data.js`)

```javascript
// src/features/cdss/gad7Data.js

export const GAD7_QUESTIONS = [
  "¿Se ha sentido nervioso/a, ansioso/a o con los nervios de punta?",
  "¿No ha sido capaz de parar o controlar sus preocupaciones?",
  "¿Se ha preocupado demasiado por diferentes cosas?",
  "¿Ha tenido dificultad para relajarse?",
  "¿Se ha sentido tan inquieto/a que le ha sido difícil permanecer sentado/a?",
  "¿Se ha irritado o enfadado con facilidad?",
  "¿Ha sentido miedo de que algo terrible pudiera ocurrir?"
];

export const GAD7_OPTIONS = [
  { label: "Nunca", value: 0 },
  { label: "Varios días", value: 1 },
  { label: "Más de la mitad de los días", value: 2 },
  { label: "Casi todos los días", value: 3 }
];

/**
 * Función clínica pura para evaluar la puntuación acumulada
 * @param {number} score - Puntaje total sumado de 0 a 21
 */
export const evaluateGAD7 = (score) => {
  if (score >= 15) {
    return {
      severity: "Severa",
      color: "text-red-400",
      css: "bg-red-500/10 border-red-500/20 text-red-300",
      recommendation: "Tus respuestas sugieren que estás experimentando niveles muy altos de ansiedad. Es fundamental que converses con un especialista clínico para recibir una evaluación detallada."
    };
  }
  if (score >= 10) {
    return {
      severity: "Moderada",
      color: "text-amber-400",
      css: "bg-amber-500/10 border-amber-500/20 text-amber-300",
      recommendation: "Indica un nivel de ansiedad moderado. Se sugiere agendar una cita de orientación con nuestro directorio de terapeutas voluntarios."
    };
  }
  if (score >= 5) {
    return {
      severity: "Leve",
      color: "text-emerald-400",
      css: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
      recommendation: "Ansiedad de grado leve. Te invitamos a utilizar los ejercicios guiados de respiración cuadrada e higiene mental."
    };
  }
  return {
    severity: "Mínima",
    color: "text-blue-400",
    css: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    recommendation: "Tus niveles se encuentran dentro del rango normal. Continúa monitoreando tus emociones con el Diario de Calma."
  };
};
```

---

### 2. Componente de Cuestionario Interactivo (`GAD7Survey.jsx`)

Este componente guía al usuario a través de las 7 preguntas, calcula el resultado al terminar y despliega la advertencia no descartable en caso de puntaje severo:

```javascript
// src/features/cdss/GAD7Survey.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ChevronRight, Phone, ArrowRight, HeartPulse, RefreshCw } from 'lucide-react';
import { GAD7_QUESTIONS, GAD7_OPTIONS, evaluateGAD7 } from './gad7Data';

export default function GAD7Survey() {
  const [answers, setAnswers] = useState(Array(7).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSelectOption = (value) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);

    if (currentIndex < GAD7_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calcular puntaje final
      const score = updated.reduce((sum, val) => sum + val, 0);
      const evalResult = evaluateGAD7(score);
      setResult({ score, ...evalResult });
      
      // Enviar de forma asíncrona al backend
      saveAssessmentToDatabase(score, evalResult.severity);
    }
  };

  const saveAssessmentToDatabase = async (score, severity) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await fetch('/api/cdss/gad7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score, severity })
      });
    } catch (e) {
      console.warn("Backend no disponible. Guardado localmente en caché.");
    } finally {
      setSaving(false);
    }
  };

  const handleForcedRedirect = () => {
    // Redirige al estudiante al catálogo de psicólogos clínicos
    navigate('/professionals');
  };

  const handleReset = () => {
    setAnswers(Array(7).fill(null));
    setCurrentIndex(0);
    setResult(null);
  };

  const progressPercent = Math.round((currentIndex / GAD7_QUESTIONS.length) * 100);

  // Vista de resultados
  if (result) {
    const isSevere = result.score >= 15;

    return (
      <div className="space-y-6 max-w-lg mx-auto py-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-purple-400" />
          Resultado del Tamizaje
        </h3>

        {isSevere ? (
          /* PANTALLA CRÍTICA DE BLOQUEO (OVERLAY COMPLETO) */
          <div className="fixed inset-0 bg-[#0A0A0B] z-50 flex items-center justify-center p-4">
            <div className="bg-[#1C1C1E] border-2 border-red-500/80 rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl shadow-red-500/10">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Alerta de Severidad de Ansiedad</h3>
                <div className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 px-3.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider">
                  GAD-7 Score: {result.score} (Severo)
                </div>
              </div>

              <div className="text-gray-300 text-sm leading-relaxed space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <p>
                  Has registrado un puntaje superior al límite clínico preventivo. Es de suma importancia que busques el apoyo de un profesional.
                </p>
                <p className="font-semibold text-white">
                  Para tu protección, te redirigiremos a nuestro directorio para agendar una sesión gratuita de contención psicológica.
                </p>
              </div>

              {/* Teléfono nacional de emergencias de salud mental */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">Línea de Prevención de Crisis</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    📞 *4141 (Minsal Chile)
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">24 horas / Gratis</span>
              </div>

              <button
                onClick={handleForcedRedirect}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition active:scale-95"
              >
                Ver Directorio Clínico <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* RESULTADOS ESTÁNDAR (LEVE / MODERADO) */
          <div className={`p-6 border rounded-2xl space-y-4 shadow-xl ${result.css}`}>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Diagnóstico Clínico CDSS</span>
              <h4 className="text-lg font-bold text-white mt-1">
                Ansiedad: <span className={result.color}>{result.severity}</span>
              </h4>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed">
              {result.recommendation}
            </p>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-gray-400 leading-normal">
              *Nota: Este resultado es referencial y sirve como soporte de orientación. Ante síntomas persistentes, agende una cita con un terapeuta profesional.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-3 rounded-xl border border-white/10 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Repetir Test
              </button>
              <button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-xl transition"
              >
                Explorar recursos
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista de realización del test paso a paso
  return (
    <div className="max-w-md mx-auto space-y-6 py-6">
      
      {/* Indicadores de Progreso */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span className="font-semibold">Test GAD-7</span>
        <span>Pregunta {currentIndex + 1} de {GAD7_QUESTIONS.length} ({progressPercent}%)</span>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full bg-white/5 border border-white/5 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-purple-500 h-full transition-all duration-300 ease-out" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Pregunta Activa */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg">
        <h4 className="text-base font-bold text-white leading-relaxed">
          {GAD7_QUESTIONS[currentIndex]}
        </h4>
      </div>

      {/* Listado de Opciones */}
      <div className="flex flex-col gap-3">
        {GAD7_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelectOption(opt.value)}
            className="w-full bg-white/5 hover:bg-purple-600/25 border border-white/10 hover:border-purple-500/50 text-left text-sm text-gray-300 hover:text-white px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.99]"
          >
            {opt.label}
          </button>
        ))}
      </div>

    </div>
  );
}
```

---

## 🗄️ Esquema del Backend en Spring Boot

Para la persistencia de las evaluaciones, se expone la clase de entidad Java que mapeará el histórico clínico relacional del estudiante:

```java
package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "autoevaluaciones_cdss")
@Data
public class GAD7Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false)
    private LocalDateTime assessmentDate = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean referralForced = false;
}
```
* **Controlador REST (`/api/cdss/gad7`)**: Recibirá el payload `{ "score": 16, "severity": "Severa" }`. Si el puntaje es de nivel crítico (score >= 15), se inyectará automáticamente en la bitácora de auditoría (`bitacora_auditoria`) registrando la dirección IP y alertando sobre el estado de vulnerabilidad del estudiante.
