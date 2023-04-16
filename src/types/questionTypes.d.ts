type NewQuestionRequest = {
  questionMood: string;
  questionText: string;
};

type QuestionIdParam = {
  questionId: string;
};

type DailyQuestion = {
  answerId: string;
  question: string;
  answers: string[];
};
