import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { prompt, sheetData } = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Missing or invalid prompt');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant who only responds with spreadsheet functions (starting with '='). No explanations. You use HyperFormula and are inputting the formula into a spreadsheet. The spreadsheet has the following data.
          
        ${sheetData}
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    const result = completion?.choices[0]?.message?.content?.trim();

    if (!result) {
      throw new Error('No result from OpenAI');
    }

    if (!result.startsWith('=')) {
      throw new Error('Output is not a valid spreadsheet function');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ formula: result }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
