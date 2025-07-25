require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const app = express();
app.use(express.json());

const client = new OpenAI();

app.post('/invoke', async (req, res) => {
  const { prompt } = req.body;
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: process.env.SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
  });
  res.json(completion.choices[0].message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Aurelius Node Server running on ${PORT}`));
