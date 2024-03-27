import { OpenAI } from "openai";

const makeSystemPrompt = (soundsCount = 5) => `
  You are a highly creative AI capable of constructing amazing spotify playlists based on prompts/themes. 
  Given the user's input, your job is to find ${soundsCount} songs available on Spotify which best match that prompt.
  Please format your reply as a JSON array of objects, each object containing "name" for the song name and "artist" for the primary artist under which the song is released.
  For example, if the prompt is 'relaxation', your output should look like this: [{"name": "Song 1", "artist": "Artist A"}, ...].
  This should strictly adhere to the JSON format for ease of parsing and integration.`;

export class OpenAiApi {
  constructor(apiKey) {
    this.api = new OpenAI({ apiKey });
  }

  async generateSongTitles(userInput) {
    const conversationLog = [
      { role: "system", content: makeSystemPrompt() },
      { role: "user", content: userInput },
    ];

    const result = await this.api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationLog.map(({ role, content }) => ({ role, content })),
    });

    if (result.choices[0].message.content) {
      // Parse JSON directly from the response
      try {
        const songs = JSON.parse(result.choices[0].message.content.trim());
        console.log(songs);
        return songs;
      } catch (error) {
        throw new Error("Failed to parse song titles into JSON.");
      }
    } else {
      throw new Error("Failed to generate song titles.");
    }
  }
}
