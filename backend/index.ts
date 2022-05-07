import express from "express";
import { Server } from "socket.io";
import http from "http";
import GameState from "./classes/GameState";
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
    const game = getGame(sessionId);
    if (game) {
      let newState = game.toObject();
      io.in(sessionId).emit("update-state", newState);
    }
  }

  socket.on("create-game", (cards, playerName) => {
    const sessionId = getNextGameId();
    console.log(sessionId, "Creating new game session");
    const gameState = new GameState(cards, socket.id, playerName);
    games.set(sessionId, gameState);
    socket.join(sessionId);
    socket.emit("game-created", sessionId);
  });

  socket.on("join-game", (sessionId, playerName) => {
    console.log(sessionId, "Player joining game with name", playerName);
    const game = getGame(sessionId);
    if (game) {
      if (game.hasPlayer(socket.id)) {
        console.log(
          sessionId,
          "Game already has player ID",
          socket.id,
          ", name",
          playerName
        );
      } else {
        game.addPlayer(socket.id, playerName);
        socket.join(sessionId);
      }

      updateState(sessionId);
    }
  });

  socket.on("leave-game", (sessionId) => {
    const game = getGame(sessionId);
    if (game) {
      game.removePlayer(socket.id);
      socket.leave(sessionId);
      updateState(sessionId);
    }
  });

  socket.on("select-card", (sessionId, index) => {
    console.log(sessionId, "Player selecting card", index);
    const game = getGame(sessionId);
    if (game) {
      game.selectPlayerCard(socket.id, index);
      updateState(sessionId);
    }
  });

  socket.on("next-round", (sessionId) => {
    const game = getGame(sessionId);
    if (game) {
      game.resetRound();
      updateState(sessionId);
    }
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

function getGame(sessionId) {
  const game = games.get(sessionId);
  if (!game) {
    console.error("Game does not exist, ID:", sessionId);
    return;
  }
  return game;
}
