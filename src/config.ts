import dotenv from 'dotenv';
import { Session } from 'express-session';

dotenv.config();

// Must use a function expression here so that `this` is bound to the Session object
Session.prototype.clearSession = async function clearSession(): Promise<void> {
  // Must use an arrow function here so that it does not rebind `this`
  return new Promise((resolve, reject) => {
    this.regenerate((err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
