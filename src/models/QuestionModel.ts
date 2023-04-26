import { differenceInDays, parseISO } from 'date-fns';
import { AppDataSource } from '../dataSource';
import { Question } from '../entities/Question';

const questionRepository = AppDataSource.getRepository(Question);

async function addQuestion(questionText: string): Promise<Question> {
  let newQuestion = new Question();
  newQuestion.questionText = questionText;

  newQuestion = await questionRepository.save(newQuestion);
  return newQuestion;
}

const dailyQuestions: string[] = [
  'What is the new hobby that you guys are wanting to start together? 🥎',
  'What is your partner’s favorite ice cream flavor? 🍦',
  'Where is the place that you want to visit the most with your partner? ✈️',
  'What is the most important thing that you want your partner to respect you with?',
  'What was your partner’s childhood dream job? 📊',
  'What kind of animal does your partner remind you of? 🐶',
  'In what month is your partner’s Birthday in? 🎂',
  'What color reminds you of your partner? 🎨',
  'How did you guys first meet? 👩‍❤️‍👨',
  'Would you ever get matching tattoos with your partner? 💉',
  "If you found out you just won the lottery what's the first thing you would do? 💰",
  'What do you like most about yourself? 🧘',
  'If you could change careers tomorrow, what would you do? 👨‍🔬',
  'Would you let me to give you a surprise haircut? 💇‍♀️',
  'What is your favorite subject or field of studying? 📚',
];

async function questionExists(question: string): Promise<boolean> {
  return await questionRepository
    .createQueryBuilder('question')
    .where('questionText = :question', { question })
    .getExists();
}

for (const question of dailyQuestions) {
  if (!(await questionExists(question))) await addQuestion(question);
}

async function getQuestionById(questionId: string): Promise<Question | null> {
  return await questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.answer', 'answer')
    .leftJoinAndSelect('answer.user', 'user')
    .select(['question', 'answer', 'user.userId', 'user.email'])
    .where('questionId = :questionId', { questionId })
    .getOne();
}

async function getQuestions(): Promise<Question[]> {
  return await questionRepository.find();
}

async function getTodayQuestion(): Promise<Question> {
  const today = new Date();
  const startISOstring = '2023-04-26T00:00:00.000Z';
  const startDate = parseISO(startISOstring);

  const sendQuestionIndex = differenceInDays(today, startDate);
  const questions = await getQuestions();
  return questions[sendQuestionIndex];
}

export { addQuestion, getQuestionById, getQuestions, getTodayQuestion };
