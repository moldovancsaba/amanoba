/**
 * Translate Spanish Lesson Content
 * 
 * Replaces POC placeholder with proper Spanish translation of lesson content.
 */

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const spanishContent = `# Lección 1: Conceptos básicos de IA: ¿Qué es la IA y cómo puedes usarla?

**Resumen:** Comprende qué es la IA y descubre formas prácticas de usarla en tu vida diaria.  
**Tiempo:** 45–60 min  
**Entregable:** Lista personal de casos de uso de IA

## Objetivo de aprendizaje

Serás capaz de: **Explicar qué es la IA en términos simples e identificar 3 formas prácticas de usar herramientas de IA en tu vida diaria.**

### Criterios de éxito (observables)
- [ ] Puedes explicar la IA a un amigo sin usar jerga técnica
- [ ] Has probado al menos 2 herramientas de IA (por ejemplo, ChatGPT, asistentes de voz)
- [ ] Has creado una lista de 3+ formas en que la IA puede ayudarte personalmente

---

## ¿Qué es la IA?

**Inteligencia Artificial (IA)** es tecnología que puede hacer tareas que normalmente requieren inteligencia humana, como entender el lenguaje, reconocer rostros o tomar decisiones.

### Piénsalo así:
- **Software tradicional** es como una calculadora: le das una entrada, sigue reglas fijas y te da una salida
- **IA moderna** es como un asistente inteligente: aprende de ejemplos, se adapta y puede manejar tareas complejas como escribir correos electrónicos o resumir artículos

### Ejemplos cotidianos de IA:
- 📱 **Siri/Alexa** - Asistentes de voz que entienden el lenguaje natural
- 🎬 **Netflix/YouTube** - Recomendaciones basadas en lo que te gusta
- 📧 **Gmail** - Respuestas inteligentes y filtro de spam
- 🚗 **Google Maps** - Rutas optimizadas en tiempo real
- 💬 **ChatGPT** - Conversaciones que pueden escribir, explicar y ayudar

---

## ¿Cómo funciona la IA? (Versión simple)

Imagina enseñarle a un niño a reconocer perros:
1. **Le muestras miles de fotos** de perros (datos de entrenamiento)
2. **El niño aprende patrones** (cuatro patas, cola, pelaje, etc.)
3. **Ahora puede identificar perros** que nunca ha visto antes

La IA funciona de manera similar:
- **Datos:** Se alimenta con ejemplos (texto, imágenes, sonido)
- **Aprendizaje:** Encuentra patrones en esos datos
- **Predicción:** Usa esos patrones para hacer cosas nuevas

Esto se llama **Aprendizaje Automático** (Machine Learning) - la IA aprende de los datos en lugar de seguir reglas codificadas.

---

## Tu primer ejercicio de IA: Usa ChatGPT

**Tarea:** Ve a chat.openai.com e intenta estas indicaciones:

1. "Explícame la fotosíntesis como si tuviera 10 años"
2. "Escribe un correo electrónico profesional solicitando un día libre"
3. "Dame 5 ideas para cenas rápidas y saludables"

**Observa cómo:**
- La IA entiende el contexto
- Adapta su tono y nivel de detalle
- Puede ayudar con tareas prácticas

---

## Formas prácticas de usar la IA hoy

### 1. **Escritura y comunicación**
- Redactar correos electrónicos profesionales
- Resumir artículos largos o documentos
- Mejorar la gramática y el tono
- Generar ideas para presentaciones

### 2. **Aprendizaje e investigación**
- Obtener explicaciones simples de temas complejos
- Hacer preguntas de seguimiento como un tutor
- Aprender nuevas habilidades paso a paso
- Resumir videos o artículos

### 3. **Productividad personal**
- Planificar tu día/semana
- Crear listas de tareas con prioridades
- Generar plantillas (currículums, agendas de reuniones)
- Obtener consejos sobre resolución de problemas

### 4. **Creatividad**
- Lluvia de ideas para proyectos
- Generar esquemas de contenido
- Crear arte/imágenes con herramientas de IA
- Escribir historias o guiones

---

## Tu entregable: Lista personal de casos de uso de IA

**Crea una lista de 3-5 formas en que la IA puede ayudarte personalmente.**

Usa esta plantilla:

1. **Tarea/problema:**
   - *Ejemplo: Necesito escribir mejores correos electrónicos en el trabajo*
   - **Herramienta:** ChatGPT
   - **Cómo ayuda:** Redacta correos profesionales, revisa el tono, sugiere mejoras

2. **Tarea/problema:**
   - *[Tu caso de uso]*
   - **Herramienta:** [ChatGPT, Siri, etc.]
   - **Cómo ayuda:** [Beneficio específico]

3. **Tarea/problema:**
   - *[Tu caso de uso]*
   - **Herramienta:** [Herramienta]
   - **Cómo ayuda:** [Beneficio]

---

## Conceptos clave para recordar

✅ **La IA es tecnología que puede hacer tareas que requieren inteligencia humana**  
✅ **La IA moderna aprende de los datos (Aprendizaje Automático)**  
✅ **Herramientas como ChatGPT pueden ayudar con escritura, aprendizaje y productividad**  
✅ **No necesitas ser técnico para usar la IA de manera efectiva**  

---

## Próximos pasos

- ✅ Completa tu Lista personal de casos de uso de IA
- ✅ Prueba al menos 2 herramientas de IA esta semana
- ✅ Practica explicar la IA a alguien sin usar jerga técnica

**¡Bien hecho!** Has completado la Lección 1. Ahora entiendes qué es la IA y cómo usarla en tu vida diaria.

---

## Recursos adicionales (opcional)

- ChatGPT - Asistente conversacional
- Google Gemini - Herramienta de Google
- Claude - Asistente enfocado en la seguridad

**Consejo profesional:** La mejor manera de aprender sobre IA es usándola. Empieza con pequeñas tareas y experimenta.
`;

(async () => {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN_ES' });
  
  if (!course) {
    console.error('Spanish course not found!');
    process.exit(1);
  }
  
  await Lesson.updateOne(
    { courseId: course._id },
    { 
      $set: { 
        content: spanishContent,
        emailBody: spanishContent
      }
    }
  );
  
  console.log('✅ Lesson content translated to proper Spanish!');
  console.log('');
  console.log('Content preview (first 500 chars):');
  console.log(spanishContent.substring(0, 500));
  console.log('...');
  console.log('');
  console.log('Full lesson is now in Spanish with:');
  console.log('  - Spanish headings and structure');
  console.log('  - Spanish explanations and examples');
  console.log('  - Spanish exercises and deliverables');
  console.log('  - Spanish key concepts and next steps');
  
  process.exit(0);
})();
