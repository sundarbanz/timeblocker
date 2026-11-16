# Blocks

A static Mon–Sun week template for time blocking. No calendar dates — just your repeating week. No build step, no frontend dependencies.

## Deploy to Vercel

Option A, CLI:

    npm i -g vercel
    vercel --prod

Option B, GitHub: push this folder to a repo, then import it at vercel.com/new.
Framework preset "Other", no build command, output directory left blank.

After deploy, open the **Vercel URL** on phone and desktop — they sync automatically via the `?s=` link.

## Run locally

`npx vercel dev` (needed for `/api/sync`), or open `index.html` for UI-only (no cross-device sync).

## Notes

- Calendar data syncs across devices when you use the same sync link (Customize → Copy sync link).
- Also saved in the browser; Customize → Export backup for a file copy.
- Installable as a PWA (Add to Home Screen) over HTTPS.
- Everything UI-related is in `index.html`; sync API is `api/sync.js`.
