import OpenAI from "openai";
const API_KEY = import.meta.env.VITE_OPENAI_KEY;

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const feedMessage = "only the HTML without text";

export class OpenAIClass {
  static async generateMessage(message: string) {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `${message} ${feedMessage}` }],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    return completion.choices[0];
  }
}
