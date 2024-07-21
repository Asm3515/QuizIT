const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const Groq = require('groq-sdk');
const secrets = require('./secrets.cjs');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { PDFExtract } = require('pdf.js-extract'); // Make sure to install this or equivalent library

const app = express();
const port = 3000;

// Use cors middleware
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize Groq SDK with API key
const groq = new Groq({ apiKey: secrets.groqApiKey });

// Use session middleware to store chat history
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/', // Directory where uploaded files will be stored
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Define the API endpoint for PDF upload and quiz generation
app.post('/generate-quiz', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const { numQuestions = 10 } = req.body; // Number of questions to generate

    try {
        // Extract text from the PDF
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extract(filePath);
        const extractedText = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');

        // Generate quiz based on extracted text
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a quiz generator and you will generate ${numQuestions} questions based on the following text. Provide the quiz in the format below:\n\n{\n  {\n     {Question : },\n     {option_A :},\n     {option_B :},\n     {option_C :},\n     {option_D :},\n     {Correct_Answer : "option_"},\n  },\n\n}`
                },
                {
                    role: "user",
                    content: extractedText
                }
            ],
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        res.json({ quiz: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'An error occurred while generating the quiz' });
    }
});

// Define the API endpoint for chat interactions
app.post('/chat', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    // Retrieve chat history from session
    if (!req.session.chatHistory) {
        req.session.chatHistory = [
            {
                role: "system",
                content: "You are an Educational System which helps users to learn and develop an understanding of the concept provided."
            }
        ];
    }

    // Add the user's message to the chat history
    req.session.chatHistory.push({
        role: "user",
        content: userInput
    });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: req.session.chatHistory,
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        // Add the assistant's response to the chat history
        const assistantMessage = chatCompletion.choices[0].message.content;
        req.session.chatHistory.push({
            role: "assistant",
            content: assistantMessage
        });

        // Send back the assistant's response and the chat history
        res.json({
            response: assistantMessage,
            history: req.session.chatHistory
        });
    } catch (error) {
        console.error('Error during chat interaction:', error);
        res.status(500).json({ error: 'An error occurred during the chat interaction' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
