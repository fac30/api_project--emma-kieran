import express from "express";
import cors from "cors";
import { config } from "dotenv";

import { SpotifyApi } from "./src/SpotifyApi.js";
import { OpenAiApi } from "./src/OpenAiApi.js";

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}`;
const { CLIENT_ID, CLIENT_SECRET, OPENAI_KEY } = config().parsed;

const spotify = new SpotifyApi(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const openAi = new OpenAiApi(OPENAI_KEY);

const app = express();

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  cors(),
  express.static("public")
);

app.get("/login", function (req, res) {
  res.redirect(spotify.getLoginUrl());
});

app.get("/", async (req, res) => {
  const code = req.query.code;
  if (code) {
    await spotify.getToken(req.query.code, res);
  }
});

app.post("/generate", async (req, res) => {
  // Get the user input from the HTML form
  const userInput = req.body.textInput;
  if (!userInput) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const titles = await openAi.generateSongTitles(userInput);
    spotify.generatePlaylistFromtitles(titles);
    // res.json({ songTitles: titles });
  } catch (e) {
    res.status(500).send("An error occurred while generating song titles.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${REDIRECT_URI}`);
});
