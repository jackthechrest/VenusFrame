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

type AnniversaryIdParam = {
  targetAnniversaryId: string;
};

type NewEmailBody = {
  email: string;
};

type AuthRequest = {
  email: string;
  password: string;
};

type RulesOfLoveOptions = 'Rock Candy Heart' | 'Box of Chocolates' | 'Candle' | 'NONE';

type RulesOfLoveBody = {
  gameId: string;
  newPlay: RulesOfLoveOptions;
};

type TypeCode = {
  typeCode: string;
};
