import { v4 as uuidv4 } from 'uuid';
import { DeepPartial } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { Question } from '../entities/Question';

const questionRepository = AppDataSource.getRepository(Question);

const dailyQuestions: DailyQuestion[] = [
  {
    answerId: uuidv4(),
    question: 'What is the new hobby that you guys are wanting to start together? 🥎',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'What is your partner’s favorite ice cream flavor? 🍦',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'Where is the place that you want to visit the most with your partner? ✈️',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'What is the most important thing that you want your partner to respect you with?',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'What was your partner’s childhood dream job? 📊',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'What kind of animal does your partner remind you of? 🐶',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'In what month is your partner’s Birthday in? 🎂',
    answers: ['', ''],
  },
  { answerId: uuidv4(), question: 'What color reminds you of your partner? 🎨', answers: ['', ''] },
  { answerId: uuidv4(), question: 'How did you guys first meet? 👩‍❤️‍👨', answers: ['', ''] },
  {
    answerId: uuidv4(),
    question: 'Would you ever get matching tattoos with your partner? 💉',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: "If you found out you just won the lottery what's the first thing you would do? 💰",
    answers: ['', ''],
  },
  { answerId: uuidv4(), question: 'What do you like most about yourself? 🧘', answers: ['', ''] },
  {
    answerId: uuidv4(),
    question: 'If you could change careers tomorrow, what would you do? 👨‍🔬',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'Would you let me to give you a surprise haircut? 💇‍♀️',
    answers: ['', ''],
  },
  {
    answerId: uuidv4(),
    question: 'What is your favorite subject or field of studying? 📚',
    answers: ['', ''],
  },
];

for (let i = 0; i < dailyQuestions.length; i += 1) {
  dailyQuestions[i].answerId = uuidv4();
}

async function addQuestion(questionText: string): Promise<Question> {
  let newQuestion = new Question();
  newQuestion.questionText = questionText;

  newQuestion = await questionRepository.save(newQuestion);
  return newQuestion;
}

async function getQuestionById(questionId: string): Promise<Question | null> {
  return await questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.answer', 'answer')
    .leftJoinAndSelect('answer.user', 'user')
    .select(['question', 'answer', 'user.userId', 'user.email'])
    .where('question = :questionId', { questionId })
    .getOne();
}

async function getQuestions(): Promise<Question[]> {
  return await questionRepository.find();
}

async function postDailyQuestion(question: string): Promise<DailyQuestion> {
  const answerId = uuidv4();
  const newDailyQuestion: DeepPartial<Question> = {
    questionText: question,
    answer: [
      {
        answerText: '',
        user: null,
      },
      {
        answerText: '',
        user: null,
      },
    ],
  };
  const savedQuestion = await questionRepository.save(newDailyQuestion);
  const savedDailyQuestion: DailyQuestion = {
    question: savedQuestion.questionText,
    answerId,
    answers: ['', ''],
  };
  return savedDailyQuestion;
}
async function postDailyQuestionAtScheduledTime(): Promise<void> {
  const questions = await getQuestions();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8); // 8'o clock in the morning
  const timeUntilNextPost = startOfDay.getTime() - now.getTime();

  // If it's already past 8'o clock, post the next question tomorrow instead
  const delay = timeUntilNextPost < 0 ? 24 * 60 * 60 * 1000 - timeUntilNextPost : timeUntilNextPost;

  setTimeout(async () => {
    const index = (now.getDate() - 1) % questions.length; // index starts from 0
    const question = questions[index];

    // Post the question using the postDailyQuestion function
    const dailyQnA = await postDailyQuestion(question.questionText);

    console.log(`Question posted: ${dailyQnA.question}`);

    // Schedule the next post for 24 hours from now
    postDailyQuestionAtScheduledTime();
  }, delay);
}

export {
  addQuestion,
  getQuestionById,
  getQuestions,
  postDailyQuestion,
  postDailyQuestionAtScheduledTime,
};
