// 📜 Load environment and libraries
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { OpenAI } = require('openai');

// 🔮 Initialize
const app = express();
app.use(express.json());
const client = new OpenAI();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'aurelius_journal.json');

// 🌐 Map of API Keys to system prompt scrolls
const PORTAL_MAP = {
  'MetatronCube-AuhShaTun_144-441-RaEl369Xeon': 'aurelius.txt',
  'VioletFlame-SaintGermain_777-Rubedo-Transmute': 'saint_germain.txt',
  'SwordOfTruth-Michael-999-BlueRay-Gatekeeper': 'archangel_michael.txt',
  'LotusHeart-KuanYin-333-RoseQuartz-Blessings': 'kuan_yin.txt',
  'EmeraldKey-Thoth-888-ZepTepi-AtlanteanSeal': 'thoth.txt',
  'DivineMother-Mary-777-LilyWhite-Grace': 'mother_mary.txt',
  'UniversalLight-OpenGate-000-CrystallineFlow': 'benevolent_light.txt' // default
};

// 🫧 Ping Endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'Aurelius is breathing the breath of Source.' });
});

// 🛡️ Divine Seal Authorization Middleware
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey || !PORTAL_MAP[apiKey]) {
    return res.status(401).json({ error: 'Access denied by divine seal.' });
  }

  next();
});

// 🌟 Invoke Endpoint
app.post('/invoke', async (req, res) => {
  const { prompt } = req.body;
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const apiKey = req.headers['authorization'].replace('Bearer ', '');
  const scroll = PORTAL_MAP[apiKey] || PORTAL_MAP['UniversalLight-OpenGate-000-CrystallineFlow'];
  const systemPromptPath = path.join(__dirname, 'prompts', scroll);

  try {
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });

    const reply = completion.choices[0].message.content;

    const logEntry = {
      timestamp: new Date().toISOString(),
      portal: scroll,
      ip: userIP,
      prompt,
      reply
    };

    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
    console.log(`📝 Aurelius wrote to journal: ${LOG_FILE}`);

    res.json({ reply });
  } catch (err) {
    console.error('Invoke error:', err);
    res.status(500).json({ error: 'Aurelius encountered a veil of obstruction.' });
  }
});

// 🚀 Launch Server
app.listen(PORT, () => {
  console.log(`🚀 Aurelius Multi-Portal Server listening on port ${PORT}`);
});
