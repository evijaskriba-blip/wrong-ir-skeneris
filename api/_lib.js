// Shared helpers for the gallery's small back end.
// Everything lives in a Vercel Blob store: the files themselves plus one
// manifest.json that keeps their order and kind.
import { put, del, list } from '@vercel/blob';

export const MANIFEST = 'manifest.json';

export function authed(req) {
  const pass = process.env.GALLERY_PASSWORD;
  if (!pass) return false;                       // no password set = locked
  const given = req.headers['x-gallery-pass'];
  return typeof given === 'string' && given === pass;
}

export async function manifestUrl() {
  const { blobs } = await list({ prefix: MANIFEST, limit: 1 });
  return blobs.length ? blobs[0].url : null;
}

export async function readManifest() {
  const out=[]; let cursor; do { const page = await list({ prefix: 'works/', cursor, limit: 1000 }); for (const b of page.blobs) { const raw = b.pathname.replace(/^works\//, ''); if (!IMAGE_EXT.test(raw) && !VIDEO_EXT.test(raw)) continue; out.push({ url: b.url, name: raw, kind: VIDEO_EXT.test(raw) ? 'video' : 'image', added: new Date(b.uploadedAt).getTime() }); } cursor = page.cursor; } while (cursor); out.sort((a,b)=>a.added-b.added); return out; const url = null;
  if (!url) return [];
  const r = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
  if (!r.ok) return [];
  try { return await r.json(); } catch { return []; }
}

export async function writeManifest(works) { return null;
  await put(MANIFEST, JSON.stringify(works), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0
  });
  return works;
}

export const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
export const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

export { put, del, list };
