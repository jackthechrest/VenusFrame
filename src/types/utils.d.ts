type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

type NewUserRequest = {
  username: string;
  email: string;
  password: string;
};

type UserIdParam = {
  userId: string;
};

type NewEmailBody = {
  email: string;
};

// WIP: Store Question IDs here, use short names that line up with what question asks
type QuestionId = 'PlaceholderID1' | 'PlaceholderID2';

type QuestionData = Partial<Record<QuestionId, string>>;
