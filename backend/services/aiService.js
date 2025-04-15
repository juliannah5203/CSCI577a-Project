/*
AI API Limit: 30 req/min, 1500 req/day

Function: getSummary(prompt)
Input: a JSON object prompt
Output: one-setence AI summary given this person's daily check-in info

Input Format: API endpoints doc 2.1
https://docs.google.com/document/d/1CPCvxdlqn9vd1henTZGMY5XNQ2KZz3KU8DVkSr5jD24/edit?tab=t.0
Output Format: one sentence
*/

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

  require("dotenv").config();
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
  };
  
  async function getSummary(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage("We are a mental health app. Give me a one-sentence positive message given this person's input. Here's the daily check-in message: " + JSON.stringify(prompt));
    console.log(result.response.text());
    return result.response.text();
  }

  module.exports = { getSummary };
  
// LOCAL TESTING 

// const prompt = {
//     "date": "2025-02-19",
//     "moodRating": 7,
//     "emotions": ["happy", "calm"],
//     "notes": "Felt refreshed after my morning walk.",
//     "sleepHours": 7,
//     "exerciseMinutes": 30,
//     "medicine": "none",
//     "waterIntake": "2L"
//   };  

//   getSummary(prompt);
