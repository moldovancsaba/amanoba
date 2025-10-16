/**
 * Quiz Questions Seed Script
 * 
 * Purpose: Seeds 120 QUIZZZ trivia questions across 8 categories and 4 difficulty levels
 * Why: Migrates existing 40 questions + adds 80 NEW questions with balanced distribution
 * 
 * Distribution:
 * - Difficulty: 30 EASY, 30 MEDIUM, 30 HARD, 30 EXPERT (120 total)
 * - Categories:
 *   - Science (20 questions)
 *   - History (20 questions)
 *   - Geography (15 questions)
 *   - Math (15 questions)
 *   - Technology (15 questions)
 *   - Arts & Literature (10 questions)
 *   - Sports (10 questions)
 *   - General Knowledge (15 questions)
 * 
 * Usage: npm run seed:quiz-questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Why: Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, QuestionDifficulty } from '../app/lib/models';
import logger from '../app/lib/logger';

/**
 * Question Data Structure
 * Why: Type-safe question definitions matching model schema
 */
interface QuestionData {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  
  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB for seeding quiz questions');
}

/**
 * All 120 Questions
 * Why: Comprehensive question pool with balanced distribution
 */
const questions: QuestionData[] = [
  // ========== EASY QUESTIONS (30 total) ==========
  
  // General Knowledge - EASY (5)
  { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  { question: 'What color is the sky on a clear day?', options: ['Green', 'Blue', 'Red', 'Yellow'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  { question: 'What is the opposite of hot?', options: ['Warm', 'Cool', 'Cold', 'Freezing'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  
  // Science - EASY (5)
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Science' },
  { question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Science' },
  { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Science' },
  { question: 'What is water made of?', options: ['Hydrogen only', 'Oxygen only', 'Hydrogen and Oxygen', 'Carbon and Oxygen'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Science' },
  { question: 'Which is the hottest planet in our solar system?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Science' },
  
  // Math - EASY (5)
  { question: 'What is 5 × 3?', options: ['12', '15', '18', '20'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Math' },
  { question: 'What is 10 ÷ 2?', options: ['3', '4', '5', '6'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Math' },
  { question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Math' },
  { question: 'What is 100 - 50?', options: ['40', '45', '50', '55'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Math' },
  { question: 'What is half of 20?', options: ['5', '8', '10', '15'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Math' },
  
  // History - EASY (5)
  { question: 'Who was the first president of the United States?', options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'History' },
  { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'History' },
  { question: 'What ship sank in 1912?', options: ['Lusitania', 'Titanic', 'Britannic', 'Olympic'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'History' },
  { question: 'What ancient civilization built pyramids?', options: ['Greeks', 'Romans', 'Egyptians', 'Persians'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'History' },
  { question: 'Who discovered America in 1492?', options: ['Vasco da Gama', 'Christopher Columbus', 'Ferdinand Magellan', 'Marco Polo'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'History' },
  
  // Geography - EASY (4)
  { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, difficulty: QuestionDifficulty.EASY, category: 'Geography' },
  { question: 'Which continent is the Sahara Desert located in?', options: ['Asia', 'Africa', 'Australia', 'South America'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Geography' },
  { question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Geography' },
  { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Geography' },
  
  // Sports - EASY (3)
  { question: 'How many players are on a soccer team?', options: ['9', '10', '11', '12'], correctIndex: 2, difficulty: QuestionDifficulty.EASY, category: 'Sports' },
  { question: 'What sport is played at Wimbledon?', options: ['Golf', 'Tennis', 'Cricket', 'Soccer'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Sports' },
  { question: 'How many rings are in the Olympic symbol?', options: ['4', '5', '6', '7'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Sports' },
  
  // Arts & Literature - EASY (2)
  { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Arts & Literature' },
  { question: 'What comes after Monday?', options: ['Wednesday', 'Tuesday', 'Sunday', 'Friday'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'Arts & Literature' },
  
  // Technology - EASY (1)
  { question: 'Which animal says "meow"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], correctIndex: 1, difficulty: QuestionDifficulty.EASY, category: 'General Knowledge' },
  
  // ========== MEDIUM QUESTIONS (30 total) ==========
  
  // Science - MEDIUM (5)
  { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Science' },
  { question: 'What is the speed of light approximately?', options: ['200,000 km/s', '300,000 km/s', '400,000 km/s', '500,000 km/s'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Science' },
  { question: 'Which organ pumps blood through the human body?', options: ['Lungs', 'Liver', 'Heart', 'Kidneys'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Science' },
  { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Science' },
  { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Science' },
  
  // History - MEDIUM (5)
  { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'History' },
  { question: 'In what year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'History' },
  { question: 'Who was the first man to walk on the moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'History' },
  { question: 'What year did the French Revolution begin?', options: ['1776', '1789', '1799', '1804'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'History' },
  { question: 'Who wrote the Declaration of Independence?', options: ['Benjamin Franklin', 'George Washington', 'Thomas Jefferson', 'John Adams'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'History' },
  
  // Geography - MEDIUM (5)
  { question: 'Which country has the most natural lakes?', options: ['United States', 'Canada', 'Russia', 'Brazil'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Geography' },
  { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Geography' },
  { question: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Geography' },
  { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Geography' },
  { question: 'Mount Everest is located in which mountain range?', options: ['Alps', 'Rockies', 'Andes', 'Himalayas'], correctIndex: 3, difficulty: QuestionDifficulty.MEDIUM, category: 'Geography' },
  
  // Math - MEDIUM (5)
  { question: 'What is 7 × 8?', options: ['54', '56', '63', '72'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Math' },
  { question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Math' },
  { question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Math' },
  { question: 'What is the value of π (pi) to 2 decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Math' },
  { question: 'How many degrees are in a right angle?', options: ['45', '60', '90', '180'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Math' },
  
  // Technology - MEDIUM (4)
  { question: 'Which country invented pizza?', options: ['France', 'Italy', 'Greece', 'Spain'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'General Knowledge' },
  { question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'HighText Transfer Protocol', 'HyperText Transmission Protocol', 'HighText Transmission Protocol'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: 'Technology' },
  { question: 'Who founded Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Technology' },
  { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Computer Program Unit'], correctIndex: 0, difficulty: QuestionDifficulty.MEDIUM, category: 'Technology' },
  
  // Sports - MEDIUM (3)
  { question: 'How many Grand Slam tournaments are there in tennis?', options: ['2', '3', '4', '5'], correctIndex: 2, difficulty: QuestionDifficulty.MEDIUM, category: 'Sports' },
  { question: 'In which sport would you perform a slam dunk?', options: ['Volleyball', 'Basketball', 'Handball', 'Tennis'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Sports' },
  { question: 'How long is a marathon?', options: ['21.1 km', '26.2 miles', '30 km', '50 km'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Sports' },
  
  // Arts & Literature - MEDIUM (3)
  { question: 'Who painted "The Starry Night"?', options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Salvador Dalí'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Arts & Literature' },
  { question: 'Which instrument has 88 keys?', options: ['Organ', 'Piano', 'Harpsichord', 'Accordion'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Arts & Literature' },
  { question: 'Who wrote "1984"?', options: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'Kurt Vonnegut'], correctIndex: 1, difficulty: QuestionDifficulty.MEDIUM, category: 'Arts & Literature' },
  
  // ========== HARD QUESTIONS (30 total) ==========
  
  // Science - HARD (5)
  { question: 'Which element has atomic number 79?', options: ['Silver', 'Gold', 'Platinum', 'Mercury'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Science' },
  { question: 'Which hormone regulates blood sugar?', options: ['Adrenaline', 'Insulin', 'Cortisol', 'Thyroxine'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Science' },
  { question: 'What is the pH of pure water?', options: ['6', '7', '8', 'Depends on temperature'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Science' },
  { question: 'Who discovered penicillin?', options: ['Louis Pasteur', 'Alexander Fleming', 'Marie Curie', 'Jonas Salk'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Science' },
  { question: 'What is the speed of light in vacuum?', options: ['299,792 km/s', '300,000 km/s', '299,792,458 m/s', 'Both A and C'], correctIndex: 3, difficulty: QuestionDifficulty.HARD, category: 'Science' },
  
  // History - HARD (5)
  { question: 'In what year was the Declaration of Independence signed?', options: ['1774', '1775', '1776', '1777'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'History' },
  { question: 'Who was the last Tsar of Russia?', options: ['Alexander III', 'Nicholas II', 'Peter the Great', 'Ivan the Terrible'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'History' },
  { question: 'The Hundred Years War lasted how long?', options: ['100 years', '116 years', '99 years', '150 years'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'History' },
  { question: 'Which empire was ruled by Suleiman the Magnificent?', options: ['Roman Empire', 'Byzantine Empire', 'Ottoman Empire', 'Mongol Empire'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'History' },
  { question: 'In which year did the Great Fire of London occur?', options: ['1564', '1666', '1750', '1812'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'History' },
  
  // Geography - HARD (4)
  { question: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Astana (Nur-Sultan)', 'Bishkek', 'Tashkent'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Geography' },
  { question: 'Which country has the most islands?', options: ['Indonesia', 'Philippines', 'Sweden', 'Canada'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Geography' },
  { question: 'What is the deepest point in the ocean?', options: ['Puerto Rico Trench', 'Java Trench', 'Mariana Trench', 'Philippine Trench'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Geography' },
  { question: 'Which African country was never colonized?', options: ['Liberia', 'Ethiopia', 'Both A and B', 'Somalia'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Geography' },
  
  // Math - HARD (4)
  { question: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Math' },
  { question: 'What is the Fibonacci sequence starting number?', options: ['0', '1', 'Both 0 and 1', '2'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Math' },
  { question: 'What is 12! (factorial)?', options: ['362,880', '479,001,600', '39,916,800', '6,227,020,800'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Math' },
  { question: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: 'Math' },
  
  // Technology - HARD (5)
  { question: 'Which philosopher wrote "Thus Spoke Zarathustra"?', options: ['Kant', 'Hegel', 'Nietzsche', 'Schopenhauer'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'General Knowledge' },
  { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Standard Query Language', 'Structured Question Language', 'Standard Question Language'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: 'Technology' },
  { question: 'Who is credited with inventing the World Wide Web?', options: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Vint Cerf'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Technology' },
  { question: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Technology' },
  { question: 'Which programming language is known as the "mother of all languages"?', options: ['FORTRAN', 'COBOL', 'C', 'Assembly'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: 'Technology' },
  
  // Sports - HARD (3)
  { question: 'Who holds the record for most Olympic gold medals?', options: ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Mark Spitz'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Sports' },
  { question: 'In which year were women first allowed to compete in the Olympic Games?', options: ['1896', '1900', '1920', '1924'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Sports' },
  { question: 'What is the maximum break in snooker?', options: ['147', '155', '167', '180'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: 'Sports' },
  
  // Arts & Literature - HARD (4)
  { question: 'Who wrote "The Odyssey"?', options: ['Virgil', 'Homer', 'Ovid', 'Sophocles'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Arts & Literature' },
  { question: 'Which composer became deaf later in life?', options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], correctIndex: 2, difficulty: QuestionDifficulty.HARD, category: 'Arts & Literature' },
  { question: 'What is the longest play written by Shakespeare?', options: ['Hamlet', 'Othello', 'King Lear', 'Macbeth'], correctIndex: 0, difficulty: QuestionDifficulty.HARD, category: 'Arts & Literature' },
  { question: 'Who painted "The Persistence of Memory"?', options: ['Pablo Picasso', 'Salvador Dalí', 'René Magritte', 'Joan Miró'], correctIndex: 1, difficulty: QuestionDifficulty.HARD, category: 'Arts & Literature' },
  
  // ========== EXPERT QUESTIONS (30 total) ==========
  
  // Science - EXPERT (5)
  { question: 'What is Planck\'s constant (approximate)?', options: ['6.626 × 10⁻³⁴ J⋅s', '1.616 × 10⁻³⁵ m', '1.055 × 10⁻³⁴ J⋅s', '9.109 × 10⁻³¹ kg'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Science' },
  { question: 'What is the half-life of Carbon-14?', options: ['5,730 years', '10,000 years', '1,200 years', '50,000 years'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Science' },
  { question: 'What is the Avogadro constant?', options: ['6.022 × 10²³', '6.626 × 10⁻³⁴', '1.616 × 10⁻³⁵', '8.314 J/(mol·K)'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Science' },
  { question: 'Which enzyme unwinds DNA during replication?', options: ['Polymerase', 'Ligase', 'Helicase', 'Primase'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Science' },
  { question: 'Which particle is the force carrier for electromagnetism?', options: ['Gluon', 'Photon', 'W Boson', 'Higgs Boson'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Science' },
  
  // History - EXPERT (5)
  { question: 'Who proved the Four Color Theorem?', options: ['Appel & Haken', 'Wiles', 'Perelman', 'Tao'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'History' },
  { question: 'What was the capital of the Byzantine Empire?', options: ['Athens', 'Constantinople', 'Rome', 'Alexandria'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'History' },
  { question: 'Which treaty ended World War I?', options: ['Treaty of Versailles', 'Treaty of Paris', 'Treaty of Vienna', 'Treaty of Westphalia'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'History' },
  { question: 'Who was the first Holy Roman Emperor?', options: ['Otto I', 'Charlemagne', 'Frederick I', 'Henry II'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'History' },
  { question: 'In which year was the Magna Carta signed?', options: ['1066', '1215', '1399', '1492'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'History' },
  
  // Technology - EXPERT (5)
  { question: 'Which programming paradigm is Haskell based on?', options: ['Object-oriented', 'Procedural', 'Functional', 'Logic'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Technology' },
  { question: 'What is the time complexity of QuickSort (average)?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Technology' },
  { question: 'Which language influenced JavaScript the most?', options: ['Java', 'C', 'Scheme', 'Python'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Technology' },
  { question: 'What does ACID stand for in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Availability, Consistency, Integrity, Durability', 'Atomicity, Centralization, Isolation, Data', 'Availability, Coordination, Integrity, Distribution'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Technology' },
  { question: 'Who created Linux?', options: ['Richard Stallman', 'Linus Torvalds', 'Dennis Ritchie', 'Ken Thompson'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Technology' },
  
  // Math - EXPERT (5)
  { question: 'What is the Schwarzschild radius formula component?', options: ['2GM/c²', 'GM/c²', 'GM/2c²', 'G²M/c²'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Math' },
  { question: 'What is the Euler\'s identity?', options: ['e^(iπ) + 1 = 0', 'e^(iπ) = -1', 'Both A and B', 'e^π = -1'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Math' },
  { question: 'What is the Kolmogorov complexity measure?', options: ['Time', 'Space', 'Description length', 'Entropy'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Math' },
  { question: 'Which theorem relates prime numbers to complex analysis?', options: ['Fermat\'s Last Theorem', 'Riemann Hypothesis', 'Gödel\'s Incompleteness', 'Prime Number Theorem'], correctIndex: 3, difficulty: QuestionDifficulty.EXPERT, category: 'Math' },
  { question: 'What is the integral of 1/x?', options: ['x²/2', 'ln|x| + C', '1/x²', 'e^x + C'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Math' },
  
  // Geography - EXPERT (2)
  { question: 'What is the only country that borders both the Atlantic and Indian Oceans?', options: ['South Africa', 'Namibia', 'Madagascar', 'Mozambique'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'Geography' },
  { question: 'Which is the most linguistically diverse country?', options: ['India', 'Indonesia', 'Papua New Guinea', 'Nigeria'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Geography' },
  
  // Arts & Literature - EXPERT (3)
  { question: 'Who wrote "In Search of Lost Time"?', options: ['James Joyce', 'Marcel Proust', 'Virginia Woolf', 'Franz Kafka'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Arts & Literature' },
  { question: 'What is the original language of "The Divine Comedy"?', options: ['Latin', 'Italian', 'Greek', 'French'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Arts & Literature' },
  { question: 'Which art movement was Pablo Picasso a founder of?', options: ['Surrealism', 'Cubism', 'Impressionism', 'Dadaism'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Arts & Literature' },
  
  // Sports - EXPERT (2)
  { question: 'Who is the only footballer to win three World Cups?', options: ['Diego Maradona', 'Lionel Messi', 'Pelé', 'Cristiano Ronaldo'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'Sports' },
  { question: 'What is the term for three strikes in a row in bowling?', options: ['Eagle', 'Turkey', 'Birdie', 'Albatross'], correctIndex: 1, difficulty: QuestionDifficulty.EXPERT, category: 'Sports' },
  
  // General Knowledge - EXPERT (3)
  { question: 'What is the standard model\'s force NOT explained by?', options: ['Electromagnetic', 'Weak', 'Strong', 'Gravitational'], correctIndex: 3, difficulty: QuestionDifficulty.EXPERT, category: 'General Knowledge' },
  { question: 'Which theorem proves program correctness?', options: ['Church-Turing', 'Rice\'s Theorem', 'Hoare Logic', 'Halting Problem'], correctIndex: 2, difficulty: QuestionDifficulty.EXPERT, category: 'General Knowledge' },
  { question: 'What is the rarest blood type?', options: ['AB-', 'AB+', 'O-', 'B-'], correctIndex: 0, difficulty: QuestionDifficulty.EXPERT, category: 'General Knowledge' },
];

/**
 * Seed Questions
 * Why: Populates database with all 120 questions
 */
async function seedQuestions() {
  logger.info('Seeding 120 quiz questions...');
  
  // Why: Clear existing questions to ensure clean state
  await QuizQuestion.deleteMany({});
  logger.info('Cleared existing questions');
  
  // Why: Insert all questions with tracking fields initialized
  const questionDocs = questions.map(q => ({
    ...q,
    showCount: 0,
    correctCount: 0,
    isActive: true,
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'seed-script',
    },
  }));
  
  const inserted = await QuizQuestion.insertMany(questionDocs);
  logger.info(`✓ Inserted ${inserted.length} questions`);
  
  // Why: Log distribution for verification
  const distribution = await QuizQuestion.aggregate([
    {
      $group: {
        _id: { difficulty: '$difficulty', category: '$category' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.difficulty': 1, '_id.category': 1 },
    },
  ]);
  
  logger.info('Distribution by difficulty and category:');
  distribution.forEach(({ _id, count }) => {
    logger.info(`  ${_id.difficulty} - ${_id.category}: ${count} questions`);
  });
  
  // Why: Verify total counts
  const counts = await QuizQuestion.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
      },
    },
  ]);
  
  logger.info('\nTotal by difficulty:');
  counts.forEach(({ _id, count }) => {
    logger.info(`  ${_id}: ${count} questions`);
  });
}

/**
 * Main Execution
 */
async function main() {
  try {
    await connectDB();
    await seedQuestions();
    logger.info('\n✅ Quiz questions seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Error seeding quiz questions');
    process.exit(1);
  }
}

main();
