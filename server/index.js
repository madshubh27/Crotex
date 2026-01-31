const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { connectDB } = require('./config/database');
const Drawing = require('./models/Drawing');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

// Create Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: false,
  },
  transports: ["polling", "websocket"],
});

// Simple data storage
const roomStates = new Map();
const clientRooms = new Map();
const roomUsers = new Map();

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`[Server] Client connected: ${socket.id}`);

  socket.emit("welcome", { message: "Connected to server" });

  socket.on("join", async (room) => {
    if (!room) return;
    if (socket.rooms.has(room)) return;

    console.log(`[Server] Client ${socket.id} joining room: ${room}`);
    socket.join(room);
    clientRooms.set(socket.id, room);

    if (!roomUsers.has(room)) {
      roomUsers.set(room, new Set());
    }
    roomUsers.get(room).add(socket.id);
    const userCount = roomUsers.get(room).size;
    io.to(room).emit("roomUsers", userCount);

    if (roomStates.has(room)) {
      socket.emit("setElements", roomStates.get(room));
    } else {
      try {
        const drawing = await Drawing.findOne({ sessionId: room });
        if (drawing && drawing.data) {
          roomStates.set(room, drawing.data);
          socket.emit("setElements", drawing.data);
        } else {
          roomStates.set(room, []);
        }
      } catch (error) {
        roomStates.set(room, []);
      }
    }
  });

  socket.on("getElements", async ({ elements, room }) => {
    if (!room || !elements) return;
    roomStates.set(room, elements);

    try {
      const existingDrawing = await Drawing.findOne({ sessionId: room });
      if (existingDrawing) {
        existingDrawing.data = elements;
        existingDrawing.updatedAt = new Date();
        await existingDrawing.save();
      }
    } catch (error) {
      console.error(`[Server] Error saving drawing:`, error);
    }
    socket.to(room).emit("setElements", elements);
  });

  socket.on("disconnect", () => {
    console.log(`[Server] Client disconnected: ${socket.id}`);
    const room = clientRooms.get(socket.id);
    if (room && roomUsers.has(room)) {
      roomUsers.get(room).delete(socket.id);
      io.to(room).emit("roomUsers", roomUsers.get(room).size);
    }
    clientRooms.delete(socket.id);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO ready`);
    });
  } catch (error) {
    console.error('❌ DB Error:', error.message);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (Offline Mode)`);
    });
  }
};

startServer();
