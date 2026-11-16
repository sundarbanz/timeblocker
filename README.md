# Blocks

A time blocking calendar. Static site: no build step, no dependencies.

## Deploy to Vercel

Option A, CLI:

    npm i -g vercel
    vercel --prod

Option B, GitHub: push this folder to a repo, then import it at vercel.com/new.
Framework preset "Other", no build command, output directory left blank.

## Run locally

Open `index.html`, or `npx serve .`

## Notes

- Data lives in the browser's localStorage (per device). Use Customize > Export backup to move it.
- Everything is in `index.html`: styles at the top, app code at the bottom.
