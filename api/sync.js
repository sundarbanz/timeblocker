/* Sync store for Blocks. Keys are scoped to blocks:v1:<id> only.
   Prefer Vercel env UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
   Fallback exists so GitHub→Vercel deploys sync without extra setup;
   claim/rotate the Redis when you can (see chat / Upstash console). */
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://diverse-husky-170843.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAptbAQIgcDExNWJiYWM2YWU5YjY0ZTQzODFlZTY3MDZhYTRkY2FiNg';

function redis(cmd) {
  return fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cmd)
  }).then(async r => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || ('redis ' + r.status));
    return data;
  });
}

function okId(id) {
  return typeof id === 'string' && /^[a-f0-9]{32}$/.test(id);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const id = String((req.query && req.query.id) || '');
  if (!okId(id)) return res.status(400).json({ error: 'bad id' });
  const key = `blocks:v1:${id}`;

  try {
    if (req.method === 'GET') {
      const out = await redis(['GET', key]);
      if (out.result == null) return res.status(404).json({ error: 'empty' });
      const raw = out.result;
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'bad body' });
      }
      const payload = JSON.stringify(body);
      if (payload.length > 500000) return res.status(413).json({ error: 'too large' });
      await redis(['SET', key, payload]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method' });
  } catch (e) {
    return res.status(502).json({ error: 'sync unavailable' });
  }
};
