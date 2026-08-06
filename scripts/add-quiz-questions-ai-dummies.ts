/**
 * Add quiz questions to AI for dummies course
 * 
 * Generates 50 high-quality quiz questions about AI basics
 */

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { logger } from '../app/lib/logger';

const additionalQuestions = [
  {
    question: "What does AI stand for?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Inference"],
    correctIndex: 1,
    explanation: "AI stands for Artificial Intelligence, which refers to computer systems designed to perform tasks that typically require human intelligence.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "Which of the following is an example of narrow AI?",
    options: ["A self-aware robot", "A chess-playing computer", "Human-level AI", "General artificial intelligence"],
    correctIndex: 1,
    explanation: "Narrow AI is designed to perform specific tasks, like playing chess. Current AI systems are examples of narrow AI.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is machine learning?",
    options: ["Programming computers with explicit instructions", "A subset of AI that learns from data", "A type of computer hardware", "Manual data entry"],
    correctIndex: 1,
    explanation: "Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "Which company developed ChatGPT?",
    options: ["Google", "Microsoft", "OpenAI", "Meta"],
    correctIndex: 2,
    explanation: "ChatGPT was developed by OpenAI, an AI research company founded in 2015.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What type of AI is used in recommendation systems like Netflix and Spotify?",
    options: ["Computer Vision", "Natural Language Processing", "Machine Learning", "Robotics"],
    correctIndex: 2,
    explanation: "Recommendation systems use machine learning algorithms to analyze user behavior and suggest relevant content.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is a neural network inspired by?",
    options: ["Computer circuits", "The human brain", "Mathematical graphs", "Database structures"],
    correctIndex: 1,
    explanation: "Neural networks are inspired by the structure and function of biological neural networks in the human brain.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is natural language processing (NLP)?",
    options: ["AI that understands and generates human language", "A programming language", "Network security protocol", "Data compression technique"],
    correctIndex: 0,
    explanation: "NLP is a branch of AI that helps computers understand, interpret, and generate human language.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "Which of these is NOT a common application of AI?",
    options: ["Virtual assistants", "Facial recognition", "Manual typing", "Autonomous vehicles"],
    correctIndex: 2,
    explanation: "Manual typing is a human task and not an application of AI. The other options are all common AI applications.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is deep learning?",
    options: ["Learning underwater", "A subset of machine learning using neural networks", "A database query language", "A type of computer memory"],
    correctIndex: 1,
    explanation: "Deep learning is a subset of machine learning that uses multi-layered neural networks to process data.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What does 'training' mean in AI?",
    options: ["Teaching humans to use AI", "Feeding data to an AI system to help it learn", "Installing AI software", "Debugging code"],
    correctIndex: 1,
    explanation: "Training in AI refers to the process of feeding data to a model so it can learn patterns and make predictions.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is computer vision?",
    options: ["AI that enables computers to understand visual information", "A type of computer screen", "Video editing software", "Network monitoring tool"],
    correctIndex: 0,
    explanation: "Computer vision is a field of AI that trains computers to interpret and understand visual information from images and videos.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "Which AI technique is used for image recognition?",
    options: ["Text analysis", "Convolutional Neural Networks", "Database queries", "Spreadsheet formulas"],
    correctIndex: 1,
    explanation: "Convolutional Neural Networks (CNNs) are specifically designed for processing visual data and are widely used in image recognition.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is the Turing Test?",
    options: ["A programming certification", "A test to determine if a machine can exhibit intelligent behavior indistinguishable from a human", "A computer hardware benchmark", "An internet speed test"],
    correctIndex: 1,
    explanation: "The Turing Test, proposed by Alan Turing, evaluates a machine's ability to exhibit intelligent behavior equivalent to human intelligence.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is supervised learning?",
    options: ["Learning with human supervision", "AI learning from labeled data", "Unsupervised children's education", "A type of computer security"],
    correctIndex: 1,
    explanation: "Supervised learning is a machine learning approach where the model learns from labeled training data.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is unsupervised learning?",
    options: ["Learning without teachers", "AI learning from unlabeled data to find patterns", "Automatic software updates", "Random data generation"],
    correctIndex: 1,
    explanation: "Unsupervised learning is when AI finds patterns and relationships in data without predefined labels or categories.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is reinforcement learning?",
    options: ["Repeating lessons", "Learning through trial and error with rewards and penalties", "Adding more training data", "Hardware upgrades"],
    correctIndex: 1,
    explanation: "Reinforcement learning is a type of machine learning where an agent learns by interacting with its environment and receiving rewards or penalties.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is an AI algorithm?",
    options: ["A computer program", "A set of rules for solving problems", "A type of hardware", "A database"],
    correctIndex: 1,
    explanation: "An algorithm is a set of step-by-step instructions or rules that AI systems follow to solve problems or make decisions.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is data in the context of AI?",
    options: ["Computer files", "Information used to train and improve AI models", "Internet connection", "Software licenses"],
    correctIndex: 1,
    explanation: "In AI, data is the information (text, images, numbers, etc.) used to train models and enable them to make predictions or decisions.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is bias in AI?",
    options: ["A programming error", "Unfair outcomes due to skewed training data", "Computer hardware preference", "Network latency"],
    correctIndex: 1,
    explanation: "AI bias occurs when a system produces unfair or discriminatory results, often due to biased or unrepresentative training data.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is a chatbot?",
    options: ["A robot that talks", "An AI program designed to simulate conversation", "A messaging app", "A computer virus"],
    correctIndex: 1,
    explanation: "A chatbot is an AI-powered program designed to simulate human conversation through text or voice interactions.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is generative AI?",
    options: ["AI that generates electricity", "AI that creates new content like text, images, or code", "Power generation software", "Battery technology"],
    correctIndex: 1,
    explanation: "Generative AI creates new content (text, images, music, code) based on patterns learned from training data.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is a Large Language Model (LLM)?",
    options: ["A very big dictionary", "An AI model trained on vast amounts of text data", "A translation app", "A library catalog"],
    correctIndex: 1,
    explanation: "LLMs are AI models trained on massive text datasets that can understand and generate human-like text.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is GPT?",
    options: ["General Purpose Technology", "Generative Pre-trained Transformer", "Global Positioning Tool", "Graphics Processing Terminal"],
    correctIndex: 1,
    explanation: "GPT stands for Generative Pre-trained Transformer, a type of language model developed by OpenAI.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is the primary purpose of AI ethics?",
    options: ["To slow down AI development", "To ensure AI is developed and used responsibly", "To make AI more expensive", "To limit AI access"],
    correctIndex: 1,
    explanation: "AI ethics focuses on ensuring AI systems are developed and deployed in ways that are fair, transparent, and beneficial to society.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is an AI model?",
    options: ["A robot prototype", "A mathematical representation trained to perform specific tasks", "A 3D design", "A business strategy"],
    correctIndex: 1,
    explanation: "An AI model is a mathematical representation (like a neural network) that has been trained on data to perform specific tasks.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is automation in AI?",
    options: ["Self-driving cars only", "Using AI to perform tasks without human intervention", "Manual data entry", "Computer installation"],
    correctIndex: 1,
    explanation: "Automation involves using AI to perform tasks automatically without requiring constant human oversight.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is sentiment analysis?",
    options: ["Analyzing emotions", "Using AI to determine the emotional tone of text", "Psychology research", "Music analysis"],
    correctIndex: 1,
    explanation: "Sentiment analysis uses NLP to identify and categorize opinions and emotions expressed in text (positive, negative, neutral).",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is AI inference?",
    options: ["Guessing randomly", "Using a trained model to make predictions on new data", "Training a model", "Deleting data"],
    correctIndex: 1,
    explanation: "Inference is the process of using a trained AI model to make predictions or decisions on new, unseen data.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is transfer learning?",
    options: ["Transferring files", "Reusing a pre-trained model for a new but related task", "Moving AI between computers", "Data migration"],
    correctIndex: 1,
    explanation: "Transfer learning involves taking a model trained on one task and adapting it for a different but related task.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is overfitting in machine learning?",
    options: ["Using too much memory", "When a model learns training data too well and performs poorly on new data", "Too many features", "Excessive training time"],
    correctIndex: 1,
    explanation: "Overfitting occurs when a model memorizes training data instead of learning generalizable patterns, leading to poor performance on new data.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is a dataset?",
    options: ["A collection of data used for training AI models", "A computer desk", "A database server", "A file folder"],
    correctIndex: 0,
    explanation: "A dataset is a structured collection of data (examples, labels, features) used to train and evaluate AI models.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is an AI agent?",
    options: ["A person who sells AI", "A system that perceives its environment and takes actions to achieve goals", "A secret service operative", "A marketing representative"],
    correctIndex: 1,
    explanation: "An AI agent is a system that can perceive its environment through sensors and act upon it to achieve specific goals.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is explainable AI (XAI)?",
    options: ["AI that talks", "AI systems whose decisions can be understood by humans", "Simple AI", "Educational AI"],
    correctIndex: 1,
    explanation: "Explainable AI aims to make AI decision-making processes transparent and understandable to human users.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is the difference between AI and automation?",
    options: ["They are the same", "AI learns and adapts, automation follows fixed rules", "Automation is newer", "AI is only for robots"],
    correctIndex: 1,
    explanation: "AI can learn and adapt from data, while traditional automation follows predetermined rules without learning capability.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is a use case for AI in healthcare?",
    options: ["Building hospitals", "Medical image analysis and diagnosis", "Surgical tools manufacturing", "Hospital billing only"],
    correctIndex: 1,
    explanation: "AI is widely used in healthcare for analyzing medical images, assisting diagnosis, drug discovery, and personalized treatment plans.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is AI-powered fraud detection?",
    options: ["Catching computer viruses", "Using AI to identify suspicious financial transactions", "Password management", "Email filtering"],
    correctIndex: 1,
    explanation: "AI fraud detection analyzes patterns in financial transactions to identify anomalies and potential fraudulent activity.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is edge AI?",
    options: ["AI at the cutting edge", "Running AI models on local devices instead of the cloud", "Border security AI", "Advanced AI"],
    correctIndex: 1,
    explanation: "Edge AI processes data locally on devices (phones, IoT devices) rather than sending it to the cloud, enabling faster responses and better privacy.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is a confusion matrix in AI?",
    options: ["A tool for measuring model prediction accuracy", "A puzzle", "An error message", "A data visualization"],
    correctIndex: 0,
    explanation: "A confusion matrix is a table used to evaluate classification model performance by showing correct and incorrect predictions.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is AI model accuracy?",
    options: ["How fast the model runs", "The percentage of correct predictions made by the model", "Model file size", "Training time"],
    correctIndex: 1,
    explanation: "Accuracy measures what percentage of the model's predictions are correct out of all predictions made.",
    category: "Course Specific",
    difficulty: "EASY" as const,
  },
  {
    question: "What is the AI winter?",
    options: ["Cold weather", "Periods of reduced funding and interest in AI research", "A sci-fi movie", "Winter predictions by AI"],
    correctIndex: 1,
    explanation: "AI winters refer to historical periods when AI research funding and optimism declined due to unmet expectations.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is prompt engineering?",
    options: ["Building prompts", "Crafting effective inputs to get desired outputs from AI models", "Software installation", "Hardware design"],
    correctIndex: 1,
    explanation: "Prompt engineering is the practice of designing and refining inputs to AI language models to get optimal responses.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is AI governance?",
    options: ["Government AI", "Frameworks and policies for responsible AI development and use", "AI that governs countries", "Political science"],
    correctIndex: 1,
    explanation: "AI governance involves establishing policies, regulations, and ethical guidelines for developing and deploying AI systems responsibly.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
  {
    question: "What is synthetic data?",
    options: ["Fake news", "Artificially generated data used to train AI models", "Synthetic materials", "Chemical compounds"],
    correctIndex: 1,
    explanation: "Synthetic data is artificially generated data that mimics real-world data, used to train AI models when real data is limited or sensitive.",
    category: "Course Specific",
    difficulty: "MEDIUM" as const,
  },
];

