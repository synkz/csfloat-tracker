export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.status(204).end();
    return;
  }

  const apiKey = process.env.CSFLOAT_API_KEY;
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const query = searchParams.toString();
  const url = `https://csfloat.com/api/v1/listings${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `CSFloat API error: ${response.status}` });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  runtime: 'edge',
};
