// The gallery reads this. Public, no password.
import { readManifest } from './_lib.js';

export default async function handler(req, res) {
  try {
    const works = await readManifest();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(works);
  } catch (e) {
    res.status(200).json([]);          // an empty room is better than an error
  }
}
