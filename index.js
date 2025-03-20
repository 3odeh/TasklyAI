
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
if (!model) {
    console.error("Gemini model is not initialized correctly!");
}

const conversationHistory = [];

async function generateAIResponse(userMessage) {
    // Prepend system instructions to the *first* user message *if* it's the very first message.
    let promptToUse = userMessage;
    if (conversationHistory.length === 0) {
        promptToUse = `You are TasklyAI, an AI-powered task management system. You help users organize tasks, manage time, take notes, and create schedules. You have an AI chatbot that schedules tasks based on input data and productivity patterns. Users can manually edit and drag-and-drop tasks. Notes are automatically saved during conversations and linked to tasks. You provide reminders, productivity analytics, and allow users to upload and store tasks, notes, and drawings. User requests will be based on these features. ${userMessage}`;
    }

    conversationHistory.push({ role: "user", content: promptToUse });

    const messages = conversationHistory.map(message => ({
        role: message.role,
        parts: [{ text: message.content }]
    }));

    let aiResponse = "Sorry, there was an error processing your request."; // Default error message
    try {
        const result = await model.generateContent({
            contents: messages,
        });
        const response = await result.response;
        console.log("Full API Response:", response);
        aiResponse = response.text();
        console.log("API Response Text:", aiResponse);
        conversationHistory.push({ role: "model", content: aiResponse });

    } catch (error) {
        console.error("Error generating AI response:", error);
        console.error("Error Details:", error.message);
    }
    console.log("generateAIResponse returning:", aiResponse);
    return aiResponse; // Return the response (either from API or the error message)
}
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

            // const result = await model.generateContent(msg);
            // const response = await result.response;
            // const text = response.text();

            // Send the user's message and the AI's response back to the client
            const aiResponse = await generateAIResponse(msg);
            io.emit("chat message", msg);
            console.log("aiResponse before emit:", aiResponse);
            io.emit("chat message", "AI: " + aiResponse); // Corrected line
        } catch (error) {
            console.error("Error in socket handler:", error);
            io.emit("chat message", "Sorry, there was an unexpected error.");
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
