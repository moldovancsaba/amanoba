/**
 * Generate Additional Spanish Quiz Questions
 * 
 * Adds 6+ high-quality Spanish quiz questions to meet minimum requirements
 * for AI_DUMMIES_1DAY_EN_ES course.
 */

import connectDB from '../app/lib/mongodb';
import { Course, QuizQuestion } from '../app/lib/models';

const additionalSpanishQuizzes = [
  {
    question: 'Un amigo te pregunta: "¿Qué es la IA?" ¿Cuál explicación es más clara para alguien sin conocimientos técnicos?',
    correctAnswer: 'La IA es tecnología que puede hacer tareas que normalmente requieren inteligencia humana, como entender el lenguaje o reconocer rostros.',
    wrongAnswers: [
      'La IA es una red neuronal compleja que procesa datos a través de múltiples capas de algoritmos.',
      'La IA es inteligencia artificial que utiliza modelos de aprendizaje automático y aprendizaje profundo.',
      'La IA es código de software que se ejecuta en servidores usando cálculos matemáticos avanzados.'
    ],
    explanation: 'La respuesta correcta usa lenguaje simple y cotidiano con ejemplos concretos (entender lenguaje, reconocer rostros) que cualquiera puede relacionar, sin jerga técnica.',
    difficulty: 'EASY',
    category: 'Course Specific'
  },
  {
    question: 'Intentaste pedirle a la IA que te ayude a planificar tu semana, pero la respuesta fue genérica y poco útil. ¿Qué deberías hacer DESPUÉS?',
    correctAnswer: 'Darle a la IA más detalles específicos: tus objetivos, limitaciones de tiempo, prioridades y qué tipo de ayuda necesitas. Trátala como si le dieras instrucciones a un asistente.',
    wrongAnswers: [
      'Rendirte - la IA probablemente no puede ayudar con tareas de planificación personal como esta.',
      'Intentar exactamente la misma indicación otra vez y esperar una mejor respuesta.',
      'Quejarte al soporte técnico de que la IA no está funcionando correctamente.'
    ],
    explanation: 'La calidad de la salida de la IA depende en gran medida de la calidad de la entrada. Agregar contexto específico (objetivos, restricciones, prioridades) obtendrá mejores resultados. Así es como aprendes a usar la IA efectivamente.',
    difficulty: 'MEDIUM',
    category: 'Course Specific'
  },
  {
    question: 'Quieres usar la IA para ayudarte a escribir un correo electrónico a tu jefe solicitando un día libre. ¿Cuál es la MEJOR indicación para obtener un resultado útil?',
    correctAnswer: 'Escribe un correo amigable y profesional a mi jefe pidiendo el viernes libre porque tengo un evento familiar. Manténlo breve y cortés.',
    wrongAnswers: [
      'Escribe un correo sobre tiempo libre.',
      'Ayúdame con un correo.',
      'Genera una comunicación empresarial formal sobre una solicitud de ausencia utilizando terminología corporativa apropiada.'
    ],
    explanation: 'La mejor indicación es específica (viernes libre, evento familiar), incluye orientación de tono (amigable, profesional, breve) y da contexto claro. Las indicaciones vagas obtienen resultados vagos.',
    difficulty: 'MEDIUM',
    category: 'Course Specific'
  },
  {
    question: 'Un principiante pregunta: "¿Cómo aprende realmente la IA?" ¿Cuál explicación es más precisa Y comprensible?',
    correctAnswer: 'La IA aprende mirando millones de ejemplos, encontrando patrones y ajustándose para mejorar - similar a cómo aprendiste a reconocer las caras de tus amigos al verlos muchas veces.',
    wrongAnswers: [
      'La IA usa retropropagación a través de capas ocultas de perceptrones para minimizar la función de pérdida.',
      'La IA lee libros y estudia como lo hacen los humanos, memorizando hechos y reglas.',
      'La IA está programada con todas las respuestas por desarrolladores que escriben instrucciones explícitas para cada situación.'
    ],
    explanation: 'Esta explicación usa una analogía relacionable (reconocer caras) y lenguaje simple mientras es técnicamente precisa sobre el reconocimiento de patrones y el aprendizaje de ejemplos.',
    difficulty: 'EASY',
    category: 'Course Specific'
  },
  {
    question: 'Tu compañero de trabajo dice: "La IA me robará el trabajo y me reemplazará." ¿Qué respuesta muestra la comprensión más equilibrada de la IA?',
    correctAnswer: 'La IA es una herramienta que cambiará cómo trabajamos. Las personas que aprendan a usar la IA efectivamente serán más valiosas, no reemplazadas. Es mejor aprender ahora que evitarla.',
    wrongAnswers: [
      'Tienes razón en preocuparte - la IA definitivamente reemplazará la mayoría de los trabajos en los próximos años.',
      'La IA es completamente inofensiva y nunca afectará el trabajo de nadie, así que no hay nada de qué preocuparse.',
      'La IA es demasiado complicada para que la mayoría de las personas la entiendan, así que solo los expertos en tecnología se beneficiarán de ella.'
    ],
    explanation: 'La respuesta correcta reconoce el cambio real mientras enfatiza la IA como una herramienta que mejora el trabajo humano. Fomenta la adaptación en lugar del miedo o la complacencia.',
    difficulty: 'MEDIUM',
    category: 'Course Specific'
  },
  {
    question: 'Estás usando una herramienta de IA para resumir un artículo largo. El resumen incluye información incorrecta. ¿Qué aprendizaje clave demuestra esto?',
    correctAnswer: 'La IA puede cometer errores y "alucinar" (inventar información). Siempre debes verificar la información importante, especialmente en decisiones críticas.',
    wrongAnswers: [
      'La herramienta de IA está rota y nunca debe usarse para resumir.',
      'Los resúmenes de IA son siempre 100% precisos si usas la herramienta correcta.',
      'Esto significa que la IA aún no es lo suficientemente avanzada para ningún uso práctico.'
    ],
    explanation: 'Este es un concepto crítico: la IA puede generar información incorrecta con confianza (alucinaciones). Los usuarios deben verificar la información importante. La IA es una herramienta poderosa pero no infalible.',
    difficulty: 'MEDIUM',
    category: 'Course Specific'
  },
  {
    question: 'Un gerente pregunta: "¿Debería usar IA para todas las tareas de mi equipo?" ¿Cuál es el enfoque más sabio?',
    correctAnswer: 'Comienza con tareas repetitivas y que consumen tiempo (resúmenes, borradores, ideas). Evalúa los resultados. Amplía gradualmente. Mantén la supervisión humana para decisiones importantes.',
    wrongAnswers: [
      'Sí, reemplaza todas las tareas con IA inmediatamente para maximizar la eficiencia.',
      'No, evita la IA completamente - es arriesgado y puede causar problemas.',
      'Usa IA solo para tareas técnicas de codificación, no para trabajo de negocios.'
    ],
    explanation: 'El enfoque sabio es pragmático: comienza pequeño con tareas de bajo riesgo, aprende qué funciona bien, luego escala mientras mantienes el juicio humano para decisiones críticas. Esto gestiona el riesgo mientras captura el valor.',
    difficulty: 'HARD',
    category: 'Course Specific'
  }
];

