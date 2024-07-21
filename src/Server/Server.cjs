const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');
const secrets = require('./secrets.cjs');
const session = require('express-session');
const app = express();
const port = 3000;

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

// Define the API endpoint for quiz generation
app.post('/generate-quiz', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generator and you will generate 10 questions on data provided by user and provide generated quiz in the below format -\n\n{\n  {\n     {Question : },\n     {option_A :},\n     {option_B :},\n     {option_C :},\n     {option_D :},\n     {Correct_Answer : \"option_\"},\n  },\n\n}"
                },
                {
                    role: "user",
                    content: userInput
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
