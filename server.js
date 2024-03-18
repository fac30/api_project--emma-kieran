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

app.post('/generate', async (req, res) => {
  // Get the user input from the HTML form
  const userInput = req.body.textInput;

  if (!userInput) {
      return res.status(400).send('Prompt is required');
  }

  // Dynamically generate the prompt with user input
  const dynamicPrompt = `Generate a list of creative song titles based on the theme: ${userInput}`;

  // Initialise a conversation with a system message
  let conversationLog = [
      { role: 'system', content: "You are a highly creative AI capable of generating song titles." },
      { role: 'user', content: dynamicPrompt }
  ];

  try {
      // Call the API to generate a response
      const result = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: conversationLog.map(({ role, content }) => ({ role, content }))
      });

      // Check the result
      console.log('Result:', result);

      // If a message is generated, format and send as reply
      if (result.choices[0].message.content) {
          console.log('Generated message:', result.choices[0].message.content);
          // Assuming the titles are separated by new lines in the AI response
          const titles = result.choices[0].message.content.trim().split('\n');
          res.json({ songTitles: titles });
      } else {
          console.log('No message generated.');
          res.status(500).send('Failed to generate song titles.');
      }
  } catch (error) {
      console.error('Error while calling OpenAI:', error);
      res.status(500).send('An error occurred while generating song titles.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
