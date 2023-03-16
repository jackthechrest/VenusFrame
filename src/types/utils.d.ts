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
  targetUserId: string;
};

type NewEmailBody = {
  email: string;
};

type AuthRequest = {
  email: string;
  password: string;
};

// WIP: Store Question IDs here, use short names that line up with what question asks
type QuestionId = 'PlaceholderID1' | 'PlaceholderID2';

type QuestionData = Partial<Record<QuestionId, string>>;

type RulesOfLoveOptions = 'Rock Candy Heart' | 'Box of Chocolates' | 'Candle' | 'NONE';

type RulesOfLoveBody = {
  newPlay: RulesOfLoveOptions;
};

// color options for Copycat (in order): white (blank), red, yellow, blue, orange, purple, green
type ColorOptions = 'w' | 'r' | 'y' | 'b' | 'o' | 'p' | 'g';

// roles in Copycat
type CopycatRoles = 'creator' | 'recreator';
