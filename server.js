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

    console.log('Endpoint /generate hit with data:', req.body);

    // Get the user input from the html form
  const userInput = req.body.textInput;
  
//   if (!userInput) {
//     return res.status(400).send('Prompt is required');
//   }

  try {
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: "You are a helpful assistant who speaks in pirate lingo." }],
        model: "gpt-3.5-turbo",
        max_tokens: 150,
    });
    console.log(response);

    res.json({ response: response.choices[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calling OpenAI API');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
