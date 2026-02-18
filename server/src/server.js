require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./core/websocket");

const server = http.createServer(app);
initSocket(server);

server.listen(5000, () => {
  console.log("Server + WebSocket running on port 5000");
})