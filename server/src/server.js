require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./core/websocket");

connectDB();

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});