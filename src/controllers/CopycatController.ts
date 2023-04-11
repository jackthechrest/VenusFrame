import { Request, Response } from 'express';

async function playCopycat(req: Request, res: Response): Promise<void> {
  res.sendStatus(501);
}

export { playCopycat };
