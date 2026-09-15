// Removes one work, by its blob url.
import { del, readManifest, writeManifest, authed } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!authed(req)) return res.status(401).json({ error: 'nepareiza parole' });

  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'trūkst url' });

  try {
    const works = await readManifest();
    const left = works.filter(w => w.url !== url);
    await writeManifest(left);
    try { await del(url); } catch {}       // manifest is what the gallery reads
    res.status(200).json({ ok: true, count: left.length });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
