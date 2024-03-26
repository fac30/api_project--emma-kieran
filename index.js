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

app.use(express.urlencoded({ extended: true }), express.json(), cors());

app.get("/login", function (req, res) {
  res.redirect(spotify.getLoginUrl());
});

app.get("/", async (req, res, next) => {
  const code = req.query.code;
  if (code) {
    try {
      await spotify.getToken(req.query.code);
    } catch (e) {
      console.error("Something went wrong");
    }
  }
  next();
});

app.use("/", express.static("public/root"));

app.post("/generate", async (req, res) => {
  // Get the user input from the HTML form
  const userInput = req.body.textInput;
  if (!userInput) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const titles = await openAi.generateSongTitles(userInput);
    const playlistId = await spotify.generatePlaylistFromTitles(titles);
    res.json({ playlistId });
  } catch (e) {
    console.log("error!:", e);
    res.status(500).send("An error occurred while generating song titles.");
  }
});

app.get('/current-album', async (req, res) => {
  try {
    const albumInfo = await spotify.getCurrentPlaybackAlbum();
    if (albumInfo) {
      res.json(albumInfo);
    } else {
      res.status(404).send('Album information not found');
    }
  } catch (error) {
    console.error('Failed to fetch album information:', error);
    res.status(500).send('An error occurred while fetching album information.');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on ${REDIRECT_URI}`);
});
