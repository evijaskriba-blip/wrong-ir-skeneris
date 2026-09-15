// Adds one work. The file arrives as the raw request body.
import { put, readManifest, writeManifest, authed, readBody, VIDEO_EXT, IMAGE_EXT } from './_lib.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!authed(req)) return res.status(401).json({ error: 'nepareiza parole' });

  const name = String(req.query.name || 'darbs');
  if (!IMAGE_EXT.test(name) && !VIDEO_EXT.test(name)) {
    return res.status(400).json({ error: 'der tikai attēli un video' });
  }

  try {
    const body = await readBody(req);
    if (!body.length) return res.status(400).json({ error: 'tukšs fails' });

    const blob = await put('works/' + name, body, {
      access: 'public',
      contentType: req.headers['content-type'] || 'application/octet-stream',
      addRandomSuffix: true
    });

    const works = await readManifest();
    works.push({
      url: blob.url,
      name,
      kind: VIDEO_EXT.test(name) ? 'video' : 'image',
      added: Date.now()
    });
    await writeManifest(works);
    res.status(200).json({ ok: true, work: works[works.length - 1], count: works.length });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
