# Wrong ir skeneris

3D galerija: darbi karājas taisnstūrveida telpā, skatītājs stāv tās vidū.
Uzklikšķinot uz darba, kamera pieiet tam klāt, un telpa aiz muguras aizmiglojas.

Darbus pievieno un noņem caur `/admin.html`. Tie glabājas Vercel Blob glabātuvē,
nevis repozitorijā, tāpēc izmaiņas parādās uzreiz — nekas nav jāiepusho un
nav jāgaida deploys.

## Uzstādīšana

1. **GitHub** — uztaisi repozitoriju un iepusho šo mapi.

2. **Vercel** — Add New → Project → izvēlies repozitoriju → Deploy.
   Framework Preset: Other. Pārējo Vercel paņem no `vercel.json`.

3. **Blob glabātuve** — projekta lapā Vercel: Storage → Create → Blob.
   Piesaisti to projektam. Vercel pats pievieno mainīgo `BLOB_READ_WRITE_TOKEN`.

4. **Parole** — Settings → Environment Variables → pievieno `GALLERY_PASSWORD`
   ar paroli, ko pats izdomā. Tā aizsargā `/admin.html`.

5. **Redeploy** pēc mainīgo pievienošanas, citādi tie nenonāk funkcijās.

6. Atver `tavs-projekts.vercel.app/admin.html`, ievadi paroli un augšupielādē
   darbus no mapes `starter/` — tur ir tie 18, kas galerijā jau bija.
   Var iezīmēt visus uzreiz.

## Ikdienā

- Pievienot: `/admin.html` → "Pievienot failus" vai ievelc tos lodziņā.
- Noņemt: zem katra darba poga "dzēst", divi klikšķi.
- Galerija: `/`

Der `.jpg .jpeg .png .webp .gif .avif` un `.mp4 .webm .mov .m4v`.

## Izmēri

Vercel Blob bezmaksas plānā ir ap 1 GB — praktiski neierobežoti daudz darbu.
Bet katru failu lejupielādē apmeklētājs, tāpēc:

- Attēli: garākā mala ap 1400 px.
- Video: ap 640 px, bez skaņas, īsi. Skaņa netiek atskaņota.

## Kā tas uzbūvēts

- `public/index.html` — galerija: Three.js aina, telpa, zoom. Viss vienā failā.
- `public/admin.html` — darbu pārvaldība.
- `api/works.js` — atdod darbu sarakstu. Publisks.
- `api/upload.js`, `api/delete.js` — pievieno un noņem. Prasa paroli.
- `api/_lib.js` — kopīgais: manifests un autorizācija.
- `starter/` — sākotnējie darbi augšupielādei. Pēc tam mapi var dzēst.

Saraksts un secība glabājas `manifest.json` failā pašā Blob glabātuvē.
Three.js tiek ielādēts no cdnjs.

## Lokāli

    npm i -g vercel
    vercel dev

Vajag `BLOB_READ_WRITE_TOKEN` un `GALLERY_PASSWORD` failā `.env.local`.