async function addQuizQuestions() {
  try {
    await connectDB();

    console.log('Finding AI for dummies course...');
    const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });

    if (!course) {
      throw new Error('Course AI_DUMMIES_1DAY_EN not found');
    }

    const lesson = await Lesson.findOne({ courseId: course._id });
    if (!lesson) {
      throw new Error('No lesson found for course');
    }

    console.log(`Course: ${course.name}`);
    console.log(`Lesson: ${lesson.title}`);

    // Get existing question count
    const existingCount = await QuizQuestion.countDocuments({ courseId: course._id });
    console.log(`Existing questions: ${existingCount}`);

    // Add new questions
    const questionsToAdd = additionalQuestions.map(q => ({
      ...q,
      courseId: course._id,
      lessonId: lesson._id,
      questionType: 'recall' as const,
      isActive: true,
      isCourseSpecific: true,
    }));

    const result = await QuizQuestion.insertMany(questionsToAdd);
    
    console.log(`✅ Added ${result.length} new questions`);

    const finalCount = await QuizQuestion.countDocuments({ courseId: course._id });
    console.log(`📊 Total questions now: ${finalCount}`);

    if (finalCount >= 50) {
      console.log('✅ Pool size requirement met! (>= 50 questions)');
    } else {
      console.log(`⚠️  Need ${50 - finalCount} more questions to reach the minimum`);
    }

    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error adding quiz questions');
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addQuizQuestions();
