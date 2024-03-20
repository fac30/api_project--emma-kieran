import { OpenAI } from "openai";

export class OpenAiApi {
  constructor(apiKey) {
    this.api = new OpenAI({ apiKey });
  }

  async generateSongTitles(userInput) {
    // Dynamically generate the prompt with user input
    const dynamicPrompt = `Generate a list of creative song titles based on the theme: ${userInput}`;

    // TODO: maybe we need to expand this to ensure a narrowly defined response?
    // We could ask it to generate the songs & spaced with a separator maybe, instead of assuming that they're separated by new lines
    // Initialise a conversation with a system message
    const conversationLog = [
      {
        role: "system",
        content:
          "You are a highly creative AI capable of generating song titles.",
      },
      { role: "user", content: dynamicPrompt },
    ];

    // Call the API to generate a response
    const result = await this.api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationLog.map(({ role, content }) => ({ role, content })),
    });

    // If a message is generated, format and send as reply
    if (result.choices[0].message.content) {
      console.log("Generated message:", result.choices[0].message.content);
      // Assuming the titles are separated by new lines in the AI response
      const titles = result.choices[0].message.content.trim().split("\n");
      return titles;
    } else {
      throw new Error("failsed to generate song titles.");
    }
  }
}
