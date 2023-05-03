// This is used to send messages from the server
// to a specific client or broadcast to multiple clients
interface ServerToClientEvents {
  enteredChat: (msg: string) => void;
  exitedChat: (msg: string) => void;
  chatMessage: (name: string, msg: string) => void;
}

// This is used for the messages from a client
// to the server
interface ClientToServerEvents {
  chatMessage: (msg: string) => void;
}
