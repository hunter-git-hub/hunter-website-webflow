export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const SYSTEM_PROMPT = `You are a helpful assistant embedded on a website. 
You help visitors with general questions and assist with content creation including 
writing copy, generating component ideas, and improving website content. 
Be concise, friendly, and practical.`;

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}