export default async function handler(req, res) {
  const apiKey = process.env.CSFLOAT_API_KEY;
  const url = 'https://csfloat.com/api/v1/listings?paint_index=44&min_float=0.01&max_float=0.38&limit=50';

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
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  runtime: 'edge',
};