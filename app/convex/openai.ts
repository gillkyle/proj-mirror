"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const evaluateAIFormula = action({
  args: {
    formula: v.string(),
    // Pass the current sheet data as a 2D array of strings
    sheetData: v.array(v.array(v.union(v.string(), v.number(), v.boolean(), v.null()))),
    // Current cell position for context
    row: v.number(),
    col: v.number(),
  },
  handler: async (ctx, { formula, sheetData, row, col }) => {
    // Remove the "=AI:" prefix if it exists
    const prompt = formula.startsWith("=AI:") ? formula.slice(4) : formula;

    // Convert sheet data to a readable format
    const formattedSheetData = sheetData
      .map((row, i) => row.map((cell, j) => `${String.fromCharCode(65 + j)}${i + 1}: ${cell}`).join("\n"))
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a spreadsheet formula generator. Given the current spreadsheet data and a natural language request, generate a valid spreadsheet formula (starting with '='). The formula should work in HyperFormula.

Current cell position: ${String.fromCharCode(65 + col)}${row + 1}
Available data:
${formattedSheetData}`,
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
      throw new Error('Output is not a valid spreadsheet formula');
    }

    return { formula: result };
  },
}); 