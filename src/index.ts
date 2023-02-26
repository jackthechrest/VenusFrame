/*
 *  index.ts
 *  Project: Venus Frame
 *
 *  Authors: Jack Chrestman, Hwiyoon Kim
 *  Created on: Feb 25, 2023
 */

import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import { registerUser, logIn } from './controllers/UserController.js';

const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.post('/api/users', registerUser);
app.post('/api/login', logIn);

app.listen(PORT, () => {
  console.log(`Listening at http://127.0.0.1:${PORT}`);
});