(async () => {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN_ES' });
  
  if (!course) {
    console.error('❌ Spanish course not found: AI_DUMMIES_1DAY_EN_ES');
    process.exit(1);
  }
  
  console.log('📝 ADDING SPANISH QUIZ QUESTIONS');
  console.log('=================================\n');
  console.log(`Course: ${course.name}`);
  console.log(`Language: ${course.language}`);
  console.log(`Questions to add: ${additionalSpanishQuizzes.length}`);
  console.log('');
  
  let added = 0;
  
  for (const quiz of additionalSpanishQuizzes) {
    try {
      await QuizQuestion.create({
        uuid: `${course.courseId}_QUIZ_${Math.random().toString(36).substr(2, 9)}`,
        courseId: course._id,
        question: quiz.question,
        correctAnswer: quiz.correctAnswer,
        wrongAnswers: quiz.wrongAnswers,
        explanation: quiz.explanation,
        difficulty: quiz.difficulty,
        category: quiz.category,
        questionType: 'application',
        hashtags: [],
        isCourseSpecific: true,
        isActive: true,
        showCount: 0,
        correctCount: 0,
      });
      
      added++;
      console.log(`✓ Added: ${quiz.question.substring(0, 60)}...`);
    } catch (error) {
      console.error(`✗ Failed: ${quiz.question.substring(0, 60)}...`);
      console.error(`  Error: ${error}`);
    }
  }
  
  // Verify new count
  const totalQuizzes = await QuizQuestion.countDocuments({ courseId: course._id });
  const lessonQuizCount = course.lessonQuizPolicy?.questionCount || 3;
  const minRequired = lessonQuizCount + 10;
  
  console.log('');
  console.log('='.repeat(50));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(50));
  console.log(`Questions Added: ${added}`);
  console.log(`Total Questions: ${totalQuizzes}`);
  console.log(`Minimum Required: ${minRequired} (${lessonQuizCount} lesson + 10 exam)`);
  
  if (totalQuizzes >= minRequired) {
    console.log(`\n✅ SUCCESS: Course now has sufficient quiz questions!`);
  } else {
    const shortage = minRequired - totalQuizzes;
    console.log(`\n⚠️  Still need ${shortage} more questions to meet minimum`);
  }
  
  console.log('');
  
  process.exit(0);
})();
