const {getSummary} = require("../services/aiService")


test('ai-response', async () => {


    const prompt = {
        date: Date.now,
        moodRating: 4 + 1, 
        note: "Happy today",
      };
    const ai_feedback = await getSummary(prompt);


    expect(typeof ai_feedback).toBe('string');
    expect(ai_feedback.length).toBeGreaterThan(5);
  });
  