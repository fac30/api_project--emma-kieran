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
  let hasToken = spotify.hasAccessToken;

  // Only attempt to get a token if a code is provided and there's no token yet
  if (req.query.code && !hasToken) {
    try {
      await spotify.getToken(req.query.code);
      hasToken = spotify.hasAccessToken();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  }

  // If hasToken query parameter does not match the actual token status, redirect to correct it
  const clientHasTokenParam = req.query.hasToken === "true";
  if (req.query.hasToken === undefined || clientHasTokenParam !== hasToken) {
    return res.redirect(`/?hasToken=${hasToken}`);
  }

  next(); // Continue to serving static files if everything is correct
});

// Middleware to serve static files
app.use(express.static("public/root"));

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

app.listen(PORT, () => {
  console.log(`Server running on ${REDIRECT_URI}`);
});
