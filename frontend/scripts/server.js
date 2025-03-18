const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

io.on("connection", (socket) => {
    console.log("A user connected");
    
    socket.on("sendMessage", (message) => {
        if (message.length) {
            io.emit("receiveMessage", message); // Broadcast message to all users
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
