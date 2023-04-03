import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import chalk from 'chalk';

type RequestField = 'query' | 'body' | 'params';

const redBg = chalk.bgRedBright;
const ur = chalk.underline.redBright;
const uc = chalk.underline.cyanBright;

function makeValidator(schema: joi.ObjectSchema<unknown>, prop: RequestField) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(prop in req)) {
      res.sendStatus(500);
      const endpoint = `${req.method} ${req.path}`;
      console.error(
        `\n${redBg('ERROR')}: failed to validate ${ur(prop)} for endpoint: ${uc(endpoint)}. ${ur(
          prop
        )} not defined on request object.\n`
      );
      return;
    }

    const { value, error } = schema.validate(req[prop], {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        escapeHtml: true,
      },
    });

    if (error) {
      const errorMessages = error.details.map((detail: { message: string }) => detail.message);
      res.status(400).json({ errorMessages });
      return;
    }

    req[prop] = value;

    next();
  };
}

export { makeValidator };
