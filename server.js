//  Require the necessary packages
const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();


const app = express();

// Set the port to 3000
const port = 3000;

// Create an instance of the OpenAI class
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

// Middleware to parse request bodies. If using Express 4.16.0 or newer, you can use express.urlencoded({extended: true})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

app.post('/generate-song-list', async (req, res) => {

    // Get the user input from the html form
  const userInput = req.body.textInput;
  
  if (!userInput) {
    return res.status(400).send('Prompt is required');
  }

    // Initialise a conversation with system message
    let conversationLog = [{ role: 'system', content: "You are a friendly chatbot." }];

    // Add user message to conversation log
    conversationLog.push({
        role: 'user',
        content: message.content
    });

    try {
        // Call API to generate response
        const result = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationLog.map(({ role, content }) => ({ role, content }))
        });

        // Log the result to see if it's populated
        console.log('Result:', result);

        // If a message is generated, send as reply
        if ((result['choices'][0]['message']['content'])) {
            console.log('Generated message:', result['choices'][0]['message']['content']);
            message.reply(result['choices'][0]['message']['content']);
        } else {
            console.log('No message generated.');
        }
    } catch (error) {
        console.error('Error while calling OpenAI:', error);
        return;
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
