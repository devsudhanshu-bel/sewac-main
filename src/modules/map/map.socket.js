import { Server } from "socket.io";

let io = null;

export const initializeMapSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Citizen Connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔴 Citizen Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getMapSocket = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};

export const emitTruckLocationUpdated = (truck) => {
  if (!io) return;

  io.emit("truckLocationUpdated", truck);
};