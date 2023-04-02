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
import { Server /* Socket */ } from 'socket.io';
import connectSqlite3 from 'connect-sqlite3';
import {
  getAllUserProfiles,
  registerUser,
  logIn,
  getUserProfileData,
  updateUserEmail,
  deleteAccount,
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
app.use(express.json());

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
app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.get('/api/users/:userId', getUserProfileData);
app.post('/api/users/:userId/email', updateUserEmail);
app.post('/api/games/rulesoflove/:gameId/:userId', playRulesOfLove);
app.post('/api/users/delete', deleteAccount);

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
  const { email } = authenticatedUser;

  console.log(`${email} has connected`);
  connectedClients[email] = socket;

  socket.on('disconnect', () => {
    delete connectedClients[email];
    console.log(`${email} has disconnected`);
    socketServer.emit('exitedChat', `${email} has left the chat.`);
  });

  socketServer.emit('enteredChat', `${email} has entered the chat`);

  socket.on('chatMessage', (msg: string) => {
    console.log(`received a chatMessage event from the client: ${email}`);
    socketServer.emit('chatMessage', email, msg);
  });
  // Set their coins to 100 if they haven't been set yet.
  if (req.session.coins === null || req.session.coins === undefined) {
    req.session.coins = 100;
    req.session.save();
  }
  socket.on('sendCoins', (to: string, amount: number): void => {
    console.log(`${email} is attempting to send ${amount} coins to ${to}`);
    if (!(to in connectedClients)) {
      console.log(`${to} not connected`);
      return;
    }

    const receiverSocket = connectedClients[to];
    const { session: senderSession } = socket.request;
    const { session: receiverSession } = receiverSocket.request;

    if (senderSession.coins < amount) {
      console.log(
        `${email} doesn't have enough coins. Has ${senderSession.coins} and is sending ${amount}`
      );
      return;
    }

    senderSession.coins -= amount;
    receiverSession.coins += amount;
    senderSession.save();
    receiverSession.save();

    const toSocket = connectedClients[to];
    const newBalance = receiverSession.coins;
    toSocket.emit('receiveCoins', email, amount, newBalance);
    console.log('receiveCoins', email, amount, newBalance);
  });
});
