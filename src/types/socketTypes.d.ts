import { Socket } from 'socket.io';

declare global {
  type CustomWebSocket = Socket<ClientToServerEvents, ServerToClientEvents, null, null>;
}
