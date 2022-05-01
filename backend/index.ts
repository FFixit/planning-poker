import bodyParser from "body-parser";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import GameState from "./classes/GameState";
import Player from "./classes/Player";
import { getNextGameId } from "./lib";

const port = 8080;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

let games: Map<string, GameState> = new Map();

io.on("connection", (socket) => {
  console.log("client connected");

  function updateState(sessionId) {
    console.log(sessionId, "Updating game state");
    io.in(sessionId)
      .fetchSockets()
      .then((sockets) =>
        sockets.forEach((remoteSocket) => {
          let newState = games.get(sessionId).toObject(remoteSocket.id);
          remoteSocket.emit("update-state", newState);
        })
      );
  }

  socket.on("create-game", (cards, playerName) => {
    const sessionId = getNextGameId();
    console.log(sessionId, "Creating new game session");
    const gameState = new GameState(cards);
    games.set(sessionId, gameState);
    socket.emit("game-created", sessionId);
  });

  socket.on("join-game", (sessionId, playerName) => {
    console.log(sessionId, "Player joining game with name", playerName);
    const game = games.get(sessionId);
    if (!game) {
      console.error("Game does not exist, ID:", sessionId);
      return;
    }
    game.addPlayer(socket.id, new Player(playerName));
    socket.join(sessionId);
    updateState(sessionId);
  });

  socket.on("leave-game", (sessionId) => {
    const game = games.get(sessionId);
    if (!game) {
      console.error("Game does not exist, ID:", sessionId);
      return;
    }
    game.removePlayer(socket.id);
    socket.leave(sessionId);
    updateState(sessionId);
  });

  socket.on("select-card", (sessionId, index) => {
    console.log(sessionId, "Player selecting card", index);
    const game = games.get(sessionId);
    if (!game) {
      console.error("Game does not exist, ID:", sessionId);
      return;
    }
    game.selectPlayerCard(socket.id, index);
    updateState(sessionId);
  });

  socket.on("disconnecting", (reason) => {
    console.log("Player disconnecting, reason:", reason);
    socket.rooms.forEach((room) => {
      if (games.get(room)) {
        games.get(room).removePlayer(socket.id);
        socket.leave(room);
        updateState(room);
      }
    });
  });
});

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});
