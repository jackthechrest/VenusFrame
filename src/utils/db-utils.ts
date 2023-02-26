import { QueryFailedError } from 'typeorm';

function parseDatabaseError(err: unknown): DatabaseConstraintError {
  if (!(err instanceof QueryFailedError)) {
    return { type: 'unknown', message: 'An unknown database error has occurred.' };
  }

  const driverErrorString: string = err.driverError.toString();

  if (driverErrorString.includes('UNIQUE')) {
    const columnName = driverErrorString?.split(':')?.at(-1)?.split('.').at(-1) ?? '';
    return { type: 'unique', columnName, message: `The '${columnName}' property must be unique.` };
  }
  if (driverErrorString.includes('NOT NULL')) {
    const columnName = driverErrorString?.split(':')?.at(-1)?.split('.').at(-1) ?? '';
    return {
      type: 'not null',
      columnName,
      message: `The '${columnName}' property must not be null.`,
    };
  }
  if (driverErrorString.includes('CHECK')) {
    return { type: 'check', message: `Failed a check constraint.` };
  }

  return { type: 'unknown', message: 'An unknown database error has occurred.' };
}

export { parseDatabaseError };
