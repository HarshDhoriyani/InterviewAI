let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    
    io.on("connection", (socket) => {
        socket.on("join-session", (sessionId) => {
            socket.join(sessionId);
        });
    });
};

const emitSnapshot = (sessionId, data) => {
    if (io) {
        io.to(sessionId).emit("code-snapshot", data);
    }
};


module.exports = { initSocket, emitSnapshot };