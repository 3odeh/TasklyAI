
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv'); // Import dotenv

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "./frontend")));

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/index.html"));
});
// Initialize Gemini AI Model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// WebSocket handling
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chat message", async (msg) => {
        console.log("User:", msg);
        
        try {
            // const response = await axios.post(
            //     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText",
            //     {
            //         prompt: { text: msg }, // User's message
            //     },
            //     {
            //         params: { key: process.env.GEMINI_API_KEY },
            //         headers: { "Content-Type": "application/json" },
            //     }
            // );

            // const aiResponse = response.data.candidates[0].output || "Sorry, I couldn't understand that.";

            // io.emit("chat message", aiResponse); // Send AI response back
            const result = await model.generateContent(msg);
            const response = await result.response;
            const text = response.text();

            // Send the user's message and the AI's response back to the client
            io.emit("chat message", msg); // Send user's message
            io.emit("chat message", "AI: " + text); // Send AI's response
        } catch (error) {
            console.error("Gemini API Error:", error);
            io.emit("chat message", "Error processing your request.");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
