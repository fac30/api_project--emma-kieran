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

app.use(express.json()); // for parsing application/json

app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;
  
  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
    });

    res.json({ response: completion.choices[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calling OpenAI API');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

