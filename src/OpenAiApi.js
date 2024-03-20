import { OpenAI } from "openai";

const makeSystemPrompt = (delimiter = "|", soundsCount = 5) => `
  You are a highly creative AI capable of constructing amazing spotify playlists based on prompts/themes. 
  Whatever the user gives as an input, your job is to find ${soundsCount} song(s) available on spotify which best fit that prompt.
  First, undesrstand the theme which the user is trying to express in their prompt, then generate the list of songs.
  Your reply should be in the form of [song name] - [artist]. Your reply should ONLY contain the song names. Nothing more, Nothing less.
  Nothing should be inlcuded in your reply except for the five songs, delimited by the following character: ${delimiter}.`;

export class OpenAiApi {
  constructor(apiKey) {
    this.api = new OpenAI({ apiKey });
  }

  async generateSongTitles(userInput) {
    // Dynamically generate the prompt with user input

    const delimiter = "|";
    const conversationLog = [
      { role: "system", content: makeSystemPrompt(delimiter) },
      { role: "user", content: userInput },
    ];

    // Call the API to generate a response
    const result = await this.api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationLog.map(({ role, content }) => ({ role, content })),
    });

    // If a message is generated, format and send as reply
    if (result.choices[0].message.content) {
      // Assuming the titles are separated by new lines in the AI response
      const titles = result.choices[0].message.content.trim().split(delimiter);
      return titles;
    } else {
      throw new Error("failsed to generate song titles.");
    }
  }
}
