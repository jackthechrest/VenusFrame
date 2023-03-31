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
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import {
  getAllUserProfiles,
  registerUser,
  logIn,
  getUserProfileData,
  updateUserEmail,
} from './controllers/UserController.js';
import { playRulesOfLove } from './controllers/RulesOfLoveController.js';

const app: Express = express();
app.use(express.static('public', { extensions: ['html'] }));

const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// endpoints
app.get('/api/users', getAllUserProfiles);
app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.get('/api/users/:userId', getUserProfileData);
app.post('/api/users/:userId/email', updateUserEmail);
app.post('/api/games/rulesoflove/:gameId/:userId', playRulesOfLove);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
