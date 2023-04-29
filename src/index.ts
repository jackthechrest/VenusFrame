/*
 *  index.ts
 *  Project: Venus Frame
 *
 *  Authors: Jack Chrestman, Hwiyoon Kim
 *  Created on: Feb 25, 2023
 */

import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors

import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { Server } from 'socket.io';
import connectSqlite3 from 'connect-sqlite3';
import { scheduleJob } from 'node-schedule';
import {
  getAllUserProfiles,
  registerUser,
  logIn,
  getUserProfileData,
  findUser,
  updateUserEmail,
  deleteAccount,
  createReminder,
  renderConnectPage,
  renderPreviewPage,
  deleteAllAccounts,
  renderQuestionPage,
  renderaddAnniversaryPage,
  handleFindPartner,
  renderFoundPartnerPage,
  insertTypeCode,
} from './controllers/UserController.js';
import { addNewQuestion, getQuestion } from './controllers/QuestionController';
import { addNewAnswer, renderAnswerPage } from './controllers/AnswerController';
import {
  deleteAllROL,
  intermediateRulesOfLove,
  playRulesOfLove,
} from './controllers/RulesOfLoveController.js';
import {
  insertAnniversary,
  getAnniversaryProfileData,
  getAllAnniversaries,
} from './controllers/AnniversaryController';
import { sendOneDayReminders } from './services/reminderService';
import { sendRemiderAnniversary } from './services/anniversaryReminderService';
import {
  followUser,
  unfollowUser,
  renderFollowingPage,
  renderFollowersPage,
} from './controllers/FollowController';

const app: Express = express();
app.set('view engine', 'ejs');

const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);

const sessionMiddleware = session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }),
  secret: COOKIE_SECRET,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
  name: 'session',
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// endpoints
app.get('/api/users', getAllUserProfiles);
app.post('/users', registerUser);

app.post('/login', logIn);
app.get('/users/PreviewPage', renderPreviewPage);
app.get('/users/FindPartnerId', renderConnectPage);
app.get('/users/:targetUserId', getUserProfileData);
app.post('/users/search', findUser);

// Following/Followers
app.get('/users/follow/:targetUserId', followUser);
app.get('/users/unfollow/:targetUserId', unfollowUser);
app.get('/users/:targetUserId/following', renderFollowingPage);
app.get('/users/:targetUserId/followers', renderFollowersPage);

app.post('/api/users/:userId/email', updateUserEmail);
app.post('/api/users/delete', deleteAccount);
app.post('/api/reminders', createReminder);

// DEBUG
app.get('/api/users/DELETEALL', deleteAllAccounts);
app.get('/api/rulesoflove/DELETEALL', deleteAllROL);

// questions
app.get('/users/:targertUserId/QuestionPage', renderQuestionPage);
app.get('/api/questions', getQuestion);
app.post('/api/questions', addNewQuestion);

// answers
app.get('/question/:questionId/answers/:answerId', renderAnswerPage);
app.post('/api/question/:questionId/answers', addNewAnswer);
// partners
app.get('/users/:userId/partner', handleFindPartner);
app.post('/api/partner', insertTypeCode);
app.get('/users/:targetUserId/FoundPartner', renderFoundPartnerPage);
// rules of love
app.post('/rulesoflove/play', intermediateRulesOfLove);
app.get('/rulesoflove/:gameId', playRulesOfLove);

// anniversary
app.get('/anniversaries/:targetUserId', renderaddAnniversaryPage);
app.post('/api/anniversaries', insertAnniversary);
app.get('/anniversaries/:targetAnniversaryId', getAnniversaryProfileData);
app.get('/anniversaries', getAllAnniversaries);
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

const connectedClients: Record<string, CustomWebSocket> = {};

const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, null, null>(server);

socketServer.use((socket, next) => {
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

socketServer.on('connection', (socket) => {
  const req = socket.request;

  // We need this chunk of code so that socket.io
  // will automatically reload the session data
  // don't change this code
  socket.use((__, next) => {
    req.session.reload((err) => {
      if (err) {
        socket.disconnect();
      } else {
        next();
      }
    });
  });

  // This is just to make sure only logged in users
  // are able to connect to a game
  if (!req.session.isLoggedIn) {
    console.log('An unauthenticated user attempted to connect.');
    socket.disconnect();
    return;
  }

  const { authenticatedUser } = req.session;
  const { username } = authenticatedUser;
  console.log(`${username} has connected`);
  connectedClients[username] = socket;

  socket.on('disconnect', () => {
    delete connectedClients[username];
    console.log(`${username} has disconnected`);
    socketServer.emit('exitedChat', `${username} has left the chat.`);
  });

  socketServer.emit('enteredChat', `${username} has entered the chat`);

  socket.on('chatMessage', (msg: string) => {
    console.log(`received a chatMessage event from the client: ${username}`);
    socketServer.emit('chatMessage', username, msg);
  });
});

scheduleJob('21 15 * * *', sendOneDayReminders);

scheduleJob('21 15 * * *', sendRemiderAnniversary);
